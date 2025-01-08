import { Payment } from "src/payments/entities/payment.entity";
import { Product } from "src/products/entities/product.entity";
import { Service } from "src/services/entities/service.entity";
import { User } from "src/users/entities/user.entity";
import { Vehicle } from "src/vehicles/entities/vehicle.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name:'appointments'})
export class Appointment {
    @PrimaryGeneratedColumn()
    appointment_id: number

    @Column()
    date: Date

    @Column()
    observations: string

    @Column()
    status: string;

    @ManyToOne(() => User, user => user.appointments)
    @JoinColumn()
    user_id: User;

    @ManyToOne(() => Vehicle, vehicle => vehicle.appointments)
    @JoinColumn({ name: 'vehicle_id' })
    vehicle_id: Vehicle;

    @ManyToMany(()=> Service, service => service.appointments)
    @JoinColumn()
    services_id: Service[];

    @ManyToMany(()=> Product, product => product.appointments)
    @JoinColumn()
    products_id: Product[];

    @OneToMany(()=> Payment, payment => payment.appointment_id)
    @JoinColumn()
    payments: Payment[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}
