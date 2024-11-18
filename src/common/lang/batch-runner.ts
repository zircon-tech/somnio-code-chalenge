import * as lodash from 'lodash';
import { sleep, wrapPromise } from './async';

export class BatchRunner<T, R = any> {
  constructor(
    private readonly batchSize: number,
    private readonly sleepMillis: number,
    private readonly logger: (msg: string) => void,
    private readonly action: (input: T) => R | Promise<R>,
  ) {
    this.batchSize = batchSize;
    this.sleepMillis = sleepMillis;
    this.logger = logger;
    this.action = action;
  }

  async run(
    dataCollection: T[],
    throwOnError = false,
  ): Promise<{ response: R; args: T }[]> {
    this.logger(`Applying to ${dataCollection.length} elements`);
    const chunks = lodash.chunk<T>(dataCollection, this.batchSize);
    let chunkCount = 0;
    let fResults = [];
    for (const chunk of chunks) {
      const results = await Promise.all(
        chunk.map((value) =>
          wrapPromise(this.action)(value).then(
            (response) => ({ response, args: value, error: null }),
            (error) => ({ response: null, args: value, error }),
          ),
        ),
      );
      const errorsOnExec = results.filter(({ error }) => error !== null);
      const okExecs = results.filter(({ error }) => error === null);
      if (errorsOnExec.length > 0) {
        this.logger('There are errors on execution');
        this.logger(
          errorsOnExec
            .map((errorOnExec) => errorOnExec.error.toString())
            .join('\n'),
        );
        if (throwOnError) {
          throw errorsOnExec[0].error;
        }
      }
      chunkCount += 1;
      this.logger(
        `count ${chunkCount * this.batchSize} done out of ${
          dataCollection.length
        }`,
      );
      await sleep(this.sleepMillis);
      fResults = [...fResults, ...okExecs];
    }
    return fResults;
  }
}
