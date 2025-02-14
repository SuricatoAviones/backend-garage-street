import { Appointment } from "src/appointments/entities/appointment.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, Entity, ManyToOne } from "typeorm";

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

    @ManyToOne(() => User, user => user.vehicles)
    user_id: User;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
