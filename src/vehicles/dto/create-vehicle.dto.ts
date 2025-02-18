import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVehicleDto {
    @ApiProperty()
    @IsString()
    brand: string;

    @ApiProperty()
    @IsString()
    model: string;

    @ApiProperty()
    @IsString()
    plate: string;

    @ApiProperty()
    @IsString()
    year: string;

    @ApiProperty({ type: Number, description: 'ID of the user' })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)  // Convierte el string a número
    user: number; // Solo necesitamos el ID del usuario
}