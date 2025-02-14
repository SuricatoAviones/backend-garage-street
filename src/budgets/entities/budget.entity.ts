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
import { Service } from 'src/services/entities/service.entity';
import { Product } from 'src/products/entities/product.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';

@Entity({ name: 'budgets' })
export class Budget {
  @PrimaryGeneratedColumn()
  budget_id: number;

  @Column()
  name: string;

  @Column()
  status: string;

  @ManyToMany(() => Service, (service) => service.budgets, { eager: true })
  @JoinTable({
    name: 'appointment_services',
    joinColumn: {
      name: 'budget_id',
      referencedColumnName: 'budget_id',
    },
    inverseJoinColumn: {
      name: 'service_id',
      referencedColumnName: 'service_id',
    },
  })
  services_id: Service[];

  @ManyToMany(() => Product, (product) => product.budgets, { eager: true })
  @JoinTable({
    name: 'appointment_products',
    joinColumn: {
      name: 'budget_id',
      referencedColumnName: 'budget_id',
    },
    inverseJoinColumn: {
      name: 'product_id',
      referencedColumnName: 'product_id',
    },
  })
  products_id: Product[];

  @ManyToMany(() => Appointment, (appointment) => appointment.budgets_id)
  @JoinTable({
    name: 'appointment_budgets',
    joinColumn: {
      name: 'budget_id',
      referencedColumnName: 'budget_id',
    },
    inverseJoinColumn: {
      name: 'appointment_id',
      referencedColumnName: 'appointment_id',
    },
  })
  appointments: Appointment[];
}