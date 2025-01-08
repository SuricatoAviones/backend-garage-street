import { Appointment } from "src/appointments/entities/appointment.entity";
import { Column, CreateDateColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, Entity } from "typeorm";

@Entity({name:'vehicles'})
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

    @OneToMany(() => Appointment, appointment => appointment.vehicle_id)
    appointments: Appointment[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
