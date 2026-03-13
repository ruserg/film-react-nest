import 'dotenv/config';
import { DynamicModule, Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'node:path';

import { configProvider } from './app.config.provider';
import { FilmEntity } from './films/entities/film.entity';
import { ScheduleEntity } from './films/entities/schedule.entity';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';

const driver = process.env.DATABASE_DRIVER ?? 'mongodb';

function buildDbModule(): DynamicModule {
  if (driver === 'postgres') {
    return TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DATABASE_HOST') ?? 'localhost',
        port: parseInt(config.get<string>('DATABASE_PORT') ?? '5432', 10),
        username: config.get<string>('DATABASE_USERNAME') ?? 'postgres',
        password: config.get<string>('DATABASE_PASSWORD') ?? '',
        database: config.get<string>('DATABASE_NAME') ?? 'film',
        entities: [FilmEntity, ScheduleEntity],
        synchronize: false,
      }),
      inject: [ConfigService],
    });
  }

  return MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (config: ConfigService) => ({
      uri:
        config.get<string>('DATABASE_URL') ?? 'mongodb://localhost:27017/prac',
    }),
    inject: [ConfigService],
  });
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    buildDbModule(),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
    }),
    FilmsModule.register(driver),
    OrderModule,
  ],
  controllers: [],
  providers: [configProvider],
})
export class AppModule {}
