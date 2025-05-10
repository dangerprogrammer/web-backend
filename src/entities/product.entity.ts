import { Category, Condition } from "src/types";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'products' })
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    desc: string;

    @Column("text", { array: !0 })
    images: string[];

    @Column()
    category: Category;

    @Column()
    condition: Condition;

    @Column()
    location: string;

    @Column()
    estimatedPrice: number;

    @Column()
    points: number;
}