import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiErrorResponse } from '../interfaces/api-response.interface';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    let message = exception.message;

    if (exception instanceof BadRequestException) {
      const exceptionResponse = exception.getResponse() as any;
      if (
        exceptionResponse?.message &&
        Array.isArray(exceptionResponse.message)
      ) {
        message = exceptionResponse.message.join(', ');
      } else if (typeof exceptionResponse?.message === 'string') {
        message = exceptionResponse.message;
      }
    }

    const errorResponse: ApiErrorResponse = {
      status,
      error: HttpStatus[status] || 'Unknown Error',
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }
}
