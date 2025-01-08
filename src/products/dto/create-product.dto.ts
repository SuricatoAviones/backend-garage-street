import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    @ApiProperty()
    name: string;

    @IsString()
    @ApiProperty()
    description: string;

    @ApiProperty()
    @IsString()
    brand: string;

    @ApiProperty()
    @IsString()
    model: string;

    @ApiProperty()
    @IsNumber()
    price: number;

    @ApiProperty()
    @IsString()
    code: string;
    @IsNumber()
    @ApiProperty()
    stock: number;
}
