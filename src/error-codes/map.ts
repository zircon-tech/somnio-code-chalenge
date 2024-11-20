import { AppErrorCode, BaseLogicError, RecordNotFound } from './codes';
import type { ErrorMap } from './types';

const errorMap: ErrorMap = new Map([
  [BaseLogicError, AppErrorCode.UNEXPECTED_ERROR],
  [RecordNotFound, AppErrorCode.RECORD_NOT_FOUND],
]);

export default errorMap;
