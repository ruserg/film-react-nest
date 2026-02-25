import { Injectable, NotFoundException } from '@nestjs/common';
import { FilmsRepository } from './repository/films.repository';
import { FilmsResponseDto, ScheduleResponseDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async getFilms(): Promise<FilmsResponseDto> {
    const docs = await this.filmsRepository.findAll();
    const items = docs.map((d) => this.filmsRepository.toFilmDto(d));
    return { total: items.length, items };
  }

  async getSchedule(filmId: string): Promise<ScheduleResponseDto> {
    const doc = await this.filmsRepository.findById(filmId);
    if (!doc) {
      throw new NotFoundException({ error: 'Film not found' });
    }
    const schedule = doc.schedule ?? [];
    const items = schedule.map((s) =>
      this.filmsRepository.toScheduleItemDto({
        ...s,
        hall: String(s.hall),
      }),
    );
    return { total: items.length, items };
  }
}
