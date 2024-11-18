import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
  ValidationError,
} from '@nestjs/common';
import { AppErrorCode } from './error-codes';

export interface ExtendedError {
  getArgs(): Record<any, any>;
  getCode(): AppErrorCode;
}

export function isExtendedError(object: any): object is ExtendedError {
  return 'getCode' in object && 'getArgs' in object;
}

export class ExtendedBadRequestException
  extends BadRequestException
  implements ExtendedError
{
  public args: Record<any, any>;
  public code: AppErrorCode;
  constructor(code: AppErrorCode, args?: Record<any, any>, msg?: string) {
    super(msg);
    this.code = code;
    this.args = args || {};
  }
  getArgs() {
    return this.args;
  }
  getCode() {
    return this.code;
  }
}

function formatNestedValidationErrors(
  err: ValidationError[],
): Record<string, string> {
  return err.reduce((acc, err) => {
    if (err.children) {
      Object.entries(formatNestedValidationErrors(err.children)).forEach(
        ([key, value]) => {
          acc[`${err.property}.${key}`] = value;
        },
      );
    }
    if (err.constraints && Object.values(err.constraints).length > 0) {
      acc[err.property] = Object.values(err.constraints)[0];
    }
    return acc;
  }, {});
}

export class ExtendedValidationRequestException
  extends BadRequestException
  implements ExtendedError
{
  public errors: ValidationError[];
  public code: AppErrorCode;
  constructor(errors: ValidationError[]) {
    super('Validation error');
    this.code = AppErrorCode.APP_VALIDATION_ERROR;
    this.errors = errors;
  }
  getArgs() {
    if (Array.isArray(this.errors)) {
      return formatNestedValidationErrors(this.errors);
    }
    return this.errors;
  }
  getCode() {
    return this.code;
  }
}
