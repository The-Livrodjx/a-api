import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { consoleTableObj } from './utils/utils';
import * as ip from 'ip';
import * as dotenv from 'dotenv';
import { corsConfig } from './configs/cors.config';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const host = ip.address();
  const PORT = Number(process.env.PORT) || 6969;

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.listen(PORT).then(() => consoleTableObj({
    'Host': host,
    'Port': PORT
  }));
}
bootstrap();
