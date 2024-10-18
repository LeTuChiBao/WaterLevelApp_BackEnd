import { Notify } from "../notify/notify.entity";
import { Sensor } from "../sensors/sessor.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Reading {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(()=> Sensor, (sensor)=> sensor.readings,{ onDelete: 'CASCADE' })
  sensor: Sensor;

  @OneToMany(()=> Notify, (notify) => notify.reading)
  notifies: Notify[];

  @Column({type: 'float'})
  water_level : number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}