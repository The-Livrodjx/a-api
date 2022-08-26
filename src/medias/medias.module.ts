import { Module } from '@nestjs/common';
import { MediasService } from './medias.service';
import { MediasController } from './medias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medias } from './entities/media.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Medias])
  ],
  controllers: [MediasController],
  providers: [MediasService],
  exports: [MediasService]
})
export class MediasModule {}
