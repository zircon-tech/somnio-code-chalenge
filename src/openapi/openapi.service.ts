import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig, EnvObjects } from '../config/types';
import OpenAI from 'openai';

@Injectable()
export class OpenapiService implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  async wordEmbedding(word: string) {
    const { openIaApiKey } = this.configService.get<AppConfig>(
      EnvObjects.APP_CONFIG,
    )!;
    const openAIClient = new OpenAI({
      apiKey: openIaApiKey,
    });
    try {
      const wordEmbeddingResponse = await openAIClient.embeddings.create({
        model: 'text-embedding-3-small',
        input: word,
      });
      // ToDo: Why returns an array of data?
      return wordEmbeddingResponse.data[0].embedding;
    } catch (err) {
      if (err instanceof OpenAI.APIError) {
        throw err;
      }
      throw err;
    }
  }

  onModuleInit(): any{
  }
}
