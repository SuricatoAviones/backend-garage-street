import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDate, IsObject, IsString, IsBoolean, ValidateNested } from "class-validator";
import { Product } from "src/products/entities/product.entity";
import { Service } from "src/services/entities/service.entity";
import { User } from "src/users/entities/user.entity";
import { Vehicle } from "src/vehicles/entities/vehicle.entity";
import { Multer } from 'multer'; 

class Observation {
    @ApiProperty({ type: 'string', format: 'binary' })
    img: Multer.File;

    @ApiProperty()
    @IsString()
    text: string;
}

class Detail {
    @ApiProperty({ type: 'string', format: 'binary' })
    img: Multer.File;

    @ApiProperty()
    @IsString()
    text: string;
}

export class CreateAppointmentDto {
    @ApiProperty()
    @IsDate()
    date: Date;

    @ApiProperty({ type: [Observation] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Observation)
    observations: Observation[];

    @ApiProperty()
    @IsString()
    status: string;

    @ApiProperty()
    @IsString()
    typeService: string;

    @ApiProperty()
    @IsBoolean()
    homeService: boolean;

    @ApiProperty({ type: [Detail] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Detail)
    details: Detail[];

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