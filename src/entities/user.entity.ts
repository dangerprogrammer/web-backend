import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: 'users' })
export class User {
    @PrimaryColumn()
    email: string;

    // Password crypted
    @Column()
    hash: string;

    @Column()
    hashRefreshToken?: string;
}