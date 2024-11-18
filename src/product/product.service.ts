import {BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {IProduct, IProductScore } from './types';
import wretch from "wretch";
import { AppConfig,EnvObjects } from '../config/types';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaVectorStore } from "@langchain/community/vectorstores/prisma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Prisma, Product, PrismaClient } from "@prisma/client";

// curl https://api.openai.com/v1/embeddings   -H "Content-Type: application/json"   -H "Authorization: Bearer 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"   -d '{
//     "input": "Your text string goes here",
//     "model": "text-embedding-3-small"
//   }'
const openIaApi = wretch("https://api.openai.com").errorType("json").resolve(r => r.json());

function jaccardIndex(s1: Set<string>, s2: string[]) {
  return (s1 as any).intersection(s2).size / (s1 as any).union(s2).size;
}

function createVectorStore(client: PrismaClient, apiKey?: string, filter?: any) {
  return PrismaVectorStore.withModel<Product>(client).create(
    new OpenAIEmbeddings({
      apiKey,
      model: "text-embedding-3-large",
    }),
    {
      prisma: Prisma,
      tableName: "Product",
      vectorColumnName: "wordEmbedding",
      columns: {
        id: PrismaVectorStore.IdColumn,
        description: PrismaVectorStore.ContentColumn,
        name: PrismaVectorStore.ContentColumn,
        tags: PrismaVectorStore.ContentColumn,
      },
      filter,
    }
  );
}

@Injectable()
export class ProductService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  async similarTo(productId: string): Promise<IProductScore[]> {
    // jaccardIndex();
    // ToDo: Store cache of relations between all of them? Simetric relation
    const product = await this.prismaService.client.product.findUnique({
      where: {
        id: productId,
      },
    });
    if (!product) {
      // throw new ExtendedBadRequestException();
      throw new BadRequestException(productId, 'Product not found');
    }
    const vectorStore = createVectorStore(this.prismaService.client, undefined, {
      content: {
        equals: "default",
      },
    });
    const similarityResults = await vectorStore.similaritySearch(product.description, 10);
    return similarityResults.map(
      (similarityResult) => ({productId: similarityResult.id || '', score: similarityResult.metadata._distance || 0}),
    );
    // return this.prismaService.client.product.findMany({
    //   where: {
    //     id: {
    //       in: similarityResults.map(item => item.id),
    //     },
    //   },
    // });
  }

  async bulkCreate(
    items: IProduct[],
  ) {
    const {openIaApiKey} = this.configService.get<AppConfig>(EnvObjects.APP_CONFIG)!;
    const vectorStore = createVectorStore(this.prismaService.client, openIaApiKey);
    await vectorStore.addModels(
      await this.prismaService.client.$transaction(
        items.map((item) => this.prismaService.client.product.create({
          data: {
            id: item.id,
            tags: Array.from(new Set(item.tags).values()),
            description: item.description,
            name: item.name,
          },
        })),
      ),
    );
    // const authOpenIaApi = openIaApi.auth(`Bearer ${openIaApiKey}`);
    // await Promise.all(items.map(
    //   async (item) => {
    //     const wordEmbedding = await authOpenIaApi.json({
    //       input: item.description,
    //       model: 'text-embedding-3-small',
    //     }).post('/v1/embeddings');
    //     const tags = new Set(item.tags).values();
    //   },
    // ));
  }
}
