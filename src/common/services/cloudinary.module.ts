import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Module({
  providers: [CloudinaryService],
  exports: [CloudinaryService], // Exporta el servicio para que otros módulos puedan usarlo
})
export class CloudinaryModule {}