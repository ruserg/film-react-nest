import { ConfigService } from '@nestjs/config';
import { AppConfig } from './app.config';

export const configProvider = {
  provide: 'CONFIG',
  useFactory: (config: ConfigService): AppConfig => ({
    database: {
      driver: config.get<string>('DATABASE_DRIVER') ?? 'mongodb',
      url: config.get<string>('DATABASE_URL') ?? '',
      host: config.get<string>('DATABASE_HOST') ?? 'localhost',
      port: parseInt(config.get<string>('DATABASE_PORT') ?? '5432', 10),
      username: config.get<string>('DATABASE_USERNAME') ?? 'postgres',
      password: config.get<string>('DATABASE_PASSWORD') ?? '',
      name: config.get<string>('DATABASE_NAME') ?? 'film',
    },
  }),
  inject: [ConfigService],
};
