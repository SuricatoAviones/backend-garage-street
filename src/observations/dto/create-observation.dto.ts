import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { Multer } from 'multer';
export class CreateObservationDto {
    @ApiProperty({ type: 'string', format: 'binary', required: false })
    @IsOptional()
    img?: Multer.File;
  
    @ApiProperty()
    @IsString()
    text: string; 
}
