# FILM!

Учебный проект: фронт (React/Vite), бэкенд (NestJS), API по [`film.yml`](film.yml). Локально бэкенд может работать с **MongoDB** или **PostgreSQL** (`DATABASE_DRIVER` в `backend/.env`).

---

## Задеплоенное приложение

- **Фронт:** [http://film.sergd.nomorepartiessite.ru](http://film.sergd.nomorepartiessite.ru) → после настройки HTTPS: `https://film.sergd.nomorepartiessite.ru`
- **API:** [http://backendfilm.sergd.nomorepartiessite.ru/api/afisha/films](http://backendfilm.sergd.nomorepartiessite.ru/api/afisha/films) → после HTTPS: `https://backendfilm.sergd.nomorepartiessite.ru/api/afisha/films`

Сервер: **158.160.233.240**; оба поддомена указывают на один IP, маршрутизация по `Host` — в [`nginx/nginx.conf`](nginx/nginx.conf).

---

## Docker Compose (PostgreSQL + nginx + сборка фронта)

Из **корня репозитория**:

1. Скопируйте [`.env.example`](.env.example) в **`.env`** и задайте как минимум `GHCR_OWNER`, прод-значения **`VITE_API_URL`** и **`VITE_CDN_URL`** (см. [`DEPLOY.md`](DEPLOY.md)). Файл **`.env`** не коммитится (см. `.gitignore`); сервисы в `docker-compose.yml` подключают именно его.
2. Запуск:

```bash
docker compose up -d --build
```

Для только **pull** готовых образов с GHCR: `docker compose pull && docker compose up -d` (на ВМ после логина в `ghcr.io`).

Локально:

- приложение: [http://localhost](http://localhost) (нужен свободный порт **80** на машине, иначе смените проброс в `docker-compose.yml`, например `8080:80`);
- pgAdmin: [http://localhost:8080](http://localhost:8080).

Схема и тестовые данные PostgreSQL поднимаются из SQL в [`backend/test/`](backend/test/) при **первом** создании volume.

В Compose у бэкенда задано **`DATABASE_DRIVER=postgres`** (режим контейнера `database`).

---

## Локальная разработка без Docker

### MongoDB

Импорт [`backend/test/mongodb_initial_stub.json`](backend/test/mongodb_initial_stub.json), в `backend/.env`: `DATABASE_DRIVER=mongodb`, `DATABASE_URL`.

### Бэкенд

```bash
cd backend
npm ci
cp .env.example .env
npm run start:debug
```

### Логирование

**`LOGGER_TYPE`** или **`LOGGER_FORMAT`:** `console` | `json` | `tskv` — см. [`backend/src/logger/`](backend/src/logger/).

---

## Тесты и линт (backend)

```bash
cd backend
npm run lint
npm test
```

---

## Публикация образов в GHCR

[`.github/workflows/docker-images.yml`](.github/workflows/docker-images.yml) — при push в **`main`** и **`review-2`**:

- `ghcr.io/<владелец_репо_в_нижнем_регистре>/film-react-nest-backend`
- `.../film-react-nest-frontend-builder`
- `.../film-react-nest-nginx`

Подробности выкладки на ВМ — в [`DEPLOY.md`](DEPLOY.md).
