import { UserTrade } from "src/types";
import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: 'users' })
export class User {
    @Column()
    name: string;

    @PrimaryColumn()
    email: string;

    // Password crypted
    @Column()
    hash: string;

    @Column()
    hashRefreshToken?: string;

    @Column()
    location: string;

    @CreateDateColumn()
    joinedAt: Date;

    @Column()
    userType: UserTrade;

    @Column()
    phone: string;
}