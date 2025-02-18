import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Roles } from '../enums/roles.enum';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  dni: string;

  @Column({ default: Roles.Rol_Trabajador })
  rol: string;

  @Column({ nullable: true }) // Nuevo campo para la foto de perfil
  profilePicture: string;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.user) // <-- CORRECCIÓN AQUÍ
  vehicles: Vehicle[];

  @OneToMany(() => Appointment, (appointment) => appointment.user_id)
  appointments: Appointment[];

  @OneToMany(() => Payment, (payment) => payment.user_id)
  payments: Payment[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}