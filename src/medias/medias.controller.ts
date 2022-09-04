import {
    Controller,
    Post,
    UseInterceptors,
    HttpException,
    HttpStatus,
    UploadedFile,
    Get,
    Param,
    Req,
    Res,
    Query
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { MediasService } from './medias.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from "multer";
import { CreateMedia, IGetMediaById } from './dto/media.dto';
import { Medias } from './entities/media.entity';
import { Request, Response } from 'express';
import { genFileName } from '../utils/utils';

@Controller('medias')
export class MediasController {
    constructor(private readonly mediasService: MediasService) { }

    @Get("/pagination")
    async pagination(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('filter') filter: string = "video/mp4"
    ): Promise<Pagination<Medias>> {
        limit = limit > 100 ? 100 : limit;
        return this.mediasService.pagination({
            page,
            limit
        },  filter);
    };

    @Get('/getById/:id')
    getMediaById(
        @Param('id') id: string
    ): Promise<IGetMediaById> {
        return this.mediasService.getMediaById(id);
    };

    @Get('/:filename')
    getFile(
        @Param('filename') filename: string,
        @Req() req: Request,
        @Res() res: Response
    ): Buffer | void {
        this.mediasService.getFileByFilename(filename, req, res);
    };

    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './tmp',
                filename(_, file, cb) {
                    cb(null, genFileName(file.originalname));
                },
            }),
            fileFilter(_, file, callback) {
                if (!file.originalname.match(/\.(mp4|jpg|jpeg|gif|png)$/)) {
                    return callback(new HttpException({
                        msg: "Invalid file",
                        error: "Unprocessable entity"
                    }, HttpStatus.UNPROCESSABLE_ENTITY), false);
                }
                callback(null, true)
            },
            limits: {
                fileSize: 150 * 1024 * 1024,
                files: 50
            }
        })
    )
    @Post()
    async create(@UploadedFile() file: CreateMedia): Promise<Medias> {
        return this.mediasService.create(file);
    }
}
