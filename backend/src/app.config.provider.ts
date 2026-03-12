import { ConfigService } from '@nestjs/config';
import { AppConfig } from './app.config';

export const configProvider = {
  provide: 'CONFIG',
  useFactory: (config: ConfigService): AppConfig => ({
    database: {
      driver: config.get<string>('DATABASE_DRIVER') ?? 'mongodb',
      url: config.get<string>('DATABASE_URL') ?? '',
    },
  }),
  inject: [ConfigService],
};
