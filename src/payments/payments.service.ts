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
import { Multer } from 'multer';

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

  private parseField(field: any): any {
    try {
      return typeof field === 'string' ? JSON.parse(field) : field;
    } catch (error) {
      return field;
    }
  }

  async create(createPaymentDto: CreatePaymentDto, file: Multer.File): Promise<ResponsePaymentDto> {
    const user = await this.userRepository.findOne({ where: { user_id: createPaymentDto.user_id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${createPaymentDto.user_id} not found`);
    }

    const appointment = await this.appointmentRepository.findOne({ where: { appointment_id: createPaymentDto.appointment_id } });
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${createPaymentDto.appointment_id} not found`);
    }

    const paymentMethod = await this.paymentMethodRepository.findOne({ where: { payment_method_id: createPaymentDto.payment_method_id } });
    if (!paymentMethod) {
      throw new NotFoundException(`Payment Method with ID ${createPaymentDto.payment_method_id} not found`);
    }

    let imgUrl: string = null;
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(file);
      imgUrl = uploadResult.secure_url;
    }

    const payment = this.paymentRepository.create({
      amount: createPaymentDto.amount,
      reference: createPaymentDto.reference,
      date: createPaymentDto.date,
      status: createPaymentDto.status,
      user_id: user,
      appointment_id: appointment,
      payment_method_id: paymentMethod,
      img: imgUrl,
    });

    const savedPayment = await this.paymentRepository.save(payment);

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

  async update(payment_id: number, updatePaymentDto: UpdatePaymentDto): Promise<ResponsePaymentDto> {
    const payment = await this.paymentRepository.findOne({
      where: { payment_id },
      relations: ['user_id', 'appointment_id', 'payment_method_id']
    });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${payment_id} not found`);
    }
  
    // Actualizar los campos simples del pago
    payment.amount = updatePaymentDto.amount || payment.amount;
    payment.date = updatePaymentDto.date || payment.date;
    payment.reference = updatePaymentDto.reference || payment.reference;
    payment.status = updatePaymentDto.status || payment.status; // Asegúrate de actualizar el campo status
  
    if (updatePaymentDto.user_id) {
      const userId = this.parseField(updatePaymentDto.user_id);
      const user = await this.userRepository.findOne({ where: { user_id: userId } });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      payment.user_id = user;
    }
  
    if (updatePaymentDto.appointment_id) {
      const appointmentId = this.parseField(updatePaymentDto.appointment_id);
      const appointment = await this.appointmentRepository.findOne({ where: { appointment_id: appointmentId } });
      if (!appointment) {
        throw new NotFoundException(`Appointment with ID ${appointmentId} not found`);
      }
      payment.appointment_id = appointment;
    }
  
    if (updatePaymentDto.payment_method_id) {
      const paymentMethodId = this.parseField(updatePaymentDto.payment_method_id);
      const paymentMethod = await this.paymentMethodRepository.findOne({ where: { payment_method_id: paymentMethodId } });
      if (!paymentMethod) {
        throw new NotFoundException(`Payment Method with ID ${paymentMethodId} not found`);
      }
      payment.payment_method_id = paymentMethod;
    }
  
    try {
      const savedPayment = await this.paymentRepository.save(payment);
      this.notificationsGateway.sendNotification('PaymentUpdate', updatePaymentDto);
      return new ResponsePaymentDto(savedPayment);
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