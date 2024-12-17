import { IsString } from 'class-validator';


export class CreateVehicleDto {
    
    @IsString()
    brand: string; 
    
    @IsString()
    model: string;

    @IsString()
    plate: string;

    @IsString()
    year: string;
}
