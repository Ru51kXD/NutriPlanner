# Backend сервер для NutriPlanner

## Установка и запуск

### 1. Установите зависимости

```bash
cd backend
npm install
```

### 2. Настройте переменные окружения

Скопируйте `.env.example` в `.env`:

```bash
copy .env.example .env  # Windows
# или
cp .env.example .env    # Linux/Mac
```

Откройте `.env` и укажите параметры подключения к PostgreSQL:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nutriplanner
DB_USER=postgres
DB_PASSWORD=ваш_пароль_здесь
PORT=5000
```

### 3. Убедитесь, что PostgreSQL запущен и база данных создана

Следуйте инструкциям в `database/README.md` для настройки PostgreSQL.

### 4. Запустите сервер

```bash
# Обычный запуск
npm start

# С автоперезагрузкой (для разработки)
npm run dev
```

Сервер будет доступен по адресу: `http://localhost:5000`

## API Endpoints

### Пользователи
- `GET /api/users` - Получить всех пользователей
- `GET /api/users/:id` - Получить пользователя по ID
- `POST /api/users` - Создать пользователя
- `PUT /api/users/:id` - Обновить пользователя

### Рецепты
- `GET /api/recipes` - Получить все рецепты
- `GET /api/recipes/:id` - Получить рецепт по ID

### Планы питания
- `GET /api/plans` - Получить все планы
- `GET /api/plans/user/:userId` - Получить планы пользователя
- `POST /api/plans` - Создать план питания

### Заболевания
- `GET /api/diseases` - Получить все заболевания

### Здоровье
- `GET /api/health` - Проверка подключения к БД

## Примеры запросов

### Создание пользователя
```bash
POST http://localhost:5000/api/users
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "123456",
  "name": "Тестовый Пользователь",
  "age": 30,
  "weight": 70,
  "height": 175,
  "disease": "diabetes",
  "goal": "weight_loss",
  "avatar_url": "https://i.pravatar.cc/150?img=1"
}
```

### Получение рецептов
```bash
GET http://localhost:5000/api/recipes
```

## Устранение проблем

### Ошибка подключения к БД
- Убедитесь, что PostgreSQL запущен
- Проверьте параметры подключения в `.env`
- Убедитесь, что база данных `nutriplanner` создана

### Порт занят
- Измените `PORT` в `.env` на другой порт (например, 5001)






