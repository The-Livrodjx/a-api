import {
  Controller,
  Post,
  UseInterceptors,
  HttpException,
  HttpStatus,
  UploadedFile,
  Header,
  Get,
  StreamableFile,
  Param
} from '@nestjs/common';
import { MediasService } from './medias.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from "multer";
import { v4 as uuid } from "uuid";
import { CreateMedia } from './dto/media.dto';
import { Medias } from './entities/media.entity';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('medias')
export class MediasController {
  constructor(private readonly mediasService: MediasService) { }

  @Get('/:file_name')
  @Header('Content-type', 'video/mp4')
  @Header('Content-Disposition', 'inline; filename="video.mp4"')
  getFile(@Param('file_name') file_name: string): StreamableFile {
    const file = createReadStream(join(process.cwd(), `tmp/${file_name}.mp4`));
    return new StreamableFile(file);
  }

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
