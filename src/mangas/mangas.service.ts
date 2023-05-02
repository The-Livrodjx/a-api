import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { CreateMangaDto } from './dto/create-manga.dto';
import { Mangas } from './entities/mangas.entity';
import { Pages } from './entities/page.entity';
import * as fs from "fs";
import * as path from "path";
import * as cheerio from "cheerio";
import axios from "axios";
import { HttpService } from '@nestjs/axios';
const Example = require('kasu.nhentaiapi.js');

const Api = new Example();

@Injectable()
export class MangasService {

    constructor(
        @InjectRepository(Mangas)
        private readonly mangasRepository: Repository<Mangas>,
        @InjectRepository(Pages)
        private readonly pagesRepository: Repository<Pages>,
        private readonly httpService: HttpService
    ) { };

    async create(
        pages: Express.Multer.File[],
        body: CreateMangaDto
    ) {

        let newManga = await this.mangasRepository.save(
            this.mangasRepository.create(body as DeepPartial<Mangas>)
        );

        let manga = await this.mangasRepository.findOne({
            where: { id: newManga.id },
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

    async payloadMangas(id: number) {
        Api.url = "https://nhentai.to";
        Api.connection.start();

        try {

            const data = await Api.getID(id).json();

            let body = {
                title: data.title.translatedFull,
                artist: data.tag_table.artist,
                description: data.tag_table.categories,
                type: data.tag_table.tag
            };

            let newManga = await this.mangasRepository.save(
                this.mangasRepository.create(body as DeepPartial<Mangas>)
            );

            let manga = await this.mangasRepository.findOne({
                where: { id: newManga.id },
                relations: ['pages']
            });

            let createdPages = [];

            for (let i = 1; i < data.number_pages; i++) {

                await new Promise((resolve) => {

                    this.httpService.get(data.images.pages(i), {
                        responseType: 'text',
                        responseEncoding: 'base64'
                    }).pipe().subscribe(async e => {
                        let tmp_name = Date.now();

                        fs.writeFileSync(`./tmp/${tmp_name}.jpg`,
                            e.data, {
                            encoding: 'base64'
                        });

                        let payload = {
                            image: fs.readFileSync(`./tmp/${tmp_name}.jpg`)
                        };

                        let newPage = await this.pagesRepository.save(
                            this.pagesRepository.create(payload)
                        );

                        fs.unlinkSync(`./tmp/${tmp_name}.jpg`);

                        resolve(createdPages.push(newPage));

                    }, (err) => {
                        console.log(err);
                        resolve(null);
                    });
                })
            };

            manga.pages = [...createdPages];
            Api.connection.close();

            return await this.mangasRepository.save(manga);
        } catch (err) {
            console.log(err.message);
            throw new HttpException("Something goes wrong",
                err.statusCode);
        }

    }

    async webscrapping(sauce?: number) {
        // console.log(sauce);
        let condition = true;
        let page = 1;

        // while (condition) {
        //     console.log(page);
            axios.get(`https://nhentai.to/g/${sauce}/${page}`).then(response => {
                // Usando Cheerio para carregar o HTML da página
                const $ = cheerio.load(response.data);
                // Encontrando o elemento HTML que contém a imagem que você deseja baixar
                const imageSrc = $('img.fit-horizontal').attr('src');

                if(imageSrc === undefined) condition = false;

                // Usando Axios novamente para baixar a imagem
                this.httpService.get(imageSrc, {
                    responseType: 'text',
                    responseEncoding: 'base64'
                }).pipe().subscribe(async e => {
                    let tmp_name = Date.now();

                    fs.writeFileSync(`./tmp/${tmp_name}.jpg`,
                        e.data, {
                        encoding: 'base64'
                    });

                    return page += 1;
                });
            }).catch(error => {
                // console.log(error.response.data);
            });
        // }
    }
}
