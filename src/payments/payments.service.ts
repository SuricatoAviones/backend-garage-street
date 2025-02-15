import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ResponsePaymentDto } from './dto/response-payment.dto';
import { User } from 'src/users/entities/user.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { PaymentMethod } from 'src/payment-methods/entities/payment-method.entity';
import { CloudinaryService } from 'src/common/services/cloudinary.service';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import {Multer} from 'multer';
@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(PaymentMethod)
    private paymentMethodRepository: Repository<PaymentMethod>,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createPaymentDto: CreatePaymentDto,
    file: Multer.File,
  ): Promise<ResponsePaymentDto> {
    // Verificar si el user_id existe
    const user = await this.userRepository.findOne({
      where: { user_id: createPaymentDto.user_id.user_id },
    });
    if (!user) {
      throw new NotFoundException(
        `User with ID ${createPaymentDto.user_id.user_id} not found`,
      );
    }

    // Verificar si el appointment_id existe
    const appointment = await this.appointmentRepository.findOne({
      where: { appointment_id: createPaymentDto.appointment_id.appointment_id },
    });
    if (!appointment) {
      throw new NotFoundException(
        `Appointment with ID ${createPaymentDto.appointment_id.appointment_id} not found`,
      );
    }

    // Verificar si el payment_method_id existe
    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: {
        payment_method_id: createPaymentDto.payment_method_id.payment_method_id,
      },
    });
    if (!paymentMethod) {
      throw new NotFoundException(
        `Payment Method with ID ${createPaymentDto.payment_method_id.payment_method_id} not found`,
      );
    }

    // Subir la imagen a Cloudinary si se proporciona
    let imgUrl: string = null;
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(file);
      imgUrl = uploadResult.secure_url;
    }

    // Crear el pago
    const payment = this.paymentRepository.create({
      ...createPaymentDto,
      img: imgUrl,
    });
    const savedPayment = await this.paymentRepository.save(payment);

    // Emitir notificación
    this.notificationsGateway.sendNotification('paymentCreated', savedPayment);

    return new ResponsePaymentDto(savedPayment);
  }

  async findAll(): Promise<ResponsePaymentDto[]> {
    try {
      const data = await this.paymentRepository.find({
        relations: ['user_id', 'appointment_id', 'payment_method_id'],
      });
      return data.map((payment) => new ResponsePaymentDto(payment));
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne(payment_id: number): Promise<ResponsePaymentDto> {
    try {
      const payment = await this.paymentRepository.findOne({
        where: { payment_id },
        relations: ['user_id', 'appointment_id', 'payment_method_id'],
      });
      if (!payment) {
        throw new BadRequestException('Payment not found');
      }
      return new ResponsePaymentDto(payment);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(
    payment_id: number,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<ResponsePaymentDto> {
    // Verificar si el pago existe
    const payment = await this.paymentRepository.findOne({
      where: { payment_id },
    });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${payment_id} not found`);
    }

    // Verificar si el user_id existe (si se proporciona)
    if (updatePaymentDto.user_id) {
      const user = await this.userRepository.findOne({
        where: { user_id: updatePaymentDto.user_id.user_id },
      });
      if (!user) {
        throw new NotFoundException(
          `User with ID ${updatePaymentDto.user_id.user_id} not found`,
        );
      }
    }

    // Verificar si el appointment_id existe (si se proporciona)
    if (updatePaymentDto.appointment_id) {
      const appointment = await this.appointmentRepository.findOne({
        where: {
          appointment_id: updatePaymentDto.appointment_id.appointment_id,
        },
      });
      if (!appointment) {
        throw new NotFoundException(
          `Appointment with ID ${updatePaymentDto.appointment_id.appointment_id} not found`,
        );
      }
    }

    // Verificar si el payment_method_id existe (si se proporciona)
    if (updatePaymentDto.payment_method_id) {
      const paymentMethod = await this.paymentMethodRepository.findOne({
        where: {
          payment_method_id:
            updatePaymentDto.payment_method_id.payment_method_id,
        },
      });
      if (!paymentMethod) {
        throw new NotFoundException(
          `Payment Method with ID ${updatePaymentDto.payment_method_id.payment_method_id} not found`,
        );
      }
    }
    try {
      await this.paymentRepository.update(payment_id, {
        amount: updatePaymentDto.amount,
        date: updatePaymentDto.date,
        reference: updatePaymentDto.reference,
        user_id: updatePaymentDto.user_id,
        appointment_id: updatePaymentDto.appointment_id,
        payment_method_id: updatePaymentDto.payment_method_id,
      });
      this.notificationsGateway.sendNotification('PaymentUpdate', updatePaymentDto);

      return this.findOne(payment_id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(payment_id: number): Promise<ResponsePaymentDto> {
    try {
      const payment = await this.findOne(payment_id);
      await this.paymentRepository.delete(payment_id);
      this.notificationsGateway.sendNotification('removePayment', payment);

      return payment;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}