-- Схема базы данных PostgreSQL для NutriPlanner
-- Создание базы данных и таблиц

-- Создание базы данных (выполнить отдельно)
-- CREATE DATABASE nutriplanner;

-- Подключение к базе данных
-- \c nutriplanner;

-- Расширения
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    age INTEGER,
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    disease VARCHAR(100),
    goal VARCHAR(50), -- 'weight_loss', 'weight_gain', 'maintain'
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица заболеваний
CREATE TABLE IF NOT EXISTS diseases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    value VARCHAR(100) UNIQUE NOT NULL,
    label VARCHAR(255) NOT NULL,
    description TEXT,
    bzu JSONB, -- {protein, fat, carbs}
    calories INTEGER,
    restrictions TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица рецептов
CREATE TABLE IF NOT EXISTS recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    ingredients TEXT[] NOT NULL,
    instructions TEXT[] NOT NULL,
    image_url VARCHAR(500),
    calories INTEGER,
    protein DECIMAL(5,2),
    fat DECIMAL(5,2),
    carbs DECIMAL(5,2),
    cooking_time INTEGER, -- в минутах
    servings INTEGER,
    difficulty VARCHAR(20), -- 'easy', 'medium', 'hard'
    tags TEXT[], -- ['vegetarian', 'gluten-free', etc.]
    suitable_for_diseases TEXT[], -- массив значений заболеваний
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица планов питания
CREATE TABLE IF NOT EXISTS diet_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    disease VARCHAR(100),
    goal VARCHAR(50),
    total_calories INTEGER,
    bzu JSONB, -- {protein, fat, carbs}
    meals JSONB NOT NULL, -- массив приемов пищи с рецептами
    duration_days INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица прогресса пользователя
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    weight DECIMAL(5,2),
    calories_consumed INTEGER,
    calories_burned INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date)
);

-- Индексы для улучшения производительности
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_diet_plans_user_id ON diet_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_date ON user_progress(date);
CREATE INDEX IF NOT EXISTS idx_recipes_tags ON recipes USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_recipes_suitable_for ON recipes USING GIN(suitable_for_diseases);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для автоматического обновления updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_diet_plans_updated_at BEFORE UPDATE ON diet_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();







