import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';
import { Multer } from 'multer';
export class CreateObservationDto {
    @ApiProperty({ type: 'string', format: 'binary', required: false })
    @IsArray()
    @IsOptional()
    img?: Multer.File[];
  
    @ApiProperty()
    @IsString()
    text: string; 
}
