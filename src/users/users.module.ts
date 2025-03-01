import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { CloudinaryModule } from 'src/common/services/cloudinary.module';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User, Appointment, Payment, Vehicle]), CloudinaryModule,],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
