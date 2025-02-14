import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsArray, IsOptional } from 'class-validator';
import { Product } from 'src/products/entities/product.entity';
import { Service } from 'src/services/entities/service.entity';

export class CreateBudgetDto {
  @IsString()
  name: string;

  @IsString()
  status: string;

  @ApiProperty()
  @IsOptional()
    @IsArray()
    @Type(() => Service)
    services_id?: Service[];
  
    @ApiProperty()
    @IsOptional()
    @IsArray()
    @Type(() => Product)
    products_id?: Product[];
}