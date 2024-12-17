import { IsDate, IsNumber, IsString } from "class-validator";

export class CreatePaymentDto {
    @IsString()
    reference: string

    @IsNumber()
    amount: number

    @IsDate()
    date: Date;
}
