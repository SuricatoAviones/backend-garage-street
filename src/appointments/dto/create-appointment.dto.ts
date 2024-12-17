import { IsDate, IsString } from "class-validator";

export class CreateAppointmentDto {
    @IsDate()
    date: Date

    @IsString()
    observations: string

    @IsString()
    status: string
    
}
