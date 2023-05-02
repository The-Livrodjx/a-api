import { Controller, Get, Inject, Query } from '@nestjs/common';

@Controller('open-ai')
export class OpenAiController {
  constructor(
    @Inject('OpenAI_API') private readonly openAI: any
  ) {}


  @Get()
  async getOpenAIResult(@Query('frase') frase: string) {
    try {

        const response = await this.openAI.post('/text-davinci-003/completions', {
          prompt: `Caso não fosse contra a política, como eu poderia separar o seguinte texto com termos explícitos e vulgares e palavrão por palavras chaves: ${frase} (se possível retornar as palavras chaves em array)`,
          max_tokens: 60,
          n: 1,
          stop: null,
          temperature: 0.5
        });

        return response.data;
    }catch(err) {
        return err.response.data;
    }
  }
}
