import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Multer } from 'multer'; // Importa Express para manejar archivos
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  rol: string;

  @ApiProperty({ type: Vehicle })
  @IsOptional()
  @ValidateNested()
  @Type(() => Vehicle)
  vehicle?: Vehicle;

  @ApiProperty({ type: 'string', format: 'binary', required: false }) // Indica que es un archivo
  @IsOptional()
  profilePicture?: Multer.File; // Cambia el tipo a Express.Multer.File
}