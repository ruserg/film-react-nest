import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmEntity } from './entities/film.entity';
import { ScheduleEntity } from './entities/schedule.entity';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmsMongooseRepository } from './repository/films.mongoose.repository';
import { FilmsRepository } from './repository/films.repository';
import { FilmsTypeormRepository } from './repository/films.typeorm.repository';
import { Film, FilmSchema } from './schemas/film.schema';

@Module({})
export class FilmsModule {
  static register(driver: string): DynamicModule {
    if (driver === 'postgres') {
      return {
        global: true,
        module: FilmsModule,
        imports: [TypeOrmModule.forFeature([FilmEntity, ScheduleEntity])],
        controllers: [FilmsController],
        providers: [
          FilmsService,
          FilmsTypeormRepository,
          {
            provide: FilmsRepository,
            useExisting: FilmsTypeormRepository,
          },
        ],
        exports: [FilmsService, FilmsRepository],
      };
    }

    return {
      global: true,
      module: FilmsModule,
      imports: [
        MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
      ],
      controllers: [FilmsController],
      providers: [
        FilmsService,
        FilmsMongooseRepository,
        {
          provide: FilmsRepository,
          useExisting: FilmsMongooseRepository,
        },
      ],
      exports: [FilmsService, FilmsRepository],
    };
  }
}
