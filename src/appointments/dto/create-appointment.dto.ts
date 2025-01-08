import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, isArray, IsDate, IsOptional, IsString } from "class-validator";
import { Product } from "src/products/entities/product.entity";
import { Service } from "src/services/entities/service.entity";
import { User } from "src/users/entities/user.entity";
import { Vehicle } from "src/vehicles/entities/vehicle.entity";

export class CreateAppointmentDto {
    @ApiProperty()
    @IsDate()
    date: Date

    @ApiProperty()
    @IsString()
    observations: string

    @ApiProperty()
    @IsString()
    status: string

    @ApiProperty()
    @IsOptional()
    @Type(()=> User)
    user_id: User

    @ApiProperty()
    @IsOptional()
    @Type(()=> Vehicle)
    vehicle_id: Vehicle

    @ApiProperty()
    @Type(()=> Service)
    @IsOptional()

    @IsArray()
    services_id: Service[]

    @ApiProperty()
    @Type(()=> Product)
    @IsOptional()

    @IsArray()
    products_id: Product[]


    
}
