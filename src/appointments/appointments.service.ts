import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { ResponseAppointmentDto } from './dto/response-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    try {
      const appointment = this.appointmentRepository.create(createAppointmentDto);
      return new ResponseAppointmentDto(
        await this.appointmentRepository.save(appointment),
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll() {
    try {
      const data = await this.appointmentRepository.find();
      return data.map((appointment) => new ResponseAppointmentDto(appointment));
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne(appointment_id: number): Promise<ResponseAppointmentDto> {
    try {
      const appointment = await this.appointmentRepository.findOne({
        where: { appointment_id },
      });
      if (!appointment) {
        throw new BadRequestException('Appointment not found');
      }
      return new ResponseAppointmentDto(appointment); // Added return statement
    } catch (error) {
      throw new BadRequestException(error);
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
      return this.findOne(appointment_id); // Fixed to return the updated appointment
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(appointment_id: number): Promise<ResponseAppointmentDto> {
    try {
      const appointment = this.findOne(appointment_id); // Fixed to await the result
      await this.appointmentRepository.delete(appointment_id);
      return appointment;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
