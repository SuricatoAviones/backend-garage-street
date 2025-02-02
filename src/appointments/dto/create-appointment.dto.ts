import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDate, IsObject, IsString, IsBoolean } from "class-validator";
import { Product } from "src/products/entities/product.entity";
import { Service } from "src/services/entities/service.entity";
import { User } from "src/users/entities/user.entity";
import { Vehicle } from "src/vehicles/entities/vehicle.entity";

export class CreateAppointmentDto {
    @ApiProperty()
    @IsDate()
    date: Date;

    @ApiProperty()
    @IsString()
    observations: string;

    @ApiProperty()
    @IsString()
    status: string;

    @ApiProperty()
    @IsString()
    typeService: string;

    @ApiProperty()
    @IsBoolean()
    homeService: boolean;	

    @ApiProperty()
    @IsObject()
    @Type(() => User)
    user_id: User;

    @ApiProperty()
    @IsObject()
    @Type(() => Vehicle)
    vehicle_id: Vehicle;

    @ApiProperty()
    @IsArray()
    @Type(() => Service)
    services_id: Service[];

    @ApiProperty()
    @IsArray()
    @Type(() => Product)
    products_id: Product[];
}