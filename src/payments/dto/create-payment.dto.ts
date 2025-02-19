import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { Multer } from 'multer'; // Importa Express para manejar archivos
export class CreatePaymentDto {
  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsString()
  reference: string;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  date: Date;

   @ApiProperty({ type: 'string', format: 'binary', required: false }) // Indica que es un archivo
    @IsOptional()
    img?: Multer.File;

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