// API сервис для работы с backend (PostgreSQL)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Вспомогательная функция для обработки ответов
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Ошибка сервера' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export const api = {
  // ========== Пользователи ==========
  async getUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Ошибка получения пользователей:', error);
      throw error;
    }
  },

  async getUser(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Ошибка получения пользователя:', error);
      throw error;
    }
  },

  async createUser(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Ошибка создания пользователя:', error);
      throw error;
    }
  },

  async updateUser(id, userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Ошибка обновления пользователя:', error);
      throw error;
    }
  },

  // ========== Рецепты ==========
  async getRecipes() {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Ошибка получения рецептов:', error);
      throw error;
    }
  },

  async getRecipe(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/${id}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Ошибка получения рецепта:', error);
      throw error;
    }
  },

  // ========== Планы питания ==========
  async getPlans() {
    try {
      const response = await fetch(`${API_BASE_URL}/plans`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Ошибка получения планов:', error);
      throw error;
    }
  },

  async getUserPlans(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/plans/user/${userId}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Ошибка получения планов пользователя:', error);
      throw error;
    }
  },

  async createPlan(planData) {
    try {
      const response = await fetch(`${API_BASE_URL}/plans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planData)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Ошибка создания плана:', error);
      throw error;
    }
  },

  async updatePlan(planId, planData) {
    try {
      const response = await fetch(`${API_BASE_URL}/plans/${planId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planData)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Ошибка обновления плана:', error);
      throw error;
    }
  },

  async deletePlan(planId) {
    try {
      const response = await fetch(`${API_BASE_URL}/plans/${planId}`, {
        method: 'DELETE'
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Ошибка удаления плана:', error);
      throw error;
    }
  },

  // ========== Заболевания ==========
  async getDiseases() {
    try {
      const response = await fetch(`${API_BASE_URL}/diseases`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Ошибка получения заболеваний:', error);
      throw error;
    }
  },

  // ========== Проверка здоровья API ==========
  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await handleResponse(response);
    } catch (error) {
      console.error('API недоступен:', error);
      return { status: 'error', database: 'disconnected' };
    }
  }
};






