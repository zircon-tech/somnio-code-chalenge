import { Prisma } from '@prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IProduct, IProductScore } from './types';
import { AppConfig, EnvObjects } from '../config/types';
import { PrismaService } from '../prisma/prisma.service';
import OpenAI from 'openai';

function jaccardIndex(s1: Set<string>, s2: Set<string>) {
  return (s1 as any).intersection(s2).size / (s1 as any).union(s2).size;
}
function formatVector(vect: number[]) {
  return `[${vect.map((nn) => nn.toString(10)).join(',')}]`;
}

const TAGS_WEIGH = 0.5;
const DESCRIPTION_WEIGH = 1 - TAGS_WEIGH;

@Injectable()
export class ProductService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  async similarTo(productId: string): Promise<IProductScore[]> {
    const product = await this.prismaService.client.product.findUnique({
      where: {
        id: productId,
      },
    });
    if (!product) {
      throw new BadRequestException(productId, 'Product not found');
    }
    const scores = await this.prismaService.client.$queryRaw<
          (IProductScore & {tagScore: number})[]
        >`
SELECT
    array_length(allTags.items, 1) AS "unionSize",
    interTags.sizee AS "interSize",
    CASE array_length(allTags.items, 1) WHEN 0 THEN 0 ELSE (interTags.sizee::float / array_length(allTags.items, 1)::float) END AS "tagScore",
    pp2."id" AS "productId",
    1 - ((pp1."wordEmbedding" <=> pp2."wordEmbedding") / 2) AS "score"
FROM
    "Product" AS pp1,
    "Product" AS pp2,
    LATERAL (
        SELECT
            array_agg(tt.tag) as items
        FROM
            (
                SELECT DISTINCT
                    tp2."tagValue" AS tag
                FROM
                    "TagOfProduct" AS tp1, "TagOfProduct" AS tp2
                WHERE
                    tp1."tagValue" = tp2."tagValue" AND (tp2."productId" = pp2."id" OR tp1."productId" = pp1."id")
            ) AS tt
    ) AS allTags,
    LATERAL (
        SELECT
            icount(array_agg(tt.tag)) as sizee
        FROM
            (
                SELECT DISTINCT
                    array_position(allTags.items, tp2."tagValue") AS tag
                FROM
                    "TagOfProduct" AS tp1, "TagOfProduct" AS tp2
                WHERE
                    tp1."tagValue" = tp2."tagValue" AND (tp2."productId" = pp2."id" AND tp1."productId" = pp1."id")
            ) AS tt
    ) AS interTags
WHERE
    pp2."id" != pp1."id" AND pp1."id" = ${productId};            
        `;
    return scores.map(
      ({score, tagScore, productId}) => ({
        score: TAGS_WEIGH * tagScore + DESCRIPTION_WEIGH * score,
        productId,
      }),
    );
  }

  async bulkCreate(items: IProduct[]) {
    const { openIaApiKey } = this.configService.get<AppConfig>(
      EnvObjects.APP_CONFIG,
    )!;
    const openAIClient = new OpenAI({
      apiKey: openIaApiKey,
    });
    const wEmbeddingsItems = await Promise.all(
      items.map(async (item) => {
        try {
          const wordEmbeddingResponse = await openAIClient.embeddings.create({
            model: 'text-embedding-3-small',
            input: item.description,
          });
          // ToDo: Why returns an array of data?
          const wordEmbedding = wordEmbeddingResponse.data[0].embedding;
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
      }),
    );

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
    await this.prismaService.client.$transaction(
      ([] as Prisma.PrismaPromise<Prisma.BatchPayload | number>[]).concat(...wEmbeddingsItems.map(
        // (wEmbeddingsItem) => this.prismaService.client.$executeRaw
        //   `INSERT INTO "Product" ("id", "name", "description", "tags", "wordEmbedding") VALUES (${wEmbeddingsItem.id},${wEmbeddingsItem.name},${wEmbeddingsItem.description},${wEmbeddingsItem.tags},${formatVector(wEmbeddingsItem.wordEmbedding)});`
        // ,
        (wEmbeddingsItem) => [
          this.prismaService.client.$executeRawUnsafe(
            `INSERT INTO "Product" ("id", "name", "description", "tags", "wordEmbedding") VALUES ($1,$2,$3,$4,'${formatVector(wEmbeddingsItem.wordEmbedding)}'::vector);`,
            ...[
              wEmbeddingsItem.id,
              wEmbeddingsItem.name,
              wEmbeddingsItem.description,
              wEmbeddingsItem.tags,
            ],
          ),
          // ToDo: Store cache of relations between all of them? Symmetric relation
          this.prismaService.client.tagOfProduct.createMany({
            data: wEmbeddingsItem.tags.map(
              (tag) => ({tagValue: tag, productId: wEmbeddingsItem.id}),
            ),
          }),
        ],
      )),
    );
  }
}
