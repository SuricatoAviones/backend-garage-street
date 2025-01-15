import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Roles } from '../enums/roles.enum';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Payment } from 'src/payments/entities/payment.entity';

@Entity({name:'users'})
export class User {

  @PrimaryGeneratedColumn()
  user_id: number;


  @Column()
  name: string;


  @Column()
  password: string;


  @Column()
  email: string;

  @Column()
  phone: string;


  @Column({ default: Roles.Rol_Trabajador })
  rol: string;

  @OneToMany(()=> Appointment, appointment => appointment.user_id)
  @JoinColumn()
  appointments: Appointment[];

  @OneToMany(()=> Payment, payment => payment.user_id)
  @JoinColumn()
  payments: Payment[];


  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
