import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { mysqlConfig } from './configs/mysql.config';
import { UsersModule } from './users/users.module';
import { ThrottlerModule } from '@nestjs/throttler';

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
      synchronize: mysqlConfig.synchronize
    }),
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
