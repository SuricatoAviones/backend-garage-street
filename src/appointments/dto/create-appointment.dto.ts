import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsObject, IsString, IsBoolean, ValidateNested } from 'class-validator';
import { CreateDetailDto } from 'src/details/dto/create-detail.dto';
import { CreateObservationDto } from 'src/observations/dto/create-observation.dto';
import { User } from 'src/users/entities/user.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { Service } from 'src/services/entities/service.entity';
import { Product } from 'src/products/entities/product.entity';

export class CreateAppointmentDto {
  @ApiProperty()
  @IsDate()
  date: Date;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsString()
  typeService: string;

  @ApiProperty()
  @IsBoolean()
  homeService: boolean;

  @ApiProperty({ type: [CreateDetailDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDetailDto)
  details: CreateDetailDto[];

  @ApiProperty({ type: [CreateObservationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateObservationDto)
  observations: CreateObservationDto[];

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