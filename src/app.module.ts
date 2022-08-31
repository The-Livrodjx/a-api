import { MediaGateway } from './medias/media.gateway';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { mysqlConfig } from './configs/mysql.config';
import { UsersModule } from './users/users.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { MediasModule } from './medias/medias.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: mysqlConfig.host,
      port: mysqlConfig.port,
      username: mysqlConfig.username,
      password: mysqlConfig.password,
      database: mysqlConfig.database,
      synchronize: mysqlConfig.synchronize,
      entities: [__dirname + '/**/*.entity{.ts,.js}']
    }),
    UsersModule,
    MediasModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [MediaGateway, AppService],
})
export class AppModule { }
