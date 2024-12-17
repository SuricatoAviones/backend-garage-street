import { IsNumber, IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    name: string;
    @IsString()
    description: string;
    @IsString()
    brand: string;
    @IsString()
    model: string;
    @IsNumber()
    price: number;
    @IsString()
    code: string;
    @IsNumber()
    stock: number;
}
