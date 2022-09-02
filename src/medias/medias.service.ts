import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { extname } from 'path';
import { getType as getTypeFromExt, getExtension as getExtFromType } from 'mime';

import { CreateMedia } from './dto/media.dto';
import { Medias } from './entities/media.entity';
import { createReadStream, readFileSync, statSync } from 'fs';

@Injectable()
export class MediasService {
    constructor(
        @InjectRepository(Medias)
        private readonly mediasRepository: Repository<Medias>
    ) { };

    async create(file: CreateMedia) {

        let payload: Medias = {
            file_name: file.filename,
            file_path: file.path,
            file_length: file.size,
            file_type: file.mimetype
        };

        return await this.mediasRepository
            .save(this.mediasRepository
                .create((payload as DeepPartial<Medias>)));
    };

    getFileByFilename(filename: string, req: any, res: any) {
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
