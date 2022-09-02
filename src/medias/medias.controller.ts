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
    Res
} from '@nestjs/common';
import { MediasService } from './medias.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from "multer";
import { v4 as uuid } from "uuid";
import { CreateMedia } from './dto/media.dto';
import { Medias } from './entities/media.entity';

@Controller('medias')
export class MediasController {
    constructor(private readonly mediasService: MediasService) { }

    @Get('/:filename')
    getFile(@Param('filename') filename: string, @Req() req: any, @Res() res: any): void {
        this.mediasService.getFileByFilename(filename, req, res);
    };

    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './tmp',
                filename(_, file, cb) {
                    cb(null, `${uuid().replace(/-/g, "")}-${file.originalname.replace(/\s|-/g, '_')}`);
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
