import { AppErrorCode, BaseLogicError } from './codes';
import errorMapping from './map';
import type { ErrorMap } from './types';

function mapErrorType2ErrorCodeInternal(
  errMapping: ErrorMap,
  value: BaseLogicError,
): AppErrorCode | null {
  const entries = Array.from(errMapping.entries());
  entries.sort(([A], [B]) => (B.prototype instanceof A ? 1 : B === A ? 0 : -1));
  for (const [kk, vv] of entries) {
    if (value instanceof kk) {
      return vv;
    }
  }
  return null;
}

export function mapBaseErrorType2ErrorCode(value: BaseLogicError) {
  const code = mapErrorType2ErrorCodeInternal(errorMapping, value);
  return { appCode: code, args: {} };
}
