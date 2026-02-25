import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, FilmDocument } from '../schemas/film.schema';
import { FilmDto, ScheduleItemDto } from '../dto/films.dto';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<FilmDocument>,
  ) {}

  async findAll(): Promise<FilmDocument[]> {
    return this.filmModel.find().lean().exec();
  }

  async findById(id: string): Promise<FilmDocument | null> {
    return this.filmModel.findOne({ id }).lean().exec();
  }

  async findByIdForUpdate(id: string): Promise<FilmDocument | null> {
    return this.filmModel.findOne({ id }).exec();
  }

  /** Добавить занятые места в сеанс. Возвращает обновлённый документ или null. */
  async addTakenToSession(
    filmId: string,
    sessionId: string,
    takenKeys: string[],
  ): Promise<FilmDocument | null> {
    const doc = await this.filmModel.findOne({ id: filmId }).exec();
    if (!doc) return null;
    const session = doc.schedule.find((s) => s.id === sessionId);
    if (!session) return null;
    const existing = new Set(session.taken);
    for (const key of takenKeys) {
      existing.add(key);
    }
    session.taken = Array.from(existing);
    doc.markModified('schedule');
    await doc.save();
    return doc;
  }

  toFilmDto(
    doc: FilmDocument | { id: string; [key: string]: unknown },
  ): FilmDto {
    const d = doc as {
      id: string;
      rating?: number;
      director?: string;
      tags?: string[];
      title: string;
      about?: string;
      description?: string;
      image?: string;
      cover?: string;
    };
    return {
      id: d.id,
      rating: d.rating,
      director: d.director,
      tags: d.tags ?? [],
      title: d.title,
      about: d.about,
      description: d.description,
      image: d.image,
      cover: d.cover,
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
      hall: String(item.hall),
      rows: item.rows,
      seats: item.seats,
      price: item.price,
      taken: item.taken ?? [],
    };
  }
}
