import { Appointment } from "src/appointments/entities/appointment.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name:'payments'})
export class Payment {
    @PrimaryGeneratedColumn()
    payment_id: number

    @Column()
    reference: string;

    @Column()
    amount: number

    @Column()
    date: Date;

    @ManyToOne(() => User, user => user.payments)
    @JoinColumn()
    user_id: User;

    @ManyToOne(()=> Appointment, appointment => appointment.payments)
    @JoinColumn()
    appointment_id: Appointment;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
