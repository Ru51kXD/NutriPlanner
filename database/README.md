# Инструкция по настройке PostgreSQL для NutriPlanner

## Шаг 1: Установка PostgreSQL

Если PostgreSQL еще не установлен:

### Windows:
1. Скачайте установщик с официального сайта: https://www.postgresql.org/download/windows/
2. Запустите установщик и следуйте инструкциям
3. Запомните пароль для пользователя `postgres` (будет нужен позже)

### Проверка установки:
Откройте командную строку (PowerShell) и выполните:
```bash
psql --version
```

## Шаг 2: Запуск PostgreSQL

### Windows (через службы):
1. Откройте "Службы" (Services) через поиск Windows
2. Найдите "postgresql-x64-XX" (где XX - версия)
3. Убедитесь, что служба запущена (Status = Running)
4. Если не запущена - нажмите "Start"

### Или через командную строку:
```bash
# Запуск службы PostgreSQL
net start postgresql-x64-15  # замените 15 на вашу версию
```

## Шаг 3: Подключение к PostgreSQL

### Вариант 1: Через командную строку (psql)
```bash
# Подключение к PostgreSQL
psql -U postgres

# Введите пароль, который вы установили при установке
```

### Вариант 2: Через pgAdmin (графический интерфейс)
1. Откройте pgAdmin (должен быть установлен вместе с PostgreSQL)
2. Подключитесь к серверу (пароль от пользователя postgres)

## Шаг 4: Создание базы данных

В командной строке psql выполните:

```sql
-- Создание базы данных
CREATE DATABASE nutriplanner;

-- Подключение к базе данных
\c nutriplanner;
```

## Шаг 5: Создание таблиц

Выполните SQL-скрипт для создания таблиц:

```bash
# В командной строке (из папки проекта)
psql -U postgres -d nutriplanner -f database/schema.sql
```

Или в psql:
```sql
\i database/schema.sql
```

## Шаг 6: Заполнение начальными данными

```bash
# В командной строке
psql -U postgres -d nutriplanner -f database/seed.sql
```

Или в psql:
```sql
\i database/seed.sql
```

## Шаг 7: Проверка подключения

```sql
-- Проверка таблиц
\dt

-- Проверка данных
SELECT COUNT(*) FROM recipes;
SELECT COUNT(*) FROM diseases;
```

## Параметры подключения для приложения

После настройки базы данных используйте следующие параметры:

```javascript
{
  host: 'localhost',
  port: 5432,
  database: 'nutriplanner',
  user: 'postgres',
  password: 'ваш_пароль', // пароль, установленный при установке
}
```

## Устранение проблем

### Ошибка "psql: command not found"
- Добавьте PostgreSQL в PATH:
  - `C:\Program Files\PostgreSQL\15\bin` (замените 15 на вашу версию)

### Ошибка подключения "password authentication failed"
- Проверьте правильность пароля
- Или сбросьте пароль через pgAdmin

### Ошибка "database does not exist"
- Убедитесь, что вы создали базу данных: `CREATE DATABASE nutriplanner;`

### Порт занят
- По умолчанию PostgreSQL использует порт 5432
- Проверьте, не занят ли он другим приложением

## Полезные команды

```sql
-- Просмотр всех баз данных
\l

-- Просмотр всех таблиц
\dt

-- Просмотр структуры таблицы
\d recipes

-- Выход из psql
\q
```






