import { User } from "@src/users/user.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()

export class Role{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(()=> User, (user)=> user.role)
    users: User[]
}