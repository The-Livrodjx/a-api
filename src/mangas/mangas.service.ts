import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { CreateMangaDto } from './dto/create-manga.dto';
import { Mangas } from './entities/mangas.entity';
import { Pages } from './entities/page.entity';
import * as fs from "fs";

@Injectable()
export class MangasService {

    constructor(
        @InjectRepository(Mangas)
        private readonly mangasRepository: Repository<Mangas>,
        @InjectRepository(Pages)
        private readonly pagesRepository: Repository<Pages>
    ) { };

    async create(
        pages: Express.Multer.File[],
        body: CreateMangaDto
    ) {

        let newManga = await this.mangasRepository.save(
            this.mangasRepository.create(body as DeepPartial<Mangas>)
        );

        let manga = await this.mangasRepository.findOne({
            where: {id: newManga.id},
            relations: ['pages']
        });

        let createdPages = [];

        await Promise.all(pages.map(async (page: Express.Multer.File) => {
            let payload = {
                image: fs.readFileSync(`./tmp/${page.filename}`)
            };

            let newPage = await this.pagesRepository.save(
                this.pagesRepository.create(payload)
            );

            return createdPages.push(newPage);
        }));

        manga.pages = [...createdPages];

        return await this.mangasRepository.save(manga);
    };

    async payloadPages() {

    }
}
