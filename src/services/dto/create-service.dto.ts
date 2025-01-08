import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';


export class CreateServiceDto {
    
    @IsString()
    @ApiProperty()
    name: string;
    
    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsNumber()
    price: number;
}
