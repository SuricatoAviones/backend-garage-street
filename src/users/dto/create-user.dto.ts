import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
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

  @ApiProperty({ type: 'string', format: 'binary', required: false }) // Indica que es un archivo
  @IsOptional()
  profilePicture?: Multer.File; // Cambia el tipo a Express.Multer.File
}