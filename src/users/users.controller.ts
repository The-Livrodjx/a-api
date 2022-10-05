import { AuthService } from '../auth/auth.service';
import { Controller, Post, Body, UseGuards, Get, Ip, Req, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { RealIp } from 'nestjs-real-ip';
import { ChangeAvatar, CreateUserDto, LoginReturn, UserLogin } from './dto/user.dto';
import { ThrottlerUserProxy } from './throttler-user-proxy.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    getAll(@RealIp() ip: string, @Ip() ip_nativo: string) {
        console.log(`Ip nativo: ${ip_nativo}`);
        console.log(`Ip da lib: ${ip}`);
        return "Hello World";
    }

    @UseGuards(ThrottlerUserProxy)
    @Post('/create')
    async create(
        @Body() createUserDto: CreateUserDto,
        @RealIp() ip: string
    ): Promise<LoginReturn> {
        return await this.usersService.create(createUserDto, ip);
    }

    @UseGuards(AuthGuard('jwt'))
    @UseGuards(ThrottlerUserProxy)
    @Post('/changeAvatar')
    async changeAvatar(
        @Body() body: ChangeAvatar
    ): Promise<ChangeAvatar> {

        return this.usersService.changeUserAvatar(body);
    }

    @UseGuards(ThrottlerUserProxy)
    @Post('/login')
    async login(
        @Body() body: UserLogin,
        @RealIp() ip: string
    ): Promise<LoginReturn> {
        return await this.authService.login(body, ip);
    }

    @Get('/jwt')
    async validateJwt(@Req() req: Request): Promise<boolean> {
        const { authorization } = req.headers;
        if (authorization && authorization.split(" ")[0] === 'Bearer') {
            return await this.authService.validateJwt(authorization);
        };
        return false;
    }
}
