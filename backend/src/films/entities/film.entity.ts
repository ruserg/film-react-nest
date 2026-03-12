import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ScheduleEntity } from './schedule.entity';

@Entity('films')
export class FilmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('decimal', { precision: 4, scale: 1, nullable: true })
  rating: number | null;

  @Column({ nullable: true })
  director: string | null;

  @Column('text', { array: true, default: [] })
  tags: string[];

  @Column()
  title: string;

  @Column({ nullable: true })
  about: string | null;

  @Column({ nullable: true })
  description: string | null;

  @Column({ nullable: true })
  image: string | null;

  @Column({ nullable: true })
  cover: string | null;

  @OneToMany(() => ScheduleEntity, (schedule) => schedule.film, {
    eager: true,
    cascade: true,
  })
  schedule: ScheduleEntity[];
}
