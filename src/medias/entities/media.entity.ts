import { Users } from './../../users/entities/user.entity';
import { Tags } from "../../tags/entities/tag.entity";
import {
    Column,
    Entity,
    PrimaryColumn,
    ManyToMany,
    JoinTable,
    ManyToOne
} from "typeorm";
import { v4 as uuid } from "uuid";

export enum FilesType {
    MP4 = "video/mp4",
    JPG = "image/jpg",
    JPEG = "image/jpeg",
    PNG = "image/png",
    GIF = "image/gif"
};

@Entity()
export class Medias {

    @PrimaryColumn()
    id?: string;

    @Column({ nullable: true })
    title?: string;

    @Column()
    file_name: string;

    @Column()
    file_path: string;

    @Column({ default: 0 })
    file_length: number;

    @Column({ default: FilesType.JPG })
    file_type: FilesType | string;

    @ManyToOne(() => Users, user => user.medias, {
        cascade: true,
        onDelete: "SET NULL"
    })
    users?: Users

    @ManyToMany(() => Tags)
    @JoinTable()
    tags?: Tags[];

    constructor() {
        if (!this.id) {
            this.id = uuid();
        };
    };
}
