import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
// import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import { ConfigService } from '@nestjs/config';
import {
  AppErrorCode,
  BaseLogicError,
  mapBaseErrorType2ErrorCode,
  mapNativeError2ErrorCode,
} from './error-codes';
import { isExtendedError } from './common/exceptions';
import { AppConfig, EnvObjects } from './config/types';

@Catch()
export class ReshapeExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}
  // @Optional() @InjectSentry() private readonly sentryService: SentryService;

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let isBasicLogicError = false;
    if (!(exception instanceof HttpException)) {
      // this.logger.error(exception as any);
      // if (this.sentryService) {
      //   this.sentryService.instance().captureException(exception);
      // }
    }

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '';
    let code = null;
    let args = {};
    let rr;
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      rr = exception.getResponse();
      if (isExtendedError(exception)) {
        code = exception.getCode();
        args = exception.getArgs();
      }
    } else if (exception instanceof BaseLogicError) {
      isBasicLogicError = true;
      statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
      ({ appCode: code, args } = mapBaseErrorType2ErrorCode(exception));
      if (!code) {
        ({ appCode: code, args } = mapNativeError2ErrorCode(exception));
        if (!code) {
          code = AppErrorCode.UNEXPECTED_ERROR;
        }
      }
      message = exception.message;
    } else if (exception instanceof Error) {
      ({ appCode: code, args } = mapNativeError2ErrorCode(exception));
      if (!code) {
        code = AppErrorCode.UNEXPECTED_ERROR;
        message = exception.toString();
      }
    } else {
      code = AppErrorCode.UNEXPECTED_ERROR;
      message = exception.toString();
    }

    const { isNotProductionDeploy } = this.configService.get<AppConfig>(
      EnvObjects.APP_CONFIG,
    );

    const shouldShowMessage = isNotProductionDeploy || isBasicLogicError;
    const formattedMessage =
      typeof message === 'string' ? message : JSON.stringify(message);

    response.status(statusCode).json({
      // With this we make sure that the message is always shown ONLY when isNotProductionDeploy OR the error is a BaseLogicError
      message: shouldShowMessage ? formattedMessage : '',
      appCode: code,
      args,
      ...rr,
    });
  }
}
