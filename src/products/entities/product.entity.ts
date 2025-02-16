import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Budget } from 'src/budgets/entities/budget.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  product_id: number;

  @Column()
  name: string;

  @Column({nullable: true})
  description: string;

  @Column({nullable: true})
  brand: string;

  @Column({nullable: true})
  model: string;

  @Column({nullable: true})
  price: number;

  @Column({nullable: true})
  code: string;

  @Column({nullable: true})
  stock: number;

  @ManyToMany(() => Budget, (budget) => budget.products_id)
  @JoinColumn()
  budgets: Budget[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
