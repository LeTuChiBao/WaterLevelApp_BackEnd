import { Reading } from "../readings/reading.entity";
import { Region } from "../regions/region.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Sensor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description : string;

  @Column({type: 'float'})
  latitude: number;

  @Column({type: 'float'})
  longitude: number;

  @Column({ default: true })
  status: Boolean;

  @ManyToOne(()=> Region, (region) => region.sensors,{ onDelete: 'CASCADE' })
  region : Region;

  @OneToMany(()=> Reading, (reading)=> reading.sensor)
  readings: Reading[]

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

}