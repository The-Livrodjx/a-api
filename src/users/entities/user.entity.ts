import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from 'uuid';

export enum UserRole {
    ADMIN = 1,
    MEMBER = 0
};

@Entity()
export class Users {

    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    email: string

    @Column({ select: false })
    password: string;

    @Column({ select: false })
    ip: string;

    @Column({ default: "" })
    profile_image: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.MEMBER
    })
    role: UserRole;

    @CreateDateColumn()
    created_at: Date;

    constructor() {
        if (!this.id) {
            this.id = `${uuid()}`;
        }
    }
}
