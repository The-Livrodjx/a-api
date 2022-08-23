import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuid } from 'uuid'

@Entity()
export class Users {

  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  email: string
  
  @Column({select: false})
  password: string;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if(!this.id) this.id = uuid();
  }
}
