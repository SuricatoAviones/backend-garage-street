import { Payment } from "src/payments/entities/payment.entity";
import { Product } from "src/products/entities/product.entity";
import { Service } from "src/services/entities/service.entity";
import { User } from "src/users/entities/user.entity";
import { Vehicle } from "src/vehicles/entities/vehicle.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from "typeorm";

@Entity({name:'appointments'})
export class Appointment {
    @PrimaryGeneratedColumn()
    appointment_id: number

    @Column()
    date: Date

    @Column()
    observations: string

    @Column({nullable: true})
    typeService: string

    @Column({nullable: true})
    homeService: boolean

    @Column()
    status: string;

    @ManyToOne(() => User, user => user.appointments, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user_id: User;

    @ManyToOne(() => Vehicle, vehicle => vehicle.appointments, { eager: true })
    @JoinColumn({ name: 'vehicle_id' })
    vehicle_id: Vehicle;

    @ManyToMany(() => Service, service => service.appointments, { eager: true })
    @JoinTable({
        name: 'appointment_services',
        joinColumn: { name: 'appointment_id', referencedColumnName: 'appointment_id' },
        inverseJoinColumn: { name: 'service_id', referencedColumnName: 'service_id' }
    })
    services_id: Service[];

    @ManyToMany(() => Product, product => product.appointments, { eager: true })
    @JoinTable({
        name: 'appointment_products',
        joinColumn: { name: 'appointment_id', referencedColumnName: 'appointment_id' },
        inverseJoinColumn: { name: 'product_id', referencedColumnName: 'product_id' }
    })
    products_id: Product[];

    @OneToMany(() => Payment, payment => payment.appointment_id)
    @JoinColumn()
    payments: Payment[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}