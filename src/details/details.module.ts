import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetailsController } from './details.controller';
import { DetailsService } from './details.service';
import { Detail } from './entities/detail.entity';
import { CloudinaryModule } from 'src/common/services/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Detail]), CloudinaryModule],
  controllers: [DetailsController],
  providers: [DetailsService],
  exports: [DetailsService],
})
export class DetailsModule {}