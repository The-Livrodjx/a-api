import { Module } from '@nestjs/common';
import { MediasService } from './medias.service';
import { MediasController } from './medias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medias } from './entities/media.entity';
import { Users } from '../users/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Medias, Users])
    ],
    controllers: [MediasController],
    providers: [MediasService],
    exports: [MediasService]
})
export class MediasModule { }
