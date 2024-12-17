import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class Payment {
    @PrimaryGeneratedColumn()
    payment_id: number

    @Column()
    reference: string;

    @Column()
    amount: number

    @Column()
    date: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
