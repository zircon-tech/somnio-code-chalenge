import * as lodash from 'lodash';
import { sleep } from './async';

export class BucketRunner<T> {
  constructor(
    private readonly parallel: number,
    private readonly sleepMillis: number,
    private readonly logger: (msg: string) => void,
    private readonly action: (input: T) => any,
  ) {
    this.parallel = parallel;
    this.sleepMillis = sleepMillis;
    this.logger = logger;
    this.action = action;
  }

  async run(dataCollection: T[]) {
    const buckets = lodash.groupBy<[T, number]>(
      dataCollection.map((aa, ind) => [aa, ind]),
      ([, ind]) => ind % this.parallel,
    );
    const buckets2: T[][] = Object.values(buckets).map((a) =>
      a.map((b) => b[0]),
    );
    let ii = 0;
    try {
      await Promise.all(
        buckets2.map(async (bucket) => {
          for (const elem of bucket) {
            await this.action(elem);
            ii += 1;
            if (!(ii % this.parallel)) {
              console.log('count', ii, 'done out of', dataCollection.length);
            }
            await sleep(this.sleepMillis);
          }
        }),
      );
    } catch (e) {
      console.error(e);
    }
  }
}
