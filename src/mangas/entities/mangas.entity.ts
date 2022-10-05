import { Pages } from './page.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { Users } from "../../users/entities/user.entity";
import { Tags } from "../../tags/entities/tag.entity";

@Entity()
export class Mangas {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    type: string;

    @Column()
    artist: string;

    @ManyToOne(() => Users, user => user.medias, {
        cascade: true,
        onDelete: "SET NULL"
    })
    users?: Users;

    @ManyToMany(() => Tags, {
        cascade: true,
        onDelete: 'SET NULL'
    })
    @JoinColumn()
    tags?: Tags[];

    @OneToMany(() => Pages, page => page.manga, {
        cascade: ['insert', 'update']
    })
    pages: Pages[];

    @CreateDateColumn()
    created_at: Date;
}
