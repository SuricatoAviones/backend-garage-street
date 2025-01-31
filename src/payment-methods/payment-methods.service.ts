import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentMethod } from './entities/payment-method.entity';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { ResponsePaymentMethodDto } from './dto/response-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';

@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectRepository(PaymentMethod)
    private paymentMethodRepository: Repository<PaymentMethod>,
  ) {}

  async create(
    createPaymentMethodDto: CreatePaymentMethodDto,
  ): Promise<ResponsePaymentMethodDto> {
    try {
      const paymentMethod = this.paymentMethodRepository.create(
        createPaymentMethodDto,
      );
      const savedPaymentMethod =
        await this.paymentMethodRepository.save(paymentMethod);
      return new ResponsePaymentMethodDto(savedPaymentMethod);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll(): Promise<ResponsePaymentMethodDto[]> {
    try {
      const paymentMethods = await this.paymentMethodRepository.find();
      return paymentMethods.map(
        (paymentMethod) => new ResponsePaymentMethodDto(paymentMethod),
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne(payment_method_id: number): Promise<ResponsePaymentMethodDto> {
    try {
      const paymentMethod = await this.paymentMethodRepository.findOne({
        where: { payment_method_id },
      });
      if (!paymentMethod) {
        throw new BadRequestException('Payment method not found');
      }
      return new ResponsePaymentMethodDto(paymentMethod);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(
    payment_method_id: number,
    updatePaymentMethodDto: UpdatePaymentMethodDto,
  ): Promise<ResponsePaymentMethodDto> {
    try {
      const paymentMethod = await this.paymentMethodRepository.update(
        payment_method_id,
        {
          name: updatePaymentMethodDto.name,
          description: updatePaymentMethodDto.description,
        },
      );
      return this.findOne(payment_method_id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(payment_method_id: number): Promise<ResponsePaymentMethodDto> {
    try {
      const paymentMethod = await this.findOne(payment_method_id);
      await this.paymentMethodRepository.delete(payment_method_id);
      return paymentMethod;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
