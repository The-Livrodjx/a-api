import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { Tags } from './entities/tag.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Tags
        ])
    ],
    controllers: [TagsController],
    providers: [TagsService]
})
export class TagsModule { }
