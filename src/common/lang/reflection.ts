export function assert(cond, msg, errorCls = Error) {
  if (!cond) {
    throw new errorCls(msg);
  }
}

export function LoggedCall(): MethodDecorator {
  return (target, key, descriptor) => {
    const oldCall = descriptor.value;
    if (!(oldCall instanceof Function)) {
      return;
    }
    const newCall = async function (...args) {
      if (this.logger?.info) {
        this.logger.info(key.toString());
      }
      return oldCall.apply(this, args);
    };
    Object.defineProperty(newCall, 'name', {
      value: oldCall.name,
      writable: false,
    });
    descriptor.value = newCall as any;
  };
}
