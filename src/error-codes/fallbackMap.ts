import { Prisma } from '@prisma/client';
import { JsonEncodeAble } from '../types/builders';
import { isJsonEncodeAble } from '../types/guard';
import { AppErrorCode } from './codes';

export function mapNativeError2ErrorCode(exception: Error): {
  appCode?: AppErrorCode;
  args?: JsonEncodeAble;
} {
  if (exception instanceof Prisma.PrismaClientValidationError) {
    const msg = exception.message;
    const argument = msg.substring(msg.indexOf('})\n\n') + 4);
    return {
      appCode: AppErrorCode.UNEXPECTED_ERROR,
      args: {},
    };
  } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
    const metaContent = exception.meta;
    switch (exception.code) {
      case 'P2002': {
        // "Unique constraint failed on the {constraint}"
        return {
          appCode: AppErrorCode.UNEXPECTED_ERROR,
          args: {
            fields: typeof metaContent?.target !== 'undefined' && isJsonEncodeAble(metaContent.target)
              ? metaContent.target
              : {},
          },
        };
      }
      case 'P2003': {
        // "Foreign key constraint failed on the field: {field_name}"
        return {
          appCode: AppErrorCode.UNEXPECTED_ERROR,
          args: {},
        };
      }
      case 'P2005': {
        // "The value {field_value} stored in the database for the field {field_name} is invalid for the field's type"
        return {
          appCode: AppErrorCode.UNEXPECTED_ERROR,
          args: {},
        };
      }
      default: {
        return {
          appCode: AppErrorCode.UNEXPECTED_ERROR,
          args: {},
        };
      }
    }
  } else {
    return {};
  }
}
