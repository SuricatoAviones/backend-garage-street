import { BadRequestException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { ResponseAppointmentDto } from './dto/response-appointment.dto';
import { CloudinaryService } from 'src/common/services/cloudinary.service';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { Multer } from 'multer';
import { User } from 'src/users/entities/user.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { Product } from 'src/products/entities/product.entity';
import { Service } from 'src/services/entities/service.entity';
import { Detail } from 'src/details/entities/detail.entity';
import { Observation } from 'src/observations/entities/observation.entity';
import { Budget } from 'src/budgets/entities/budget.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,
    @InjectRepository(Detail)
    private detailRepository: Repository<Detail>,
    @InjectRepository(Observation)
    private observationRepository: Repository<Observation>,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private readonly logger = new Logger(AppointmentsService.name);

  async create(createAppointmentDto: CreateAppointmentDto, files: Array<Multer.File>): Promise<ResponseAppointmentDto> {
    this.logger.debug('Creating appointment with DTO:', createAppointmentDto);
    try {
      // Verificar si el user_id existe
      const user = await this.userRepository.findOne({
        where: { user_id: createAppointmentDto.user_id.user_id },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${createAppointmentDto.user_id.user_id} not found`);
      }

      // Verificar si el vehicle_id existe
      const vehicle = await this.vehicleRepository.findOne({
        where: { vehicle_id: createAppointmentDto.vehicle_id.vehicle_id },
      });
      if (!vehicle) {
        throw new NotFoundException(`Vehicle with ID ${createAppointmentDto.vehicle_id.vehicle_id} not found`);
      }

      // Verificar si los budgets_id existen
      for (const budget of createAppointmentDto.budgets_id) {
        const budgetEntity = await this.budgetRepository.findOne({
          where: { budget_id: budget.budget_id },
        });
        if (!budgetEntity) {
          throw new NotFoundException(`Budget with ID ${budget.budget_id} not found`);
        }
      }

      // Extraer 'details' y 'observations' del DTO para prevenir errores en la asignación
      const { details, observations, ...appointmentData } = createAppointmentDto;

      // Crear la cita
      const appointment = this.appointmentRepository.create(appointmentData);
      const savedAppointment = await this.appointmentRepository.save(appointment);

      // Crear detalles asociados a la cita
      if (details) {
        for (const detailDto of details) {
          const detail = this.detailRepository.create({
            ...detailDto,
            appointment: savedAppointment,
          });
          await this.detailRepository.save(detail);
        }
      }

      // Crear observaciones asociadas a la cita
      if (observations) {
        for (const observationDto of observations) {
          const observation = this.observationRepository.create({
            ...observationDto,
            appointment: savedAppointment,
          });
          await this.observationRepository.save(observation);
        }
      }

      // Obtener la cita completa con relaciones
      const completeAppointment = await this.appointmentRepository.findOne({
        where: { appointment_id: savedAppointment.appointment_id },
        relations: ['user_id', 'vehicle_id', 'services_id', 'products_id', 'details', 'observations'],
      });

      // Emitir notificación
      this.notificationsGateway.sendNotification('appointmentCreated', savedAppointment);

      return new ResponseAppointmentDto(completeAppointment);
    } catch (error) {
      this.logger.error('Error creating appointment:', error);
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      const data = await this.appointmentRepository.find({
        relations: ['user_id', 'vehicle_id', 'services_id', 'products_id'],
      });
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

  async update(appointment_id: number, updateAppointmentDto: UpdateAppointmentDto) {
    try {
      // Buscar la cita existente con relaciones de observaciones y detalles
      const existingAppointment = await this.appointmentRepository.findOne({
        where: { appointment_id },
        relations: ['observations', 'details'],
      });

      if (!existingAppointment) {
        throw new NotFoundException(`Appointment with ID ${appointment_id} not found`);
      }

      // Extraer 'observations' y 'details' del DTO de actualización
      const { observations, details, ...updateData } = updateAppointmentDto;

      // Actualizar la información principal de la cita
      await this.appointmentRepository.update(appointment_id, updateData);

      // Manejar las observaciones
      if (observations) {
        // Eliminar observaciones existentes
        await this.observationRepository.delete({
          appointment: { appointment_id },
        });

        // Crear nuevas observaciones
        for (const observationDto of observations) {
          const observation = this.observationRepository.create({
            ...observationDto,
            appointment: existingAppointment,
          });
          await this.observationRepository.save(observation);
        }
      }

      // Manejar los detalles
      if (details) {
        // Eliminar detalles existentes
        await this.detailRepository.delete({
          appointment: { appointment_id },
        });

        // Crear nuevos detalles
        for (const detailDto of details) {
          const detail = this.detailRepository.create({
            ...detailDto,
            appointment: existingAppointment,
          });
          await this.detailRepository.save(detail);
        }
      }

      // Emitir notificación
      this.notificationsGateway.sendNotification('appointmentUpdate', updateAppointmentDto);

      // Retornar la cita actualizada con relaciones
      return this.findOne(appointment_id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(appointment_id: number): Promise<ResponseAppointmentDto> {
    try {
      const appointment = await this.findOne(appointment_id);
      await this.appointmentRepository.delete(appointment_id);
      this.notificationsGateway.sendNotification('removeAppointment', appointment);
      return appointment;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}