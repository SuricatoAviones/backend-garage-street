import { Appointment } from "src/appointments/entities/appointment.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name:'products'})
export class Product {
    @PrimaryGeneratedColumn()
    product_id: number

    @Column()
    name: string

    @Column()
    description: string

    @Column()
    brand: string

    @Column()
    model: string

    @Column()
    price: number

    @Column()
    code: string;

    @Column()
    stock: number;

    @ManyToMany(()=> Appointment, appointment => appointment.products_id)
    @JoinColumn()
    appointments: Appointment[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}
