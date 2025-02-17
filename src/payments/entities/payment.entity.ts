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

    @Column({type: 'numeric'})
    amount: number;

    @Column()
    date: Date;

    @Column({ nullable: true })
    img: string;

    @Column({ nullable: true })
    status: string;

    @ManyToOne(() => User, user => user.payments)
    @JoinColumn({ name: 'user_id' })
    user_id: User;

    @ManyToOne(() => Appointment, appointment => appointment.payments)
    @JoinColumn({ name: 'appointment_id' })
    appointment_id: Appointment;

    @ManyToOne(() => PaymentMethod, paymentMethod => paymentMethod.payments) 
    @JoinColumn({ name: 'payment_method_id' }) 
    payment_method_id: PaymentMethod;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}