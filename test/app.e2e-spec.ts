import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CommonFixture } from './jest/common-fixture';

const mockCommonFixture = new CommonFixture();

describe('e2e', () => {
  let app: INestApplication;

  beforeEach(async () => {
    await mockCommonFixture.beforeEachCommon();
    app = mockCommonFixture.app;
  });

  afterEach(async () => {
    await mockCommonFixture.afterEachCommon();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('App is running');
  });

  it('products', async () => {
    await request(app.getHttpServer())
      .post('/products')
      .send({
        products: [
          {
            id: 'i1',
            name: 'n1',
            description: 'fooo bar',
            tags: ['t1', 't2', 't2', 't3'],
          },
        ],
      })
      .expect(201);
    await request(app.getHttpServer())
      .post('/products')
      .send({
        products: [
          {
            id: 'i2',
            name: 'n2',
            description: 'yada blah blah',
            tags: ['t2', 't3', 't4'],
          },
          {
            id: 'i3',
            name: 'n3',
            description: 'lorem ipsum dolore',
            tags: ['t2', 't3'],
          },
        ],
      })
      .expect(201);

    const p1Id = 'i1';
    const { body: similarities } = await request(app.getHttpServer())
      .get(`/products/similar/${p1Id}`)
      .expect(200);
    expect(similarities.recommendations[0].score).toEqual(0.8333333333333333);
    expect(similarities.recommendations[0].productId).toEqual('i3');
    expect(similarities.recommendations[1].score).toEqual(0.75);
    expect(similarities.recommendations[1].productId).toEqual('i2');
  });
});
