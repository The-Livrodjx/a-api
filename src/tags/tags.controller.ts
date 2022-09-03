import { Controller, Post, Body } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto, ITags } from './dto/tag.dto';

@Controller('tags')
export class TagsController {
    constructor(
        private readonly tagsService: TagsService
    ) { };

    @Post('/create')
    async create(@Body() body: CreateTagDto): Promise<ITags> {
        return await this.tagsService.create(body);
    };

}
