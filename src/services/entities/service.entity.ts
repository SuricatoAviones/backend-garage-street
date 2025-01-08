import { Appointment } from "src/appointments/entities/appointment.entity";
import { Column, CreateDateColumn, JoinColumn, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn, Entity } from "typeorm";

@Entity({name:'services'})
export class Service {
    @PrimaryGeneratedColumn()
    service_id: number;

    @Column()
    name: string;

    @Column()
    description: string;
    
    @Column()
    price: number;

    @ManyToMany(()=> Appointment, appointment => appointment.services_id)
    @JoinColumn()
    appointments: Appointment[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
