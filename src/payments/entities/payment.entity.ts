import { PaymentMethod } from 'src/payment-methods/entities/payment-method.entity'; // Importa la entidad PaymentMethod
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'payments' })
export class Payment {
    @PrimaryGeneratedColumn()
    payment_id: number;

    @Column()
    reference: string;

    @Column()
    amount: number;

    @Column()
    date: Date;

    @ManyToOne(() => User, user => user.payments)
    @JoinColumn({ name: 'user_id' })
    user_id: User;

    @ManyToOne(() => Appointment, appointment => appointment.payments)
    @JoinColumn({ name: 'appointment_id' })
    appointment_id: Appointment;

    @ManyToOne(() => PaymentMethod, paymentMethod => paymentMethod.payments) // Relación ManyToOne con PaymentMethod
    @JoinColumn({ name: 'payment_method_id' }) // Columna en la tabla payments que referencia a payment_methods
    payment_method_id: PaymentMethod;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}