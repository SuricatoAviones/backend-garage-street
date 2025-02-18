import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { Multer } from 'multer'; // Importa Express para manejar archivos

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

  @ApiProperty({ type: Number, description: 'ID of the vehicle', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  vehicle?: number;

  @ApiProperty({ type: 'string', format: 'binary', required: false }) // Indica que es un archivo
  @IsOptional()
  profilePicture?: Multer.File; // Cambia el tipo a Express.Multer.File

  @ApiProperty()
  @IsString()
  address: string; // Campo para la dirección

  @ApiProperty()
  @IsString()
  dni: string;
}