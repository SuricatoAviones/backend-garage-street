import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsDate, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { PaymentMethod } from 'src/payment-methods/entities/payment-method.entity';

export class CreatePaymentDto {
  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsString()
  reference: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty()
  @IsObject()
  @Type(() => User)
  user_id: User;

  @ApiProperty()
  @IsObject()
  @Type(() => Appointment)
  appointment_id: Appointment;

  @ApiProperty()
  @IsObject()
  @Type(() => PaymentMethod)
  payment_method_id: PaymentMethod;
}