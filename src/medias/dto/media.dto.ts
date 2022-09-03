import { Users } from "../../users/entities/user.entity";
import { Tags } from "../../tags/entities/tag.entity";

export interface CreateMedia {
    filename: string;
    path: string;
    size: number;
    mimetype: string;
    title?: string;
    description?: string;
}

export interface IGetMediaById {
    id?: string;
    title?: string | null;
    file_name: string;
    file_path: string;
    file_length: number;
    file_type: string;
    tags?: Tags[],
    users?: Users
}
