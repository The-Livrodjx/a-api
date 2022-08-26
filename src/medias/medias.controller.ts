import { 
  Controller, 
  Post, 
  Body, 
  UseInterceptors, 
  HttpException, 
  HttpStatus 
} from '@nestjs/common';
import { MediasService } from './medias.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from "multer";
import { v4 as uuid } from "uuid";

@Controller('medias')
export class MediasController {
  constructor(private readonly mediasService: MediasService) {}

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './tmp',
        filename(req, file, cb) {
          cb(null, `${uuid().replace(/-/g, "")}-${file.originalname.replace(/\s|-/g, '_')}`);
        },
      }),
      fileFilter(req, file, callback) {
        if(!file.originalname.match(/\.(mp4)$/)) {
          return callback(new HttpException({ 
            msg: "Invalid file", 
            error: "Unprocessable entity" 
          }, HttpStatus.UNPROCESSABLE_ENTITY), false);
        }
        callback(null, true)
      },
    })
  )
  @Post()
  create(@Body() createMediaDto: any) {
    return this.mediasService.create(createMediaDto);
  }
}
