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

  async create(
    createAppointmentDto: CreateAppointmentDto,
    files: Array<Multer.File>,
  ): Promise<ResponseAppointmentDto> {
    this.logger.debug('Creating appointment with DTO:', createAppointmentDto);
    try {
      // Verificar que el usuario exista
      const user = await this.userRepository.findOne({
        where: { user_id: createAppointmentDto.user_id.user_id },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${createAppointmentDto.user_id.user_id} not found`);
      }

      // Verificar que el vehículo exista
      const vehicle = await this.vehicleRepository.findOne({
        where: { vehicle_id: createAppointmentDto.vehicle_id.vehicle_id },
      });
      if (!vehicle) {
        throw new NotFoundException(`Vehicle with ID ${createAppointmentDto.vehicle_id.vehicle_id} not found`);
      }

      // Procesar budgets enviados en el payload:
      // Si el objeto posee budget_id se asume que es un presupuesto existente;
      // de lo contrario se crea un nuevo budget.
      const budgetsToAssign: Budget[] = [];
      if (createAppointmentDto.budgets_id && Array.isArray(createAppointmentDto.budgets_id)) {
        for (const budgetDto of createAppointmentDto.budgets_id) {
          if (budgetDto.budget_id) {
            const existingBudget = await this.budgetRepository.findOne({
              where: { budget_id: budgetDto.budget_id },
            });
            if (!existingBudget) {
              throw new NotFoundException(`Budget with ID ${budgetDto.budget_id} not found`);
            }
            budgetsToAssign.push(existingBudget);
          } else {
            // Crear nuevo budget con los datos provistos
            const newBudget = this.budgetRepository.create(budgetDto);
            const savedBudget = await this.budgetRepository.save(newBudget);
            budgetsToAssign.push(savedBudget);
          }
        }
      }

      // Extraer propiedades anidadas para evitar errores de asignación
      const { details, observations, budgets_id, ...appointmentData } = createAppointmentDto;
      // Asignar los budgets procesados a la cita; se usa aserción de tipo en caso de que no forme parte del DTO original
      (appointmentData as any).budgets_id = budgetsToAssign;

      // Crear la cita
      const appointment = this.appointmentRepository.create(appointmentData);
      const savedAppointment = await this.appointmentRepository.save(appointment);

      // Crear detalles asociados a la cita
      if (details && Array.isArray(details)) {
        for (const detailDto of details) {
          const detail = this.detailRepository.create({
            ...detailDto,
            appointment: savedAppointment,
          });
          await this.detailRepository.save(detail);
        }
      }

      // Crear observaciones asociadas a la cita
      if (observations && Array.isArray(observations)) {
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
        relations: [
          'user_id',
          'vehicle_id',
          'details',
          'observations',
          'budgets_id',
        ],
      });

      // Emitir notificación
      this.notificationsGateway.sendNotification('appointmentCreated', savedAppointment);

      return new ResponseAppointmentDto(completeAppointment);
    } catch (error) {
      this.logger.error('Error creating appointment:', error);
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<ResponseAppointmentDto[]> {
    try {
      const data = await this.appointmentRepository.find({
        relations: ['user_id', 'vehicle_id', 'budgets_id'],
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
        relations: ['user_id', 'vehicle_id',  'details', 'observations', 'budgets_id'],
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
      // Buscar la cita existente con relaciones de observaciones, detalles y budgets
      const existingAppointment = await this.appointmentRepository.findOne({
        where: { appointment_id },
        relations: ['observations', 'details', 'budgets_id'],
      });
      if (!existingAppointment) {
        throw new NotFoundException(`Appointment with ID ${appointment_id} not found`);
      }

      // Extraer observaciones, detalles y budgets del payload
      const { details, observations, budgets_id, ...updateData } = updateAppointmentDto;

      // Procesar budgets enviados en el payload para la actualización
      if (budgets_id && Array.isArray(budgets_id)) {
        const updatedBudgets: Budget[] = [];
        for (const budgetDto of budgets_id) {
          if (budgetDto.budget_id) {
            const existingBudget = await this.budgetRepository.findOne({
              where: { budget_id: budgetDto.budget_id },
            });
            if (!existingBudget) {
              throw new NotFoundException(`Budget with ID ${budgetDto.budget_id} not found`);
            }
            updatedBudgets.push(existingBudget);
          } else {
            const newBudget = this.budgetRepository.create(budgetDto);
            const savedBudget = await this.budgetRepository.save(newBudget);
            updatedBudgets.push(savedBudget);
          }
        }
        (updateData as any).budgets_id = updatedBudgets;
      }

      // Actualizar la información principal de la cita
      await this.appointmentRepository.update(appointment_id, updateData);

      // Manejar observaciones: eliminar las existentes y crearlas de nuevo
      if (observations) {
        await this.observationRepository.delete({ appointment: { appointment_id } });
        for (const observationDto of observations) {
          const observation = this.observationRepository.create({
            ...observationDto,
            appointment: existingAppointment,
          });
          await this.observationRepository.save(observation);
        }
      }

      // Manejar detalles: eliminar los existentes y crearlos de nuevo
      if (details) {
        await this.detailRepository.delete({ appointment: { appointment_id } });
        for (const detailDto of details) {
          const detail = this.detailRepository.create({
            ...detailDto,
            appointment: existingAppointment,
          });
          await this.detailRepository.save(detail);
        }
      }

      // Emitir notificación de actualización
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