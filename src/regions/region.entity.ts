import { Sensor } from "src/sensors/sessor.entity";
import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Region {
  @PrimaryGeneratedColumn()
  id : number;

  @Column()
  ward: string;

  @Column()
  district: string;

  @Column({type: 'float'})
  damage_level: number;
  
  @OneToMany(()=> User, (user)=> user.region)
  users: User[];

  @OneToMany(()=> Sensor, (sensor)=> sensor.region)
  sensors: Sensor[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
