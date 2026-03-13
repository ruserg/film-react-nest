import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, FilmDocument } from '../schemas/film.schema';
import { FilmWithSchedule, FilmsRepository } from './films.repository';

@Injectable()
export class FilmsMongooseRepository extends FilmsRepository {
  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<FilmDocument>,
  ) {
    super();
  }

  async findAll(): Promise<FilmWithSchedule[]> {
    return this.filmModel.find().lean().exec() as Promise<FilmWithSchedule[]>;
  }

  async findById(id: string): Promise<FilmWithSchedule | null> {
    return this.filmModel
      .findOne({ id })
      .lean()
      .exec() as Promise<FilmWithSchedule | null>;
  }

  async addTakenToSession(
    filmId: string,
    sessionId: string,
    takenKeys: string[],
  ): Promise<FilmWithSchedule | null> {
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
    return doc.toObject() as FilmWithSchedule;
  }
}
