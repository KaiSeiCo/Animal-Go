import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { isDev } from 'src/config/env/env';
import { LoggerService } from 'src/global/logger/logger.service';
import { Result } from '../class/result.class';
import { ApiException } from '../exception/api.exception';

/**
 * Exception Filter:
 * if is Internal Server Error, use ==> throw new Error()
 * if is Http Server Error, use ==> throw new ApiException()
 */
@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.header('Content-Type', 'application/json; charset=utf-8');
    const code =
      exception instanceof ApiException
        ? (exception as ApiException).getErrorCode()
        : status;
    // message
    let message = 'Internal Server Error';
    if (isDev() || status < 500) {
      message =
        exception instanceof HttpException ? exception.message : `${exception}`;
    }

    if (status >= 500) {
      // record error log
      console.error(exception);
    }
    const result = new Result(null, message, code);
    response.status(status).send(result);
  }
}
