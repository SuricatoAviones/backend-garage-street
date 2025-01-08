import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';


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
}
