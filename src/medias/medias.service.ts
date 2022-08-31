import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { CreateMedia } from './dto/media.dto';
import { Medias } from './entities/media.entity';

@Injectable()
export class MediasService {

  constructor(
    @InjectRepository(Medias)
    private readonly mediasRepository: Repository<Medias>
  ) {};

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
}
