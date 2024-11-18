import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {Product, ProductScore } from './types';
import wretch from "wretch";
import { AppConfig,EnvObjects } from '../config/types';

// curl https://api.openai.com/v1/embeddings   -H "Content-Type: application/json"   -H "Authorization: Bearer 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"   -d '{
//     "input": "Your text string goes here",
//     "model": "text-embedding-3-small"
//   }'
const openIaApi = wretch("https://api.openai.com").errorType("json").resolve(r => r.json());

function jaccardIndex(s1: Set<string>, s2: string[]) {
  return (s1 as any).intersection(s2).size / (s1 as any).union(s2).size;
}

@Injectable()
export class ProductService {
  constructor(
    private readonly configService: ConfigService,
    // private readonly prismaService: PrismaService,
  ) {}

  similarTo(productId: string): ProductScore[] {
    // jaccardIndex();
    // ToDo: Store cache of relations between all of them? Simetric relation
    return [];
  }

  async bulkCreate(
    items: Product[],
  ) {
    const {OpenIaApiKey} = this.configService.get<AppConfig>(EnvObjects.APP_CONFIG)
    const authOpenIaApi = openIaApi.auth(`Bearer ${OpenIaApiKey}`);
    await Promise.all(items.map(
      async (item) => {
        const wordEmbedding = await authOpenIaApi.json({
          input: item.description,
          model: 'text-embedding-3-small',
        }).post('/v1/embeddings');
        const tags = new Set(item.tags).values();

      },
    ));
  }
}
