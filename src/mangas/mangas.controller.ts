import {
    Controller,
    Post,
    Body,
    UseInterceptors,
    HttpException,
    HttpStatus,
    UploadedFiles,
    UseGuards,
    Param,
    Get
} from '@nestjs/common';
import { MangasService } from './mangas.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { genFileName } from '../utils/utils';
import { AuthGuard } from '@nestjs/passport';


@Controller('mangas')
export class MangasController {
    constructor(private readonly mangaService: MangasService) { }

    //   @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(
        FilesInterceptor('pages[]', 100, {
            storage: diskStorage({
                destination: './tmp',
                filename(_, file, cb) {
                    cb(null, genFileName(file.originalname));
                },
            }),
            fileFilter(_, file, callback) {
                if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                    return callback(new HttpException({
                        msg: "Invalid file",
                        error: "Unprocessable entity"
                    }, HttpStatus.UNPROCESSABLE_ENTITY), false);
                }
                callback(null, true)
            }
        })
    )
    @Post()
    async create(
        @UploadedFiles() files: Express.Multer.File[],
        @Body() body: {body: string}
    ) {

        return await this.mangaService.create(files, JSON.parse(body.body));
    };

    @Post('/payloadManga/:id')
    async payloadManga(@Param('id') id: number) {
        return await this.mangaService.payloadMangas(id);
    }

    @Get('manga/:id')
    async webscraping(@Param('id') id: number) {
        return this.mangaService.webscrapping(id);
    }
}
