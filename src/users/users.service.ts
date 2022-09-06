import { HttpException, HttpStatus } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashSync } from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { DeepPartial, Repository } from 'typeorm';
import { ChangeAvatar, CreateUserDto, LoginReturn } from './dto/user.dto';
import { Users } from './entities/user.entity';


@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
        private authService: AuthService
    ) { };

    async create(body: CreateUserDto, ip: string): Promise<LoginReturn> {
        const { email } = body;

        let user = await this.usersRepository.findOne({
            where: {
                email: email
            }
        });

        if (!user) {
            body.password = hashSync(body.password, 10);
            body.ip = ip;
            body.role = 0;
            let newUser = await this.usersRepository.save(
                this.usersRepository.create(body as DeepPartial<Users>)
            );

            return {
                token: this.authService.jwtSign({
                  email,
                  username: newUser.name,
                }),
                username: newUser.name,
                email: newUser.email,
                profile_image: newUser.profile_image
            };
        };

        throw new HttpException({
            msg: "User already exists",
            error: "Not acceptable"
        }, HttpStatus.NOT_ACCEPTABLE);
    }

    async changeUserAvatar(body: ChangeAvatar): Promise<ChangeAvatar> {
        const { email, profile_image } = body;
        const user = await this.usersRepository.findOne({
            where: {email}
        });

        if(user) {
            user.profile_image = profile_image;
            this.usersRepository.save(user);
            return { profile_image };
        };

        throw new HttpException({
            msg: "User not found",
            error: "Not found"
        }, HttpStatus.NOT_FOUND);
    };

    async verifyLogin(id: string): Promise<boolean> {
        const user = this.usersRepository.findOne({
            where: { id }
        });

        if (user) return true;

        throw new HttpException({
            msg: "Invalid Token",
            error: "Unauthorized"
        }, HttpStatus.UNAUTHORIZED);
    }
}
