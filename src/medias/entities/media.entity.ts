import { Column, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

@Entity()
export class Medias {

  @PrimaryColumn()
  id: string;

  @Column()
  file_path: string;

  @Column({ default: 0 })
  file_length: number;

  constructor(){
    if(!this.id) {
      this.id = uuid();
    }
  }
}
