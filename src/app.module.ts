import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { ProductsModule } from './products/products.module';
import { PaymentsModule } from './payments/payments.module';
import { ServicesModule } from './services/services.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { DetailsModule } from './details/details.module';
import { ObservationsModule } from './observations/observations.module';
import { NotificationsGateway } from './notifications/notifications.gateway';
import { BudgetsModule } from './budgets/budgets.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    VehiclesModule,
    ProductsModule,
    PaymentsModule,
    ServicesModule,
    AppointmentsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
    PaymentMethodsModule,
    DetailsModule,
    ObservationsModule,
    BudgetsModule,
  ],
  providers: [NotificationsGateway],
})
export class AppModule {}