// Единая цветовая палитра приложения
// 4 основных цвета + нейтральные для текста

export const colors = {
  // Основные цвета (3-4 цвета)
  primary: {
    main: '#10B981',      // Зеленый - основной
    light: '#34D399',
    dark: '#059669',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
  },
  secondary: {
    main: '#3B82F6',      // Синий - вторичный
    light: '#60A5FA',
    dark: '#2563EB',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
  },
  accent: {
    main: '#667eea',       // Фиолетовый - акцент
    light: '#818cf8',
    dark: '#4f46e5',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  warning: {
    main: '#F59E0B',       // Оранжевый - предупреждения
    light: '#FBBF24',
    dark: '#D97706',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
  },
  
  // Нейтральные цвета для текста
  text: {
    primary: '#1F2937',   // Темный текст на светлом фоне
    secondary: '#6B7280',  // Вторичный текст
    light: '#9CA3AF',      // Светлый текст
    white: '#FFFFFF',      // Белый текст на темном фоне
    dark: '#111827'        // Очень темный текст
  },
  
  // Фоны
  background: {
    light: '#F9FAFB',
    white: '#FFFFFF',
    dark: '#1F2937',
    overlay: 'rgba(255, 255, 255, 0.85)',
    overlayDark: 'rgba(31, 41, 55, 0.85)'
  },
  
  // Границы
  border: {
    light: 'rgba(255, 255, 255, 0.4)',
    medium: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(0, 0, 0, 0.2)'
  }
};

// Функция для получения цвета текста в зависимости от фона
export const getTextColor = (isDark = false) => {
  return isDark ? colors.text.white : colors.text.primary;
};

// Функция для получения вторичного цвета текста
export const getSecondaryTextColor = (isDark = false) => {
  return isDark ? 'rgba(255, 255, 255, 0.8)' : colors.text.secondary;
};







