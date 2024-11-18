import * as lodash from 'lodash';
import { Deferred, sleep } from './async';

class SharedMemoryBatcherChild<T> {
  private parent: SharedMemoryBatcher<T>;
  private mustKill: boolean;
  private idd: () => string;
  public builder: (...args) => Promise<T>;

  constructor(idd, builder, parent) {
    this.idd = idd;
    this.builder = builder;
    this.mustKill = false;
    this.parent = parent;
  }

  async add(...args) {
    if (this.mustKill) {
      throw new Error('Cant add new calls');
    }
    const resolver = new Deferred<T>();
    this.parent.queue.push({ args, resolver, child: this });
    return resolver.promise;
  }

  finish() {
    // ToDo: Wait until all process... or kill or cancel old promises
    this.mustKill = true;
  }
}

type QueueItem<T> = {
  resolver: Deferred<T>;
  args: any[];
};

type ChildQueueItem<T> = QueueItem<T> & {
  child: SharedMemoryBatcherChild<T>;
};

export class SharedMemoryBatcher<T> {
  private sleepTime: number;
  private batchSize: number;
  public queue: ChildQueueItem<T>[];
  public builder: (...args) => Promise<T>;
  private mustKill: boolean;
  private rng: (seed: string) => () => string;

  constructor(sleepTime, batchSize, rng, builder) {
    this.sleepTime = sleepTime;
    this.batchSize = batchSize;
    this.queue = [];
    this.rng = rng;
    this.builder = builder;
    this.mustKill = false;
  }

  getChild(builder, namespaces) {
    if (this.mustKill) {
      throw new Error('Cant add new calls');
    }
    return new SharedMemoryBatcherChild(this.rng(namespaces), builder, this);
  }

  async init() {
    while (this.queue.length !== 0 && !this.mustKill) {
      const invocationsChunks = lodash.chunk<ChildQueueItem<T>>(
        this.queue,
        this.batchSize,
      );
      this.queue = [].concat(...invocationsChunks.slice(1));
      const invocationsChunk = invocationsChunks[0];
      if (invocationsChunk) {
        await Promise.all(
          invocationsChunk.map(({ resolver, args, child }) => {
            (child.builder || this.builder)(args).then(
              (rr) => resolver.resolve(rr),
              (err) => resolver.reject(err),
            );
          }),
        );
      }
      await sleep(this.sleepTime);
    }
  }

  finish() {
    // ToDo: Wait until all process... or kill or cancel old promises
    this.mustKill = true;
  }
}

export class MemoryBatcher<T> {
  private sleepTime: number;
  private batchSize: number;
  public queue: QueueItem<T>[];
  public builder: (...args) => Promise<T>;
  private mustKill: boolean;

  constructor(sleepTime, batchSize, builder) {
    this.sleepTime = sleepTime;
    this.batchSize = batchSize;
    this.queue = [];
    this.builder = builder;
    this.mustKill = false;
  }

  async add(...args): Promise<T> {
    if (this.mustKill) {
      throw new Error('Cant add new calls');
    }
    const resolver = new Deferred<T>();
    this.queue.push({ args: args, resolver });
    return resolver.promise;
  }

  async init() {
    while (this.queue.length !== 0 && !this.mustKill) {
      const invocationsChunks = lodash.chunk<QueueItem<T>>(
        this.queue,
        this.batchSize,
      );
      this.queue = [].concat(...invocationsChunks.slice(1));
      const invocationsChunk = invocationsChunks[0];
      if (invocationsChunk) {
        await Promise.all(
          invocationsChunk.map(({ resolver, args }) => {
            return this.builder(...args).then(
              (rr) => resolver.resolve(rr),
              (err) => resolver.reject(err),
            );
          }),
        );
      }
      await sleep(this.sleepTime);
    }
  }

  finish() {
    // ToDo: Wait until all process... or kill or cancel old promises
    this.mustKill = true;
  }
}
