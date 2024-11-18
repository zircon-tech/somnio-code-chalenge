export enum AppErrorCode {
  DUMMY = 'DUMMY',
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
  RECORD_NOT_FOUND = 'RECORD_NOT_FOUND',
}

export class BaseLogicError extends Error {}
export class RecordNotFound extends BaseLogicError {}
export class InvalidCredentials extends BaseLogicError {}
