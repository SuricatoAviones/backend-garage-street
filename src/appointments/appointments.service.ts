import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { ResponseAppointmentDto } from './dto/response-appointment.dto';
import { Logger } from '@nestjs/common';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  private readonly logger = new Logger(AppointmentsService.name);

  async create(createAppointmentDto: CreateAppointmentDto): Promise<ResponseAppointmentDto> {
    this.logger.debug('Creating appointment with DTO:', createAppointmentDto);
    try {
      const appointment = this.appointmentRepository.create(createAppointmentDto);
      const savedAppointment = await this.appointmentRepository.save(appointment);
      this.logger.debug('Saved appointment:', savedAppointment);
      return new ResponseAppointmentDto(savedAppointment);
    } catch (error) {
      this.logger.error('Error creating appointment:', error);
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      const data = await this.appointmentRepository.find({ relations: ['user_id', 'vehicle_id', 'services_id', 'products_id'] });
      return data.map((appointment) => new ResponseAppointmentDto(appointment));
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(appointment_id: number): Promise<ResponseAppointmentDto> {
    try {
      const appointment = await this.appointmentRepository.findOne({
        where: { appointment_id },
        relations: ['user_id', 'vehicle_id', 'services_id', 'products_id'],
      });
      if (!appointment) {
        throw new BadRequestException('Appointment not found');
      }
      return new ResponseAppointmentDto(appointment);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(
    appointment_id: number,
    updateAppointmentDto: UpdateAppointmentDto,
  ) {
    try {
      await this.appointmentRepository.update(
        appointment_id,
        {
          date: updateAppointmentDto.date,
          observations: updateAppointmentDto.observations,
          services_id: updateAppointmentDto.services_id,
          status: updateAppointmentDto.status,
          user_id: updateAppointmentDto.user_id,
          vehicle_id: updateAppointmentDto.vehicle_id,
          products_id: updateAppointmentDto.products_id,
        },
      );
      return this.findOne(appointment_id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(appointment_id: number): Promise<ResponseAppointmentDto> {
    try {
      const appointment = await this.findOne(appointment_id);
      await this.appointmentRepository.delete(appointment_id);
      return appointment;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}