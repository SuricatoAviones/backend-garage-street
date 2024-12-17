import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class Appointment {
    @PrimaryGeneratedColumn()
    appointment_id: number

    @Column()
    date: Date

    @Column()
    observations: string

    @Column()
    status: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}
