import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { User } from 'src/users/entities/user.entity';
import { PaymentMethod } from 'src/payment-methods/entities/payment-method.entity'; // Importa la entidad PaymentMethod
import { Multer } from 'multer'; // Importa Express para manejar archivos

export class CreatePaymentDto {
    @ApiProperty()
    @IsString()
    reference: string;

    @ApiProperty()
    @IsNumber()
    amount: number;

    @ApiProperty()
    @IsDate()
    date: Date;

    @ApiProperty({ type: 'string', format: 'binary', required: false }) // Indica que es un archivo
    @IsOptional()
    img?: Multer.File; // Cambia el tipo a Express.Multer.File

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