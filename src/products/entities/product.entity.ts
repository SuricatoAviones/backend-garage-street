import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class Product {
    @PrimaryGeneratedColumn()
    product_id: number

    @Column()
    name: string

    @Column()
    description: string

    @Column()
    brand: string

    @Column()
    model: string

    @Column()
    price: number

    @Column()
    code: string;

    @Column()
    stock: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}
