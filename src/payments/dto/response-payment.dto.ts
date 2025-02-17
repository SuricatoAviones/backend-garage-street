import { Appointment } from 'src/appointments/entities/appointment.entity';
import { User } from 'src/users/entities/user.entity';
import { PaymentMethod } from 'src/payment-methods/entities/payment-method.entity';

export class ResponsePaymentDto {
    payment_id: number;
    amount: number;
    date: Date;
    reference: string;
    img: string;
    status: string;
    user: User;
    appointment: Appointment;
    payment_method: PaymentMethod;
    createdAt: Date;
    updatedAt: Date;

    constructor(payment) {
        this.payment_id = payment.payment_id;
        this.amount = payment.amount;
        this.date = payment.date;
        this.reference = payment.reference;
        this.status = payment.status;
        this.img = payment.img;
        this.user = payment.user_id ? payment.user_id : null;
        this.appointment = payment.appointment_id ? payment.appointment_id : null;
        this.payment_method = payment.payment_method_id ? payment.payment_method_id : null;
        this.createdAt = payment.created_at;
        this.updatedAt = payment.updated_at;
    }
}