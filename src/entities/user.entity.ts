import { UserTrade } from "src/types";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Product } from ".";

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @PrimaryColumn()
    email: string;

    // Password crypted
    @Column()
    hash: string;

    @Column({ nullable: !0 })
    hashRefreshToken?: string;

    @Column()
    location: string;

    @CreateDateColumn()
    joinedAt: Date;

    @Column()
    userType: UserTrade;

    @Column()
    phone: string;

    @Column({ default: 0 })
    totalPoints: number;

    @OneToMany(() => Product, ({ owner }) => owner)
    ownerProducts: Product[];

    @ManyToMany(() => Product)
    @JoinTable()
    interestedProducts: Product[];
}