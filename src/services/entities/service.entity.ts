import { Appointment } from "src/appointments/entities/appointment.entity";
import { Budget } from "src/budgets/entities/budget.entity";
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

    @ManyToMany(()=> Budget, budget => budget.services_id)
    @JoinColumn()
    budgets: Budget[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
