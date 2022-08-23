import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { ThrottlerUserProxy } from './throttler-user-proxy.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(ThrottlerUserProxy)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
