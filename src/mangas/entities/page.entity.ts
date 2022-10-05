import { Mangas } from './mangas.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Pages {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "longblob", nullable: true})
    image: Buffer;

    @ManyToOne(() => Mangas, manga => manga.pages,{
        cascade: true,
        onDelete: "SET NULL"
    })
    manga: Mangas
}
