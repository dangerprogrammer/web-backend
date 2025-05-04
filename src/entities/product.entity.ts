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

    @Column()
    image: string;

    @Column("text", { array: !0 })
    categories: Category[];

    @Column()
    condition: Condition;

    @Column()
    location: string;

    @Column()
    requiredPoints: number;
}