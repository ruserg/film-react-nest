import { FilmDto, ScheduleItemDto } from '../dto/films.dto';

export interface FilmWithSchedule {
  id: string;
  rating?: number | null;
  director?: string | null;
  tags?: string[];
  title: string;
  about?: string | null;
  description?: string | null;
  image?: string | null;
  cover?: string | null;
  schedule: Array<{
    id: string;
    daytime: string;
    hall: string | number;
    rows: number;
    seats: number;
    price: number;
    taken?: string[];
  }>;
}

export abstract class FilmsRepository {
  abstract findAll(): Promise<FilmWithSchedule[]>;
  abstract findById(id: string): Promise<FilmWithSchedule | null>;
  abstract addTakenToSession(
    filmId: string,
    sessionId: string,
    takenKeys: string[],
  ): Promise<FilmWithSchedule | null>;

  toFilmDto(doc: FilmWithSchedule): FilmDto {
    return {
      id: doc.id,
      rating: doc.rating ?? undefined,
      director: doc.director ?? undefined,
      tags: doc.tags ?? [],
      title: doc.title,
      about: doc.about ?? undefined,
      description: doc.description ?? undefined,
      image: doc.image ?? undefined,
      cover: doc.cover ?? undefined,
    };
  }

  toScheduleItemDto(item: {
    id: string;
    daytime: string;
    hall: string | number;
    rows: number;
    seats: number;
    price: number;
    taken?: string[];
  }): ScheduleItemDto {
    return {
      id: item.id,
      daytime: item.daytime,
      hall: typeof item.hall === 'string' ? item.hall : String(item.hall ?? ''),
      rows: item.rows,
      seats: item.seats,
      price: Number(item.price),
      taken: item.taken ?? [],
    };
  }
}
