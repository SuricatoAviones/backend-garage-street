import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Appointment } from 'src/appointments/entities/appointment.entity';

@Entity('observations')
export class Observation {
  @PrimaryGeneratedColumn()
  observation_id: number;

  @Column() // Cambiado a string ya que se espera un texto simple
  text: string;

  @Column('simple-array') // Definido como arreglo de strings para almacenar varias URLs
  img: string[];

  @ManyToOne(() => Appointment, (appointment) => appointment.observations)
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}