import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class Vehicle {
    @PrimaryGeneratedColumn()
    vehicle_id: number;

    @Column()
    brand: string;

    @Column()
    model: string;

    @Column()
    plate: string;

    @Column()
    year: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
