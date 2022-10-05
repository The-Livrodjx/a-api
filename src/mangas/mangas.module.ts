import { Module } from '@nestjs/common';
import { MangasService } from './mangas.service';
import { MangasController } from './mangas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mangas } from './entities/mangas.entity';
import { Pages } from './entities/page.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Mangas, Pages])
    ],
    controllers: [MangasController],
    providers: [MangasService]
})
export class MangasModule { }
