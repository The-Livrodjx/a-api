import { HttpException, HttpStatus } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashSync } from 'bcrypt';
import { DeepPartial, Repository } from 'typeorm';
import { CreateUserDto, LoginReturn } from './dto/user.dto';
import { Users } from './entities/user.entity';


@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
        // private authService: AuthService
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

            let newUser = await this.usersRepository.save(
                this.usersRepository.create(body as DeepPartial<Users>)
            );

            return {
                // token: this.authService.jwtSign({
                //   email,
                //   username: newUser.name,
                // }),
                token: "",
                username: newUser.name,
                email: newUser.email
            };
        }

        throw new HttpException({
            msg: "User already exists",
            error: "Not acceptable"
        }, HttpStatus.NOT_ACCEPTABLE);
    }

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
