import { setTimeout } from 'node:timers';

export class Deferred<T> {
  public promise: Promise<T>;
  public reject: (err: Error) => void;
  public resolve: (value: T) => void;

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject;
      this.resolve = resolve;
    });
  }
}

export function cancelAblePromise<T>(prom: Promise<T>): {
  promise: Promise<T | void>;
  cancel: () => { hasChanged: boolean };
  canceled: boolean;
} {
  const obj = {
    promise: prom.then(
      (res) => {
        if (!obj.canceled) {
          return res;
        }
      },
      (err) => {
        if (!obj.canceled) {
          throw err;
        }
      },
    ),
    canceled: false,
    cancel: () => {
      const hasChanged = !obj.canceled;
      obj.canceled = true;
      return { hasChanged };
    },
  };
  return obj;
}

export async function sleep(time_milliseconds: number) {
  await new Promise((resolve) => setTimeout(resolve, time_milliseconds));
}

export function wrapPromise<T>(
  fn: (...arg: any[]) => T,
): (...arg: any[]) => Promise<T> {
  return async (...args: any[]) => fn(...args);
}

/*
Takes an async function and invoques it outside from main http thread
 */
export function executeDetached(invocation: () => Promise<any>): void {
  invocation();
}

/*
const tt = setSyncTimeout(
  async (...args) => {
    console.log('will sleep');
    await sleep(5*1000);
    spy.call(...args);
    console.log('woke up');
  },
  3,
  1 * 1000,
  {a: 1, b: 2}
);

await sleep(12*1000);
clearSyncTimeout(tt);
assert(spy.to.have.been.called.times(2))
await sleep(6*1000);
assert(spy.to.have.been.called.times(2))
 */
export class SyncInterval {
  constructor(
    public readonly triesMax: number,
    public id: ReturnType<typeof setTimeout> | null = null,
  ) {}

  // id: ReturnType<typeof setTimeout> | null;
  // id: number;
  // triesMax: number;
  triesCount: number = 0;
  cleared: boolean = false;
}

export function setSyncInterval<TArgs extends any[]>(
  callback: (...args: TArgs) => Promise<void>,
  tries: number,
  ms?: number,
  ...args: TArgs
): SyncInterval {
  const to = new SyncInterval(tries);
  const nCallback = () => {
    if (to.cleared) {
      return;
    }
    if (to.triesCount >= to.triesMax) {
      return;
    }
    to.triesCount += 1;
    to.id = setTimeout(
      (...args1: TArgs) => {
        callback(...args1)
          .catch()
          .then(nCallback);
      },
      ms,
      ...args,
    );
  };
  nCallback();
  return to;
}

function rr() {
  setTimeout(() => {
    console.log('aa');
    rr();
  }, 1000);
}

export function clearSyncTimeout(to: SyncInterval) {
  to.cleared = true;
  if (to.id !== null) {
    clearTimeout(to.id);
  }
}

export async function promiseSequence(
  promises: Promise<void>[],
): Promise<void> {
  for (const promise of promises) {
    await promise;
  }
}
