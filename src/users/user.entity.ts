import { Role } from "@src/role/role.entity";
import { Region } from "@src/regions/region.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Notify } from "@src/notify/notify.entity";
import { Exclude } from "class-transformer";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({unique: true})
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Exclude()
  @Column({nullable:true,default: null})
  refresh_token: string;

  @Column({nullable:true,default: null})
  avatar: string;

  @Column({default : 1})
  status: number;

  get fullName(): string {
    return `${this.lastName} ${this.firstName}`;
  }

  @ManyToOne(()=> Region, (region) => region.users,{ onDelete: 'CASCADE' })
  region: Region;

  @ManyToOne(()=> Role, (role)=>role.users,{ onDelete: 'CASCADE' })
  role: Role

  @OneToMany(()=> Notify, (notify) => notify.user)
  notifies: Notify[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}