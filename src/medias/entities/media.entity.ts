import { Column, Entity, PrimaryColumn } from "typeorm";
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

    @Column()
    file_name: string;

    @Column()
    file_path: string;

    @Column({ default: 0 })
    file_length: number;

    @Column({ default: FilesType.JPG })
    file_type: FilesType | string;

    constructor() {
        if (!this.id) {
            this.id = uuid();
        }
    }
}
