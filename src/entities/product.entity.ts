import { Category, Condition } from "src/types";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from ".";

@Entity({ name: 'products' })
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    desc: string;

    @Column("text", { array: !0, default: [] })
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

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, ({ ownerProducts }) => ownerProducts)
    owner: User;
}