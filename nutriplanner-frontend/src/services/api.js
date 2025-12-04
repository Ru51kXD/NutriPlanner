import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // твой backend

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===== INTERCEPTORS =====
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('isAuthenticated');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

//
// ======= 🔐 АВТОРИЗАЦИЯ (если AuthController нет — локально) =======
//
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await api.post('/users/login', credentials);
      return response;
    } catch (err) {
      console.warn('Используется локальная заглушка login');
      return Promise.resolve({ data: { token: 'demo-token', message: 'Login successful' } });
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/users/register', userData);
      return response;
    } catch (err) {
      console.warn('Используется локальная заглушка register');
      return Promise.resolve({ data: { message: 'User registered successfully' } });
    }
  },

  logout: () => Promise.resolve({ data: { message: 'Logged out' } }),
};

//
// ======= 🧑‍🤝‍🧑 ПОЛЬЗОВАТЕЛИ =======
//
export const userAPI = {
  getAll: () => api.get('/users'),
  delete: (id) => api.delete(`/users/${id}`),

  // Профиль
  getProfile: () => api.get('/users').then(res => ({ data: res.data[0] || {} })),
  updateProfile: (profileData) => api.put('/users/1', profileData),

  // Прогресс (через localStorage)
  getProgress: () => {
    const progressData = JSON.parse(localStorage.getItem('userProgress')) || {};
    return Promise.resolve({ data: progressData });
  },

  updateProgress: (userId, data) => {
    const allProgress = JSON.parse(localStorage.getItem('userProgress')) || {};
    allProgress[userId] = { ...allProgress[userId], ...data };
    localStorage.setItem('userProgress', JSON.stringify(allProgress));
    return Promise.resolve({ data: allProgress[userId] });
  },
};

//
// ======= 🥗 ПИТАНИЕ =======
//
export const dietAPI = {
  getAll: () => api.get('/plans'),
  create: (planData) => api.post('/plans', planData),
  delete: (id) => api.delete(`/plans/${id}`),
};

//
// ======= 🧬 ЗАБОЛЕВАНИЯ =======
//
export const diseaseAPI = {
  getAll: () => api.get('/diseases'),
  create: (diseaseData) => api.post('/diseases', diseaseData),
  delete: (id) => api.delete(`/diseases/${id}`),
};

//
// ======= 📈 ПРОГРЕСС (через localStorage) =======
//
export const progressAPI = {
  getAll: () => {
    const data = JSON.parse(localStorage.getItem('userProgress')) || {};
    return Promise.resolve({ data });
  },

  update: (userId, updatedData) => {
    const all = JSON.parse(localStorage.getItem('userProgress')) || {};
    all[userId] = updatedData;
    localStorage.setItem('userProgress', JSON.stringify(all));
    return Promise.resolve({ data: all[userId] });
  },

  delete: (userId) => {
    const all = JSON.parse(localStorage.getItem('userProgress')) || {};
    delete all[userId];
    localStorage.setItem('userProgress', JSON.stringify(all));
    return Promise.resolve({ data: all });
  },
};

export default api;
