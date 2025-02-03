import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { ResponseAppointmentDto } from './dto/response-appointment.dto';
import { Logger } from '@nestjs/common';
import { CloudinaryService } from 'src/common/services/cloudinary.service';
import { Multer } from 'multer';
import { User } from 'src/users/entities/user.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { Product } from 'src/products/entities/product.entity';
import { Service } from 'src/services/entities/service.entity';
import { Detail } from 'src/details/entities/detail.entity';
import { Observation } from 'src/observations/entities/observation.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Detail)
    private detailRepository: Repository<Detail>,
    @InjectRepository(Observation)
    private observationRepository: Repository<Observation>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
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

      // Verificar si los services_id existen
      for (const service of createAppointmentDto.services_id) {
        const serviceEntity = await this.serviceRepository.findOne({
          where: { service_id: service.service_id },
        });
        if (!serviceEntity) {
          throw new NotFoundException(`Service with ID ${service.service_id} not found`);
        }
      }

      // Verificar si los products_id existen
      for (const product of createAppointmentDto.products_id) {
        const productEntity = await this.productRepository.findOne({
          where: { product_id: product.product_id },
        });
        if (!productEntity) {
          throw new NotFoundException(`Product with ID ${product.product_id} not found`);
        }
      }

      // Crear la cita
      const appointment = this.appointmentRepository.create(createAppointmentDto);
      const savedAppointment = await this.appointmentRepository.save(appointment);

      // Crear detalles y observaciones asociadas a la cita
      if (createAppointmentDto.details) {
        for (const detailDto of createAppointmentDto.details) {
          const detail = this.detailRepository.create({
            ...detailDto,
            appointment: savedAppointment,
          });
          await this.detailRepository.save(detail);
        }
      }

      if (createAppointmentDto.observations) {
        for (const observationDto of createAppointmentDto.observations) {
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

      return new ResponseAppointmentDto(completeAppointment);
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
          typeService: updateAppointmentDto.typeService,
          homeService: updateAppointmentDto.homeService,
          services_id: updateAppointmentDto.services_id,
          status: updateAppointmentDto.status,
          details: updateAppointmentDto.details,
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