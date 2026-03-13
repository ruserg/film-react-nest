import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilmEntity } from '../entities/film.entity';
import { ScheduleEntity } from '../entities/schedule.entity';
import { FilmWithSchedule, FilmsRepository } from './films.repository';

@Injectable()
export class FilmsTypeormRepository extends FilmsRepository {
  constructor(
    @InjectRepository(FilmEntity)
    private readonly filmRepo: Repository<FilmEntity>,
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepo: Repository<ScheduleEntity>,
  ) {
    super();
  }

  async findAll(): Promise<FilmWithSchedule[]> {
    return this.filmRepo.find() as Promise<FilmWithSchedule[]>;
  }

  async findById(id: string): Promise<FilmWithSchedule | null> {
    return this.filmRepo.findOne({
      where: { id },
    }) as Promise<FilmWithSchedule | null>;
  }

  async addTakenToSession(
    filmId: string,
    sessionId: string,
    takenKeys: string[],
  ): Promise<FilmWithSchedule | null> {
    const schedule = await this.scheduleRepo.findOne({
      where: { id: sessionId, film_id: filmId },
    });
    if (!schedule) return null;

    const existing = new Set(schedule.taken ?? []);
    for (const key of takenKeys) {
      existing.add(key);
    }
    schedule.taken = Array.from(existing);
    await this.scheduleRepo.save(schedule);

    return this.findById(filmId);
  }
}
