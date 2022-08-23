import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "src/users/entities/user.entity";
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from "./jwt.constants";

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {expiresIn: '1h'}
    })
  ]
})
export class AuthModule {};