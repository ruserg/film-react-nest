-- Схема под TypeORM (PostgreSQL): films + schedules
DROP TABLE IF EXISTS schedules;
DROP TABLE IF EXISTS films;

CREATE TABLE films (
  id uuid PRIMARY KEY,
  rating decimal(4,1),
  director varchar,
  tags text[] NOT NULL DEFAULT '{}',
  title varchar NOT NULL,
  about text,
  description text,
  image varchar,
  cover varchar
);

CREATE TABLE schedules (
  id uuid PRIMARY KEY,
  daytime varchar NOT NULL,
  hall int NOT NULL,
  rows int NOT NULL,
  seats int NOT NULL,
  price decimal(10,2) NOT NULL,
  taken text[] NOT NULL DEFAULT '{}',
  film_id uuid NOT NULL REFERENCES films (id) ON DELETE CASCADE
);

CREATE INDEX idx_schedules_film_id ON schedules (film_id);
