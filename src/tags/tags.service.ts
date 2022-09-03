import { Repository, DeepPartial } from 'typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTagDto } from './dto/tag.dto';
import { Tags } from './entities/tag.entity';

@Injectable()
export class TagsService {

    constructor(
        @InjectRepository(Tags)
        private readonly tagsRepository: Repository<Tags>
    ) { };

    async create(body: CreateTagDto): Promise<Tags> {

        const { name } = body;

        let tag = await this.tagsRepository.findOne({
            where: {
                name: name
            }
        });

        if (tag) throw new HttpException({
            msg: "Tag already exists",
            error: "Not acceptable"
        }, HttpStatus.NOT_ACCEPTABLE);

        return await this.tagsRepository.save(
            this.tagsRepository.create(body as DeepPartial<Tags>)
        );
    };
}
