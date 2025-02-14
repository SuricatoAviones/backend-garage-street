import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { CloudinaryModule} from 'src/common/services/cloudinary.module';
import { User } from 'src/users/entities/user.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { Service } from 'src/services/entities/service.entity';
import { Product } from 'src/products/entities/product.entity';
import { Appointment } from './entities/appointment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Observation } from 'src/observations/entities/observation.entity';
import { Detail } from 'src/details/entities/detail.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { Budget } from 'src/budgets/entities/budget.entity';



@Module({
  imports: [TypeOrmModule.forFeature([User, Appointment, Vehicle, Service, Product, Observation, Detail, Budget ]), CloudinaryModule, NotificationsModule ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}