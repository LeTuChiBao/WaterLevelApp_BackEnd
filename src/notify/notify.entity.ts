import { User } from "@src/users/user.entity";
import { Reading } from "../readings/reading.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Notify {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(()=> Reading, (reading) => reading.notifies,{ onDelete: 'CASCADE' })
  reading: Reading;

  @ManyToOne(()=> User, (user)=> user.notifies,{ onDelete: 'CASCADE' })
  user: User;

  @Column()
  message: string;

  @Column({default: false})
  isReading: Boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}