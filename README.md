# Cinema KRSK – Fullstack приложения для управления кинотеатром

Полнофункциональный бэкенд-сервис для управления кинотеатром, разработанный на **NestJS** с использованием **PostgreSQL**, аутентификацией через JWT и мониторингом производительности.

## 📋 Содержание

- [Особенности](#особенности)
- [Технологический стек](#технологический-стек)
- [Требования](#требования)
- [Установка](#установка)
- [Запуск](#запуск)
- [Окружение](#окружение)
- [API](#api)
- [Мониторинг](#мониторинг)
- [Разработка](#разработка)
- [Тестирование](#тестирование)

## ✨ Особенности

- **Аутентификация**: JWT-токены с использованием Passport.js
- **Безопасность**: Хеширование пароля через bcrypt
- **База данных**: PostgreSQL с ORM TypeORM
- **Валидация**: class-validator и class-transformer для валидации DTO
- **Email**: Интеграция с Resend для отправки уведомлений
- **Мониторинг**: Prometheus + Grafana для отслеживания метрик
- **Админ-панель**: pgAdmin для управления БД
- **Docker**: Полная контейнеризация через Docker Compose

## 🛠 Технологический стек

### Backend

- **NestJS** 11.x – фреймворк для Node.js
- **TypeScript** – типизированный язык программирования
- **PostgreSQL** 17 – система управления БД
- **TypeORM** – ORM для работы с БД
- **Passport.js** + **JWT** – аутентификация
- **bcrypt** – хеширование паролей

### Мониторинг и логирование

- **Prometheus** – сбор метрик
- **Grafana** – визуализация метрик
- **Node Exporter** – метрики сервера
- **Postgres Exporter** – метрики БД

### Разработка

- **ESLint** – линтер кода
- **Prettier** – форматирование кода
- **Jest** – фреймворк для тестирования
- **Docker & Docker Compose** – контейнеризация

## 📋 Требования

- **Docker** и **Docker Compose** (версия 1.29+)
- **Node.js** 18+ (для локальной разработки без Docker)
- **npm** или **yarn**

## 🚀 Установка

### Способ 1: С использованием Docker (рекомендуется)

```bash
# Клонирование репозитория
git clone <repository-url>
cd cinema

# Запуск всех сервисов через Docker Compose
docker-compose up -d
```

Сервисы будут запущены на следующих портах:

- Backend: `http://localhost:3001`
- Grafana: `http://localhost:3002`
- Prometheus: `http://localhost:9090`
- pgAdmin: `http://localhost:5050`

### Способ 2: Локальная разработка

```bash
# Установка зависимостей
cd backend
npm install

# Настройка переменных окружения
cp .env.example .env

# Запуск базы данных через Docker
docker-compose up -d db pgadmin postgres_exporter node_exporter prometheus grafana

# Запуск приложения
npm run start:dev
```

## ⚙️ Запуск

### Начало работы

```bash
# Развертывание всех сервисов
docker-compose up -d

# Просмотр логов приложения
docker-compose logs -f backend

# Остановка сервисов
docker-compose down
```

### Команды разработки

```bash
# Запуск в режиме разработки (с hot reload)
npm run start:dev

# Запуск в режиме отладки
npm run start:debug

# Сборка для production
npm run build

# Запуск production версии
npm run start:prod
```

## 🔐 Окружение

Файл `.env` содержит следующие переменные:

```env
# База данных
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=cinema

# Приложение
PORT=3001

# Мониторинг
GRAFANA_PORT=3002
GRAFANA_USERNAME=admin
GRAFANA_PASSWORD=your_grafana_password
PROMETHEUS_PORT=9090

# Admin panel
PGADMIN_EMAIL=admin@example.com
PGADMIN_PASSWORD=your_pgadmin_password
PGADMIN_PORT=5050

# Интеграции
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
RESEND_API_KEY=your_resend_api_key
MAIL_FROM=noreply@example.com
```

> ⚠️ **Важно**: Не коммитьте `.env` файл с реальными credentials в git. Используйте `.env.example`. Все чувствительные данные должны устанавливаться локально или через переменные окружения в CI/CD.

## 📡 API

API доступен по адресу `http://localhost:3001`

### Основные модули

- **Auth** (`/auth`) – аутентификация и авторизация
- **Users** (`/users`) – управление пользователями
- **Mail** (`/mail`) – отправка уведомлений

### Примеры запросов

```bash
# Регистрация
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Логин
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Получение данных пользователя (требует JWT токен)
curl -X GET http://localhost:3001/users/profile \
  -H "Authorization: Bearer <token>"
```

Полная документация API будет доступна через Swagger.

## 🎨 Frontend

Frontend приложение (в разработке) будет расположено в директории `/frontend` и создано с использованием современного фреймворка (NextJs).

### Планируемые возможности Frontend

### Структура Frontend

Frontend будет взаимодействовать с Backend API через REST запросы.

## 📊 Мониторинг

### Grafana

- **URL**: `http://localhost:3002`
- **Login**: `zabor`
- **Password**: `zabor21n!@`

В Grafana можно просматривать:

- Метрики приложения (CPU, память, запросы)
- Метрики PostgreSQL (размер БД, количество соединений)
- Метрики сервера

### Prometheus

- **URL**: `http://localhost:9090`

Можно запросить метрики напрямую через PromQL.

### pgAdmin

- **URL**: `http://localhost:5050`
- **Email**: `admin@cinema.com`
- **Password**: `zabor21n!@`

Управление БД, выполнение SQL-запросов, просмотр схемы.

## 👨‍💻 Разработка

### Структура проекта

```
cinema/
├── backend/               # Backend приложение (NestJS)
│   ├── src/
│   │   ├── auth/          # Модуль аутентификации
│   │   ├── users/         # Модуль управления пользователями
│   │   ├── mail/          # Модуль отправки email
│   │   ├── common/        # Общие утилиты и guards
│   │   ├── app.module.ts  # Главный модуль приложения
│   │   └── main.ts        # Точка входа
│   ├── test/              # E2E тесты
│   ├── package.json
│   └── Dockerfile
├── frontend/              # Frontend приложение (React/Vue/Angular)
│   ├── src/               # Исходный код
│   ├── public/            # Статические файлы
│   └── package.json
├── monitoring/            # Конфигурация мониторинга
│   ├── prometheus.yml     # Конфигурация Prometheus
│   └── grafana/           # Графики и дашборды Grafana
├── docker-compose.yml     # Оркестрация контейнеров
└── README.md              # Данный файл
```

## 🐛 Отладка

### Просмотр логов Docker контейнеров

```bash
# Логи всех сервисов
docker-compose logs -f

# Логи конкретного сервиса
docker-compose logs -f backend
docker-compose logs -f db
```

## 📦 Production Deploy

```bash
# Сборка и запуск контейнера
docker-compose up --build -d

## 📝 Лицензия

UNLICENSED
```
