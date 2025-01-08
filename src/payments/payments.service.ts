import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { ResponsePaymentDto } from './dto/response-payment.dto';

@Injectable()
export class PaymentsService {

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    try {
      const payment = this.paymentRepository.create(createPaymentDto);
      return new ResponsePaymentDto(await this.paymentRepository.save(payment));
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll() {
    try {
      const data = await this.paymentRepository.find();
      return data.map((payment) => new ResponsePaymentDto(payment));
    }
    catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne(payment_id: number) : Promise <ResponsePaymentDto> {
    try {
      const payment = await this.paymentRepository.findOne({
        where: { payment_id },
      });
      if (!payment) {
        throw new BadRequestException('Payment not found');
      }
      return new ResponsePaymentDto(payment);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(payment_id: number, updatePaymentDto: UpdatePaymentDto) {
    try {
      const payment = await this.paymentRepository.update(payment_id,{
        amount: updatePaymentDto.amount,
        date: updatePaymentDto.date,
        reference: updatePaymentDto.reference,
        user_id: updatePaymentDto.user_id,
        appointment_id: updatePaymentDto.appointment_id,
      });
      return this.findOne(payment_id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(payment_id: number) : Promise <ResponsePaymentDto> {
    try {
      const payment = this.findOne(payment_id);
      await this.paymentRepository.delete(payment_id);
      return payment;
    } catch (error) {
      throw new BadRequestException(error);
    } 
  }
}
