import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const body = exception.getResponse();
    const errorMessage =
      typeof body === 'object' && body !== null && 'error' in body
        ? String((body as { error: unknown }).error)
        : typeof body === 'string'
          ? body
          : 'Request failed';
    if (status === HttpStatus.BAD_REQUEST || status === HttpStatus.NOT_FOUND) {
      response.status(status).json({ error: errorMessage });
      return;
    }
    response
      .status(status)
      .json(
        typeof body === 'object' && body !== null
          ? body
          : { error: errorMessage },
      );
  }
}
