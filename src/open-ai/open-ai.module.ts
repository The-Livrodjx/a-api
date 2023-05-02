import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import axios from "axios";
import { OpenAiController } from './open-ai.controller';

@Module({
    imports: [HttpModule],
    controllers: [OpenAiController],
    providers: [
      {
        provide: 'OpenAI_API',
        useFactory: () => {
          return axios.create({
            baseURL: 'https://api.openai.com/v1/engines',
            headers: {
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json',
            },
          });
        },
      },
    ],
    exports: ['OpenAI_API'],
})
export class OpenAIAPIModule {}
