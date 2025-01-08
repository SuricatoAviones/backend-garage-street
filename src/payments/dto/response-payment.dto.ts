import { Appointment } from "src/appointments/entities/appointment.entity";
import { User } from "src/users/entities/user.entity";
import { App } from "supertest/types";

export class ResponsePaymentDto {
    payment_id: number;
    amount: number;
    date: Date;
    reference: string;
    user_id: User;
    appointment_id: Appointment;
    createdAt: Date;
    updatedAt: Date;
    constructor(payment) {
        this.payment_id = payment.payment_id;
        this.amount = payment.amount;
        this.date = payment.date;
        this.reference = payment.reference;
        this.user_id = payment.user_id;
        this.appointment_id = payment.appointment_id;
        this.createdAt = payment.created_at;
        this.updatedAt = payment.updated_at;
    }
}