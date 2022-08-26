import { Injectable } from '@nestjs/common';
import * as ffmpeg from "fluent-ffmpeg";

@Injectable()
export class MediasService {
  create(createMediaDto: any) {
    return 'This action adds a new media';
  }

  findAll() {
    return `This action returns all medias`;
  }

  findOne(id: number) {
    return `This action returns a #${id} media`;
  }

  update(id: number, updateMediaDto: any) {
    return `This action updates a #${id} media`;
  }

  remove(id: number) {
    return `This action removes a #${id} media`;
  }
}
