import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { extname } from 'path';
import { getType as getTypeFromExt } from 'mime';
import { CreateMedia, CreateMediaBody, IGetMediaById } from './dto/media.dto';
import { Medias } from './entities/media.entity';
import { createReadStream, readFileSync, statSync } from 'fs';
import { Request, Response } from 'express';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Users } from '../users/entities/user.entity';

@Injectable()
export class MediasService {
    constructor(
        @InjectRepository(Medias)
        private readonly mediasRepository: Repository<Medias>,
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,
    ) { };

    async pagination(
        options: IPaginationOptions,
        file_type: string): Promise<Pagination<Medias>> {
        const queryBuilder = this.mediasRepository
            .createQueryBuilder("media")
            .where(`media.file_type = :file_type`, { file_type })
            .leftJoinAndSelect('media.tags', 'tags');

        return paginate<Medias>(queryBuilder, options);
    };

    async getMediaById(id: string): Promise<IGetMediaById> {
        let media = await this.mediasRepository.findOne({
            where: { id: id },
            relations: {
                tags: true,
                users: true
            }
        });

        if (!media) throw new HttpException({
            msg: "Media not found",
            error: "Not found"
        }, HttpStatus.NOT_FOUND);

        return media;
    };

    async create(file: CreateMedia, body: CreateMediaBody): Promise<Medias> {

        let user = await this.usersRepository.findOne({
            where: {
                id: body.users.email
            }
        });

        const allTags = body.tags !== null
            ? body.tags.map((tag: string) => JSON.parse(tag))
            : null;

        let payload: Medias = {
            file_name: file.filename,
            file_path: file.path,
            file_length: file.size,
            file_type: file.mimetype,
            title: body.title,
            users: user,
            tags: allTags
        };

        return await this.mediasRepository
            .save(this.mediasRepository
                .create((payload as DeepPartial<Medias>)));
    };

    getFileByFilename(filename: string, req: Request, res: Response) {
        const filePath = `${process.env.TEMP_FOLDER || "./tmp"}/${filename}`;
        const fileExt = extname(filename);
        const mimetype = getTypeFromExt(fileExt);
        const fileSize = statSync(filePath).size;

        const headers = {
            'content-type': mimetype,
            'content-length': fileSize,
            'Content-Disposition': `inline; filename="${filename}"`
        };

        if (mimetype.startsWith("audio") || mimetype.startsWith("video")) {
            const chunkSize = 1024 * 128; // 128KiB
            const start = Number(req.headers.range?.replace(/[bytes=|-]/g, "")) || 0;
            const end = Math.min(start + chunkSize, fileSize - 1);

            headers["accept-range"] = "bytes";
            headers["content-range"] = `bytes ${start}-${end}/${fileSize}`;
            headers["content-length"] = end - start + 1;

            res.writeHead(206, headers);

            const stream = createReadStream(filePath, { start, end });
            stream.on('end', () => res.end());
            stream.pipe(res);
        } else {
            res.writeHead(200, headers);
            res.end(readFileSync(filePath));
        };
    };
};
