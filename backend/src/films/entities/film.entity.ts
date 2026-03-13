import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ScheduleEntity } from './schedule.entity';

@Entity('films')
export class FilmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('decimal', { precision: 4, scale: 1, nullable: true })
  rating: number | null;

  @Column('varchar', { nullable: true })
  director: string | null;

  @Column('text', { array: true, default: [] })
  tags: string[];

  @Column('varchar')
  title: string;

  @Column('text', { nullable: true })
  about: string | null;

  @Column('text', { nullable: true })
  description: string | null;

  @Column('varchar', { nullable: true })
  image: string | null;

  @Column('varchar', { nullable: true })
  cover: string | null;

  @OneToMany(() => ScheduleEntity, (schedule) => schedule.film, {
    eager: true,
    cascade: true,
  })
  schedule: ScheduleEntity[];
}
