# Cinema KRSK – Fullstack приложение онлайн кинотеатра

Полнофункциональный бэкенд для онлайн кинотеатра, разработанный на **NestJS** с использованием **PostgreSQL**, JWT-аутентификацией, системой ролей и мониторингом производительности.

## 📋 Содержание

- [Особенности](#особенности)
- [Технологический стек](#технологический-стек)
- [Требования](#требования)
- [Установка и запуск](#установка-и-запуск)
- [Окружение](#окружение)
- [API](#api)
- [Роли и доступ](#роли-и-доступ)
- [Мониторинг](#мониторинг)
- [Структура проекта](#структура-проекта)

## ✨ Особенности

- **Аутентификация**: JWT (Access + Refresh токены) через Passport.js
- **Регистрация**: по email с подтверждением кода + через Telegram
- **Роли**: `guest`, `user`, `superuser` с разграничением доступа
- **Безопасность**: хеширование паролей через bcrypt, бан пользователей
- **База данных**: PostgreSQL + TypeORM с автосинхронизацией схемы
- **Email**: отправка кодов подтверждения через Yandex SMTP (Nodemailer)
- **Документация API**: Swagger (`/api/docs`)
- **Мониторинг**: Prometheus + Grafana + Node Exporter + Postgres Exporter
- **Docker**: полная контейнеризация через Docker Compose

## 🛠 Технологический стек

### Backend

- **NestJS** 11.x — фреймворк для Node.js
- **TypeScript** — типизированный язык программирования
- **PostgreSQL** 17 — СУБД
- **TypeORM** — ORM для работы с БД
- **Passport.js** + **JWT** — аутентификация
- **bcrypt** — хеширование паролей
- **Nodemailer** — отправка email
- **Swagger** (`@nestjs/swagger`) — документация API

### Мониторинг

- **Prometheus** — сбор метрик
- **Grafana** — визуализация метрик
- **Node Exporter** — метрики сервера (CPU, RAM, диск)
- **Postgres Exporter** — метрики БД
- **prom-client** — метрики NestJS приложения (HTTP latency, heap, GC)

### Разработка

- **ESLint** + **Prettier** — линтинг и форматирование
- **Jest** — тестирование
- **Docker & Docker Compose** — контейнеризация

## 📋 Требования

- **Docker** и **Docker Compose**
- **Node.js** 22+ (для локальной разработки без Docker)

## 🚀 Установка и запуск

### С использованием Docker (рекомендуется)

```bash
git clone <repository-url>
cd cinema

# Создать .env файл (см. раздел Окружение)
cp .env.example .env

# Запуск всех сервисов
docker compose up -d
```

Сервисы будут доступны по адресам:

| Сервис               | Адрес                                           |
| -------------------- | ----------------------------------------------- |
| Backend API          | `http://localhost:3001`                         |
| Swagger документация | `http://localhost:3001/api/docs`                |
| Grafana              | `http://localhost:6000` (или по `GRAFANA_PORT`) |
| Prometheus           | `http://localhost:9090`                         |
| pgAdmin              | `http://localhost:5050`                         |

### Локальная разработка

```bash
cd backend
npm install

# Запуск только инфраструктуры
docker compose up -d db pgadmin prometheus grafana postgres_exporter node_exporter

# Запуск приложения
npm run start:dev
```

### Команды

```bash
npm run start:dev      # режим разработки с hot reload
npm run start:debug    # режим отладки
npm run build          # сборка
npm run start:prod     # production запуск
npm run lint           # линтинг
npm run test           # тесты
npm run test:cov       # тесты с покрытием
```

## ⚙️ Окружение

Файл `.env` должен находиться в корне проекта (`/cinema/.env`):

```env
# База данных
DB_HOST=db
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=cinema

# Приложение
PORT=3001

# JWT
JWT_ACCESS_SECRET=your_secret_min_32_chars

# Email (Yandex SMTP)
MAIL_FROM=your_email@yandex.ru
YANDEX_APP_PASSWORD=your_app_password

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token

# Мониторинг
GRAFANA_PORT=6000
GRAFANA_USERNAME=admin
GRAFANA_PASSWORD=your_grafana_password
PROMETHEUS_PORT=9090

# pgAdmin
PGADMIN_EMAIL=admin@example.com
PGADMIN_PASSWORD=your_pgadmin_password
PGADMIN_PORT=5050
```

> ⚠️ Не коммитьте `.env` с реальными данными. Используйте `.env.example` как шаблон.

> ⚠️ `GRAFANA_PORT=6000` не работает в Chrome (зарезервированный порт). Используйте другой порт, например `3002`, или открывайте в Firefox.

## 📡 API

Полная документация доступна через Swagger: `http://localhost:3001/api/docs`

### Аутентификация (`/auth`)

| Метод | Эндпоинт                 | Описание                             | Доступ |
| ----- | ------------------------ | ------------------------------------ | ------ |
| POST  | `/auth/register`         | Регистрация по email                 | Все    |
| POST  | `/auth/verify-email`     | Подтверждение email кодом            | Все    |
| POST  | `/auth/login`            | Вход по email + пароль               | Все    |
| POST  | `/auth/refresh`          | Обновление access токена             | Все    |
| POST  | `/auth/logout`           | Выход (отзыв refresh токена)         | Все    |
| POST  | `/auth/complete-profile` | Заполнение профиля после регистрации | USER+  |
| POST  | `/auth/telegram`         | Авторизация через Telegram           | Все    |

### Пользователи (`/users`)

| Метод  | Эндпоинт     | Описание                  | Доступ    |
| ------ | ------------ | ------------------------- | --------- |
| GET    | `/users/me`  | Свой профиль              | USER+     |
| PATCH  | `/users/me`  | Обновить свой профиль     | USER+     |
| GET    | `/users`     | Список всех пользователей | SUPERUSER |
| GET    | `/users/:id` | Профиль по ID             | SUPERUSER |
| POST   | `/users`     | Создать пользователя      | SUPERUSER |
| PATCH  | `/users/:id` | Обновить пользователя     | SUPERUSER |
| DELETE | `/users/:id` | Удалить пользователя      | SUPERUSER |

### Жанры (`/genres`)

| Метод  | Эндпоинт      | Описание           | Доступ    |
| ------ | ------------- | ------------------ | --------- |
| GET    | `/genres`     | Список всех жанров | Все       |
| GET    | `/genres/:id` | Жанр по ID         | Все       |
| POST   | `/genres`     | Создать жанр       | SUPERUSER |
| PATCH  | `/genres/:id` | Обновить жанр      | SUPERUSER |
| DELETE | `/genres/:id` | Удалить жанр       | SUPERUSER |

### Передача токена

```bash
# В заголовке запроса
Authorization: Bearer <accessToken>
```

## 🔐 Роли и доступ

| Роль        | Описание                                                                            |
| ----------- | ----------------------------------------------------------------------------------- |
| `guest`     | Неавторизованный пользователь — доступ только к публичным эндпоинтам                |
| `user`      | Авторизованный пользователь — полный доступ к контенту, управление своим профилем   |
| `superuser` | Администратор — все возможности user + управление пользователями, контентом, банами |

Роль по умолчанию при регистрации — `user`. Изменить роль может только `superuser`.

## 📊 Мониторинг

### Grafana

- **URL**: `http://localhost:6000` (порт задаётся через `GRAFANA_PORT`)
- Логин/пароль из `.env` (`GRAFANA_USERNAME` / `GRAFANA_PASSWORD`)

**Дашборды** — импортировать в Grafana → Dashboards → Import по ID:

| Дашборд                    | ID                                 |
| -------------------------- | ---------------------------------- |
| PostgreSQL                 | `9628`                             |
| Node (сервер)              | `1860`                             |
| Cinema Backend (кастомный) | загрузить `grafana-dashboard.json` |

### Prometheus

- **URL**: `http://localhost:9090`
- Собирает метрики с backend (`/metrics`), postgres_exporter, node_exporter

### pgAdmin

- **URL**: `http://localhost:5050`
- Email/пароль из `.env` (`PGADMIN_EMAIL` / `PGADMIN_PASSWORD`)

## 👨‍💻 Структура проекта

```
cinema/
├── docker-compose.yml
├── .env
├── monitoring/
│   ├── prometheus.yml
│   └── grafana/
│       └── provisioning/
│           └── datasources/
│               └── prometheus.yml
└── backend/
    ├── Dockerfile
    ├── package.json
    ├── tsconfig.json
    ├── nest-cli.json
    ├── eslint.config.mjs
    ├── .prettierrc
    └── src/
        ├── main.ts
        ├── app.module.ts
        ├── auth/
        │   ├── decorators/        # @CurrentUser, @Roles
        │   ├── dto/               # RegisterDto, LoginDto, ...
        │   ├── entities/          # RefreshToken
        │   ├── enums/             # Role
        │   ├── guards/            # JwtAuthGuard, RolesGuard
        │   ├── strategies/        # JwtStrategy
        │   ├── auth.controller.ts
        │   ├── auth.service.ts
        │   └── auth.module.ts
        ├── users/
        │   ├── dto/               # CreateUserDto, UpdateUserDto
        │   ├── entities/          # User
        │   ├── users.controller.ts
        │   ├── users.service.ts
        │   └── users.module.ts
        ├── genres/
        │   ├── dto/               # CreateGenreDto, UpdateGenreDto
        │   ├── entities/          # Genre
        │   ├── genres.controller.ts
        │   ├── genres.service.ts
        │   └── genres.module.ts
        ├── movies/
        │   └── entities/          # Movie
        ├── mail/
        │   ├── mail.service.ts
        │   └── mail.module.ts
        └── common/
            └── interceptors/
                └── http-metrics.interceptor.ts
```

## 🐛 Отладка

```bash
# Логи всех сервисов
docker compose logs -f

# Логи конкретного сервиса
docker compose logs -f backend
docker compose logs -f db

# Статус контейнеров
docker compose ps

# Пересборка бэкенда
docker compose up --build backend
```

## 📝 Лицензия

```
UNLICENSED
```
