import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

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

  @ApiProperty({ type: Number, description: 'ID of the user' })
  @IsNumber()
  @Type(() => Number)
  user_id: number;

  @ApiProperty({ type: Number, description: 'ID of the appointment' })
  @IsNumber()
  @Type(() => Number)
  appointment_id: number;

  @ApiProperty({ type: Number, description: 'ID of the payment method' })
  @IsNumber()
  @Type(() => Number)
  payment_method_id: number;
}