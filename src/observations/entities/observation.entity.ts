import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('observations')
export class Observation {
    @PrimaryGeneratedColumn()
    observation_id: number;

    @Column()
    text: string;

    @Column()
    img: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
