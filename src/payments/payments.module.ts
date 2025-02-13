import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { User } from 'src/users/entities/user.entity';
import { PaymentMethod } from 'src/payment-methods/entities/payment-method.entity'; // Importa la entidad PaymentMethod
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { CloudinaryModule } from 'src/common/services/cloudinary.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
    imports: [TypeOrmModule.forFeature([Payment, Appointment, User, PaymentMethod]), CloudinaryModule, NotificationsModule], // Añade PaymentMethod
    controllers: [PaymentsController],
    providers: [PaymentsService],
})
export class PaymentsModule {}