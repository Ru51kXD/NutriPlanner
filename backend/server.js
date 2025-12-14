const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'nutriplanner',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

// Проверка подключения
pool.on('connect', () => {
  console.log('✅ Подключение к PostgreSQL установлено');
});

pool.on('error', (err) => {
  console.error('❌ Ошибка подключения к PostgreSQL:', err);
});

// ========== API Роуты ==========

// Получить всех пользователей
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, name, age, weight, height, disease, goal, avatar_url, created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка получения пользователей:', error);
    res.status(500).json({ error: 'Ошибка получения пользователей' });
  }
});

// Получить пользователя по ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT id, email, name, age, weight, height, disease, goal, avatar_url, created_at FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка получения пользователя:', error);
    res.status(500).json({ error: 'Ошибка получения пользователя' });
  }
});

// Создать пользователя
app.post('/api/users', async (req, res) => {
  try {
    const { email, password, name, age, weight, height, disease, goal, avatar_url } = req.body;
    const result = await pool.query(
      'INSERT INTO users (email, password, name, age, weight, height, disease, goal, avatar_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, email, name, age, weight, height, disease, goal, avatar_url, created_at',
      [email, password, name, age, weight, height, disease, goal, avatar_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка создания пользователя:', error);
    if (error.code === '23505') { // Unique violation
      res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    } else {
      res.status(500).json({ error: 'Ошибка создания пользователя' });
    }
  }
});

// Обновить пользователя
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, age, weight, height, disease, goal, avatar_url } = req.body;
    const result = await pool.query(
      'UPDATE users SET email = $1, name = $2, age = $3, weight = $4, height = $5, disease = $6, goal = $7, avatar_url = $8, updated_at = CURRENT_TIMESTAMP WHERE id = $9 RETURNING id, email, name, age, weight, height, disease, goal, avatar_url, updated_at',
      [email, name, age, weight, height, disease, goal, avatar_url, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка обновления пользователя:', error);
    res.status(500).json({ error: 'Ошибка обновления пользователя' });
  }
});

// Получить все рецепты
app.get('/api/recipes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM recipes ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка получения рецептов:', error);
    res.status(500).json({ error: 'Ошибка получения рецептов' });
  }
});

// Получить рецепт по ID
app.get('/api/recipes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM recipes WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Рецепт не найден' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка получения рецепта:', error);
    res.status(500).json({ error: 'Ошибка получения рецепта' });
  }
});

// Получить все планы питания
app.get('/api/plans', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM diet_plans ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка получения планов:', error);
    res.status(500).json({ error: 'Ошибка получения планов' });
  }
});

// Получить планы пользователя
app.get('/api/plans/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query('SELECT * FROM diet_plans WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка получения планов пользователя:', error);
    res.status(500).json({ error: 'Ошибка получения планов пользователя' });
  }
});

// Создать план питания
app.post('/api/plans', async (req, res) => {
  try {
    const { user_id, name, disease, goal, total_calories, bzu, meals, duration_days } = req.body;
    const result = await pool.query(
      'INSERT INTO diet_plans (user_id, name, disease, goal, total_calories, bzu, meals, duration_days) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [user_id, name, disease, goal, total_calories, JSON.stringify(bzu), JSON.stringify(meals), duration_days]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка создания плана:', error);
    res.status(500).json({ error: 'Ошибка создания плана' });
  }
});

// Получить все заболевания
app.get('/api/diseases', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM diseases ORDER BY label');
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка получения заболеваний:', error);
    res.status(500).json({ error: 'Ошибка получения заболеваний' });
  }
});

// Проверка здоровья сервера
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected', error: error.message });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📡 API доступен по адресу: http://localhost:${PORT}/api`);
});






