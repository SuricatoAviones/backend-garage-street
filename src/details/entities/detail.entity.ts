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
  
  @Entity('details')
  export class Detail {
    @PrimaryGeneratedColumn()
    detail_id: number;
  
    @Column()
    text: string;
  
    @Column()
    img: string;
  
    // Relación N:1 con Appointment
    @ManyToOne(() => Appointment, (appointment) => appointment.details)
    @JoinColumn({ name: 'appointment_id' })
    appointment: Appointment;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }