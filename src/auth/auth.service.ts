import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from '@nestjs/jwt';
import { Users } from "../users/entities/user.entity";
import { Repository } from "typeorm";
import { compare } from 'bcrypt';
import { LoginReturn, UserLogin } from "src/users/dto/user.dto";

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private jwtService: JwtService
  ) {};

  async login(data: UserLogin): Promise<LoginReturn> {

    const { email, password } = data;

    const user = await this.usersRepository.findOne({
      where: {email: email},
      select: ['id', 'name', 'email', 'password']
    });

    if(!user) 
      throw new HttpException({ 
        msg: "Invalid credentials", 
        error: "Bad Request"
      }, HttpStatus.BAD_REQUEST);

    if(await this.comparePassword(password, user.password)) {
      const token = this.jwtSign({
        id: user.id,
        username: user.name,
        email: user.email
      });

      return {token, username: user.name, email: user.email};
    }

    throw new HttpException({ 
      msg: "Invalid credentials", 
      error: "Bad Request"
    }, HttpStatus.BAD_REQUEST);
  }

  async comparePassword(attempt: string, pwd: string): Promise<boolean> {
    return await compare(attempt, pwd);
  }

  jwtSign(payload: LoginReturn): string {
    return this.jwtService.sign(payload);
  }

  async validateJwt(token: string): Promise<boolean> {
    try {
      await this.jwtService.verify(token.split(" ")[1]);

      return true;
    }catch(err) {
      return false;
    }
  }
}