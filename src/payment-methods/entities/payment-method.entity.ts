import { Payment } from 'src/payments/entities/payment.entity'; // Importa la entidad Payment
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'payment_methods' })
export class PaymentMethod {
    @PrimaryGeneratedColumn()
    payment_method_id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @OneToMany(() => Payment, payment => payment.payment_method_id) // Relación OneToMany con Payment
    payments: Payment[]; // Un PaymentMethod puede tener muchos Payments

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}