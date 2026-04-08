import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

function pickErrorMessage(body: string | object): string {
  if (typeof body === 'string') {
    return body;
  }
  if (typeof body !== 'object' || body === null) {
    return 'Request failed';
  }
  const o = body as Record<string, unknown>;
  const generic = new Set(['Bad Request', 'Not Found']);
  if (typeof o.error === 'string' && !generic.has(o.error)) {
    return o.error;
  }
  const msg = o.message;
  if (typeof msg === 'string') {
    return msg;
  }
  if (Array.isArray(msg)) {
    return msg.map((m) => String(m)).join('; ');
  }
  if (typeof o.error === 'string') {
    return o.error;
  }
  return 'Request failed';
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const body = exception.getResponse();
    const errorMessage = pickErrorMessage(body as string | object);
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
