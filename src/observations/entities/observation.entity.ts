import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { Appointment } from 'src/appointments/entities/appointment.entity'; // Importamos Appointment
  
  @Entity('observations')
  export class Observation {
    @PrimaryGeneratedColumn()
    observation_id: number;
  
    @Column()
    text: string;
  
    @Column()
    img: string;
  
    // Relación N:1 con Appointment
    @ManyToOne(() => Appointment, (appointment) => appointment.observations)
    @JoinColumn({ name: 'appointment_id' })
    appointment: Appointment;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }