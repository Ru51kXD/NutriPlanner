// Утилита для получения URL изображений рецептов и аватаров

// Unsplash изображения для рецептов (бесплатные, без API ключа)
const RECIPE_IMAGES = {
  'омлет': 'https://images.unsplash.com/photo-1615367423057-0276bc66e0f8?w=500&h=400&fit=crop',
  'салат': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop',
  'курица': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&h=400&fit=crop',
  'гречка': 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500&h=400&fit=crop',
  'творог': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=400&fit=crop',
  'суп': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=400&fit=crop',
  'рыба': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=400&fit=crop',
  'паста': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&h=400&fit=crop',
  'капуста': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=400&fit=crop',
  'сырники': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=400&fit=crop',
  'рагу': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=400&fit=crop',
  'овсяная': 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500&h=400&fit=crop',
  'рис': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=400&fit=crop',
  'овощи': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop',
  'каша': 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500&h=400&fit=crop',
  'мясо': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&h=400&fit=crop',
  'грибы': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=400&fit=crop',
  'запеканка': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=400&fit=crop',
  'тушен': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=400&fit=crop',
  'паровой': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=400&fit=crop',
  'default': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop'
};

// Аватары для пользователей
const AVATAR_OPTIONS = [
  'https://i.pravatar.cc/150?img=1',
  'https://i.pravatar.cc/150?img=3',
  'https://i.pravatar.cc/150?img=5',
  'https://i.pravatar.cc/150?img=7',
  'https://i.pravatar.cc/150?img=9',
  'https://i.pravatar.cc/150?img=11',
  'https://i.pravatar.cc/150?img=13',
  'https://i.pravatar.cc/150?img=15',
  'https://i.pravatar.cc/150?img=20',
  'https://i.pravatar.cc/150?img=25',
  'https://i.pravatar.cc/150?img=30',
  'https://i.pravatar.cc/150?img=33'
];

/**
 * Получить изображение для рецепта на основе его названия
 */
export const getRecipeImage = (recipeName) => {
  if (!recipeName) return RECIPE_IMAGES.default;
  
  const nameLower = recipeName.toLowerCase();
  
  // Ищем ключевые слова в названии
  for (const [key, url] of Object.entries(RECIPE_IMAGES)) {
    if (nameLower.includes(key)) {
      return url;
    }
  }
  
  return RECIPE_IMAGES.default;
};

/**
 * Получить список доступных аватаров
 */
export const getAvatarOptions = () => {
  return AVATAR_OPTIONS;
};

/**
 * Получить аватар по индексу или случайный
 */
export const getAvatar = (index = null) => {
  if (index !== null && index >= 0 && index < AVATAR_OPTIONS.length) {
    return AVATAR_OPTIONS[index];
  }
  // Случайный аватар
  return AVATAR_OPTIONS[Math.floor(Math.random() * AVATAR_OPTIONS.length)];
};

/**
 * Получить изображение для главной страницы
 */
export const getHeroImage = () => {
  return 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&h=600&fit=crop';
};






