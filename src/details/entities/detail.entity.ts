import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn,UpdateDateColumn } from 'typeorm';

@Entity('details')
export class Detail {
    @PrimaryGeneratedColumn()
    detail_id: number;
    

    @Column()
    text: string;

    @Column()
    img: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    
}
