import { JsonEncodeAble } from './builders';

export function isJsonEncodeAble(
  candidate: unknown,
): candidate is JsonEncodeAble {
  // ToDo: Check circular object/array...
  if (
    !(candidate instanceof Array) &&
    !(candidate instanceof Object) &&
    candidate !== null &&
    typeof candidate !== 'string' &&
    typeof candidate !== 'number'
  ) {
    return false;
  }
  if (candidate instanceof Array) {
    return candidate.every((a) => isJsonEncodeAble(a));
  }
  if (candidate instanceof Object) {
    return Object.entries(candidate).every(([, vv]) => isJsonEncodeAble(vv));
  }
  return true;
}
