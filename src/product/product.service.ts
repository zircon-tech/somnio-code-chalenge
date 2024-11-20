import { Prisma } from '@prisma/client';
import {BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {IProduct, IProductScore } from './types';
// import wretch from "wretch";
import { AppConfig,EnvObjects } from '../config/types';
import { PrismaService } from '../prisma/prisma.service';
// import { PrismaVectorStore } from "@langchain/community/vectorstores/prisma";
// import { OpenAIEmbeddings } from "@langchain/openai";
// import { Prisma, Product, PrismaClient } from "@prisma/client";
import OpenAI from 'openai';
// import OpenAI from 'jsr:@openai/openai';

// curl https://api.openai.com/v1/embeddings   -H "Content-Type: application/json"   -H "Authorization: Bearer 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"   -d '{
//     "input": "Your text string goes here",
//     "model": "text-embedding-3-small"
//   }'
// const openIaApi = wretch("https://api.openai.com").errorType("json").resolve(r => r.json());

function jaccardIndex(s1: Set<string>, s2: string[]) {
  return (s1 as any).intersection(s2).size / (s1 as any).union(s2).size;
}

// function createVectorStore(client: PrismaClient, apiKey?: string, filter?: any) {
//   return PrismaVectorStore.withModel<Product>(client).create(
//     new OpenAIEmbeddings({
//       apiKey,
//       model: "text-embedding-3-large",
//     }),
//     {
//       prisma: Prisma,
//       tableName: "Product",
//       vectorColumnName: "wordEmbedding",
//       columns: {
//         id: PrismaVectorStore.IdColumn,
//         description: PrismaVectorStore.ContentColumn,
//         name: PrismaVectorStore.ContentColumn,
//         tags: PrismaVectorStore.ContentColumn,
//       },
//       filter,
//     }
//   );
// }

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

    return this.prismaService.client.$queryRaw<IProductScore[]>`SELECT pp2."id" AS "productId", 1 - (pp1."wordEmbedding" <=> pp2."wordEmbedding") AS "score" FROM "Product" AS pp1, "Product" AS pp2 WHERE pp2."id" != pp1."id" AND pp1."id" = ${productId};`;

    // const vectorStore = createVectorStore(this.prismaService.client, undefined, {
    //   id: {
    //     equals: productId,
    //   },
    // });
    // const similarityResults = await vectorStore.similaritySearchVectorWithScore(product.wordEmbedding, 10);
    // return similarityResults.map(
    //   ([similarityResult, score]) => ({productId: similarityResult.id || '', score}),
    // );
    // return this.prismaService.client.product.findMany({
    //   where: {
    //     id: {
    //       in: similarityResults.map(item => item.id),
    //     },
    //   },
    // });
    // console.log(await this.client.$queryRaw`SELECT * FROM "Product";`);
  }

  async bulkCreate(
    items: IProduct[],
  ) {
    const {openIaApiKey} = this.configService.get<AppConfig>(EnvObjects.APP_CONFIG)!;

    // const vectorStore = createVectorStore(this.prismaService.client, openIaApiKey);
    // await vectorStore.addModels(
    //   await this.prismaService.client.$transaction(
    //     items.map((item) => this.prismaService.client.product.create({
    //       data: {
    //         id: item.id,
    //         tags: Array.from(new Set(item.tags).values()),
    //         description: item.description,
    //         name: item.name,
    //       },
    //     })),
    //   ),
    // );
    // const authOpenIaApi = openIaApi.auth(`Bearer ${openIaApiKey}`);

    const openAIClient = new OpenAI({
      apiKey: openIaApiKey,
    });
    const wEmbeddingsItems = await Promise.all(items.map(
      async (item) => {
        // const wordEmbeddingResponse = await authOpenIaApi.json({
        //   input: item.description,
        //   model: 'text-embedding-3-small',
        // }).url('/v1/embeddings').post();
        // const wordEmbedding = wordEmbeddingResponse.data[0].embedding;
        try {
          const wordEmbeddingResponse = await openAIClient.embeddings.create({
            model: 'text-embedding-3-small',
            input: item.description,
          });
          // ToDo: Why returns an array of data?
          const wordEmbedding = wordEmbeddingResponse.data[0].embedding;
          // const wordEmbedding = [1, 0, -1, 0.5, -0.5];
          return {
            ...item,
            wordEmbedding,
            tags: Array.from(new Set(item.tags).values()),
          };
        } catch (err) {
          if (err instanceof OpenAI.APIError) {
            throw err;
          }
          throw err;
        }
      },
    ));

    // const placeholders = wEmbeddingsItems.map(
    //    (_, idx) => `($${(idx * 5) + 1}, $${(idx * 5) + 2}, $${(idx * 5) + 3}, $${(idx * 5) + 4}, $${(idx * 5) + 5})`
    //  ).join(',');
    // const rawValues = Prisma.raw(`INSERT INTO items (id, name, description, tags, wordEmbedding) VALUES ${placeholders});`);
    // rawValues.values = [].concat(...wEmbeddingsItems.map(({id, name, description, tags, wordEmbedding}) => [id, name, description, tags, wordEmbedding]));
    // await this.prismaService.client.$executeRaw(rawValues);

    // const sqlValues = wEmbeddingsItems.map(
    //   ({id, name, description, tags, wordEmbedding}) => `(${id}, ${name}, ${description}, ${tags}, ${wordEmbedding})`,
    // );
    // this.prismaService.client.$executeRaw`INSERT INTO items (id, name, description, tags, wordEmbedding) VALUES ${sqlValues};`;
    function formatVector(vect: number[]) {
      return `[${vect.map(nn => nn.toString(10)).join(',')}]`;
    }
    await this.prismaService.client.$transaction(
      wEmbeddingsItems.map(
        // (wEmbeddingsItem) => this.prismaService.client.$executeRaw
        //   `INSERT INTO "Product" ("id", "name", "description", "tags", "wordEmbedding") VALUES (${wEmbeddingsItem.id},${wEmbeddingsItem.name},${wEmbeddingsItem.description},${wEmbeddingsItem.tags},${formatVector(wEmbeddingsItem.wordEmbedding)});`
        // ,
        (wEmbeddingsItem) => this.prismaService.client.$executeRawUnsafe(
          `INSERT INTO "Product" ("id", "name", "description", "tags", "wordEmbedding") VALUES ($1,$2,$3,$4,'${formatVector(wEmbeddingsItem.wordEmbedding)}'::vector);`,
          ...[wEmbeddingsItem.id, wEmbeddingsItem.name, wEmbeddingsItem.description, wEmbeddingsItem.tags],
        ),
      ),
    );
    // await this.prismaService.client.product.createMany({
    //   data: wEmbeddingsItems.map(
    //     (wEmbeddingsItem) => ({
    //
    //     })
    //   ),
    // });
  }
}
