import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateUserDto {
    @Length(3, 30, {
        message: "Name must be longer than 3 characters"
    })
    @IsNotEmpty()
    name: string;

    @IsEmail({ message: null })
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    ip?: string;
    role?: number;
}

export class UserLogin {
    @IsEmail({ message: "Invalid credentials" })
    @IsNotEmpty({ message: "Email cannot be empty" })
    email: string;

    @IsString({ message: "Password must be an string" })
    @IsNotEmpty({ message: "Password cannot be empty" })
    password: string;
}

export interface LoginReturn {
    id?: string;
    token?: string;
    email: string;
    username: string;
}
