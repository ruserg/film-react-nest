import 'dotenv/config';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exception-filter.http';
import { createLoggerByEnv } from './logger/logger.factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.setGlobalPrefix('api/afisha');
  const corsOrigins = process.env.CORS_ORIGINS?.split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  app.enableCors(
    corsOrigins?.length
      ? { origin: corsOrigins }
      : {
          origin: [
            'http://film.sergd.nomorepartiessite.ru',
            'https://film.sergd.nomorepartiessite.ru',
            'http://backendfilm.sergd.nomorepartiessite.ru',
            'https://backendfilm.sergd.nomorepartiessite.ru',
            /^http:\/\/localhost(?::\d+)?$/,
            /^http:\/\/127\.0\.0\.1(?::\d+)?$/,
          ],
        },
  );
  app.useLogger(createLoggerByEnv());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
      exceptionFactory: (errors) => {
        const message = errors
          .map((e) => Object.values(e.constraints ?? {}).join(', '))
          .join('; ');
        return new BadRequestException({
          error: message || 'Validation failed',
        });
      },
    }),
  );
  await app.listen(3000);
}
bootstrap();
