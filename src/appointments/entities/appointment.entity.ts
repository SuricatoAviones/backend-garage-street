import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { User } from 'src/users/entities/user.entity';
  import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
  import { Service } from 'src/services/entities/service.entity';
  import { Product } from 'src/products/entities/product.entity';
  import { Payment } from 'src/payments/entities/payment.entity';
  import { Detail } from 'src/details/entities/detail.entity'; // Importamos Detail
  import { Observation } from 'src/observations/entities/observation.entity'; // Importamos Observation
import { Budget } from 'src/budgets/entities/budget.entity';
  
  @Entity({ name: 'appointments' })
  export class Appointment {
    @PrimaryGeneratedColumn()
    appointment_id: number;
  
    @Column()
    date: Date;
  
    @Column()
    typeService: string;
  
    @Column()
    homeService: boolean;
  
    @Column()
    status: string;
  
    @ManyToOne(() => User, (user) => user.appointments, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user_id: User;
  
    @ManyToOne(() => Vehicle, (vehicle) => vehicle.appointments, { eager: true })
    @JoinColumn({ name: 'vehicle_id' })
    vehicle_id: Vehicle;
  
    @ManyToMany(() => Budget, (budget) => budget.appointments, { eager: true })
  @JoinTable({
    name: 'appointment_budgets',
    joinColumn: {
      name: 'appointment_id',
      referencedColumnName: 'appointment_id',
    },
    inverseJoinColumn: {
      name: 'budget_id',
      referencedColumnName: 'budget_id',
    },
  })
  budgets_id: Budget[];

  
    @OneToMany(() => Payment, (payment) => payment.appointment_id)
    @JoinColumn()
    payments: Payment[];
  
    // Relación 1:N con Details
    @OneToMany(() => Detail, (detail) => detail.appointment, { eager: true })
    details: Detail[];
  
    // Relación 1:N con Observations
    @OneToMany(() => Observation, (observation) => observation.appointment, { eager: true })
    observations: Observation[];
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }