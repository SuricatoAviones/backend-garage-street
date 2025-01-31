import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsObject, IsString } from 'class-validator';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { User } from 'src/users/entities/user.entity';
import { PaymentMethod } from 'src/payment-methods/entities/payment-method.entity'; // Importa la entidad PaymentMethod

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
    @Type(() => PaymentMethod) // Añade el campo payment_method_id
    payment_method_id: PaymentMethod;
}