import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ScheduleItem, ScheduleItemSchema } from './schedule.schema';

export type FilmDocument = Film & Document;

@Schema({ collection: 'films' })
export class Film {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop()
  rating?: number;

  @Prop()
  director?: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ required: true })
  title: string;

  @Prop()
  about?: string;

  @Prop()
  description?: string;

  @Prop()
  image?: string;

  @Prop()
  cover?: string;

  @Prop({ type: [ScheduleItemSchema], default: [] })
  schedule: ScheduleItem[];
}

export const FilmSchema = SchemaFactory.createForClass(Film);
