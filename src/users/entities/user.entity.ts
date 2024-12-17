import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Roles } from '../enums/roles.enum';

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


  @Column({ default: Roles.Rol_Trabajador })
  rol: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
