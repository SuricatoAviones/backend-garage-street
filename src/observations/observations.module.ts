import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObservationsController } from './observations.controller';
import { ObservationsService } from './observations.service';
import { Observation } from './entities/observation.entity';
import { CloudinaryModule } from 'src/common/services/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Observation]), CloudinaryModule],
  controllers: [ObservationsController],
  providers: [ObservationsService],
  exports: [ObservationsService],
})
export class ObservationsModule {}