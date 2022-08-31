import { Controller, Post, Body, UseGuards, Get, Ip, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { RealIp } from 'nestjs-real-ip';
import { CreateUserDto, LoginReturn, UserLogin } from './dto/user.dto';
import { ThrottlerUserProxy } from './throttler-user-proxy.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    // private readonly authService: AuthService
  ) {}

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

  // @UseGuards(ThrottlerUserProxy)
  // @Post('/login')
  // async login(@Body() body: UserLogin): Promise<LoginReturn> {
  //   return await this.authService.login(body);
  // }

  // @Get('jwt')
  // async validateJwt(@Req() req: Request): Promise<boolean> {
  //   const { authorization } = req.headers;
  //   if(authorization && authorization.split(" ")[0] === 'Bearer') {
  //     return await this.authService.validateJwt(authorization);
  //   };
  //   return false;
  // }
}
