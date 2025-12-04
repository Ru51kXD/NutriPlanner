// Утилита для работы с localStorage (аналог AsyncStorage для веба)

class AsyncStorage {
  static async getItem(key) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }

  static async setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
      return false;
    }
  }

  static async removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
      return false;
    }
  }

  static async clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  static async getAllKeys() {
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  }
}

// Специализированные функции для работы с данными приложения
export const StorageService = {
  // Планы питания
  async getPlans() {
    const plans = await AsyncStorage.getItem('dietPlans') || [];
    return plans;
  },

  async savePlan(plan) {
    const plans = await this.getPlans();
    const newPlan = {
      ...plan,
      id: plan.id || Date.now().toString(),
      createdAt: plan.createdAt || new Date().toISOString()
    };
    plans.push(newPlan);
    await AsyncStorage.setItem('dietPlans', plans);
    return newPlan;
  },

  async updatePlan(planId, updatedPlan) {
    const plans = await this.getPlans();
    const index = plans.findIndex(p => p.id === planId);
    if (index !== -1) {
      plans[index] = { ...plans[index], ...updatedPlan };
      await AsyncStorage.setItem('dietPlans', plans);
      return plans[index];
    }
    return null;
  },

  async deletePlan(planId) {
    const plans = await this.getPlans();
    const filtered = plans.filter(p => p.id !== planId);
    await AsyncStorage.setItem('dietPlans', filtered);
    return true;
  },

  // Пользователи
  async getUsers() {
    const users = await AsyncStorage.getItem('users') || [];
    return users;
  },

  async saveUser(user) {
    const users = await this.getUsers();
    const newUser = {
      ...user,
      id: user.id || Date.now().toString(),
      createdAt: user.createdAt || new Date().toISOString()
    };
    users.push(newUser);
    await AsyncStorage.setItem('users', users);
    return newUser;
  },

  async updateUser(userId, updatedUser) {
    const users = await this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedUser };
      await AsyncStorage.setItem('users', users);
      return users[index];
    }
    return null;
  },

  async deleteUser(userId) {
    const users = await this.getUsers();
    const filtered = users.filter(u => u.id !== userId);
    await AsyncStorage.setItem('users', filtered);
    return true;
  },

  // Заболевания
  async getDiseases() {
    const diseases = await AsyncStorage.getItem('diseases') || [];
    return diseases;
  },

  async saveDisease(disease) {
    const diseases = await this.getDiseases();
    const newDisease = {
      ...disease,
      id: disease.id || Date.now().toString()
    };
    diseases.push(newDisease);
    await AsyncStorage.setItem('diseases', diseases);
    return newDisease;
  },

  async updateDisease(diseaseId, updatedDisease) {
    const diseases = await this.getDiseases();
    const index = diseases.findIndex(d => d.id === diseaseId);
    if (index !== -1) {
      diseases[index] = { ...diseases[index], ...updatedDisease };
      await AsyncStorage.setItem('diseases', diseases);
      return diseases[index];
    }
    return null;
  },

  async deleteDisease(diseaseId) {
    const diseases = await this.getDiseases();
    const filtered = diseases.filter(d => d.id !== diseaseId);
    await AsyncStorage.setItem('diseases', filtered);
    return true;
  },

  // Рецепты
  async getRecipes() {
    const recipes = await AsyncStorage.getItem('recipes') || [];
    return recipes;
  },

  async saveRecipe(recipe) {
    const recipes = await this.getRecipes();
    const newRecipe = {
      ...recipe,
      id: recipe.id || Date.now().toString(),
      createdAt: recipe.createdAt || new Date().toISOString()
    };
    recipes.push(newRecipe);
    await AsyncStorage.setItem('recipes', recipes);
    return newRecipe;
  },

  async updateRecipe(recipeId, updatedRecipe) {
    const recipes = await this.getRecipes();
    const index = recipes.findIndex(r => r.id === recipeId);
    if (index !== -1) {
      recipes[index] = { ...recipes[index], ...updatedRecipe };
      await AsyncStorage.setItem('recipes', recipes);
      return recipes[index];
    }
    return null;
  },

  async deleteRecipe(recipeId) {
    const recipes = await this.getRecipes();
    const filtered = recipes.filter(r => r.id !== recipeId);
    await AsyncStorage.setItem('recipes', filtered);
    return true;
  },

  // Инициализация начальных данных
  async initializeDefaultData() {
    // Проверяем, была ли уже инициализация
    const initialized = await AsyncStorage.getItem('appInitialized');
    const existingRecipes = await AsyncStorage.getItem('recipes');
    
    // Если данные уже инициализированы и рецепты есть, не переинициализируем
    if (initialized && existingRecipes && existingRecipes.length > 0) {
      console.log(`✅ Данные уже инициализированы. Рецептов: ${existingRecipes.length}`);
      return; // Данные уже инициализированы
    }
    
    // Если рецептов нет, но флаг установлен - очищаем флаг для переинициализации
    if (initialized && (!existingRecipes || existingRecipes.length === 0)) {
      console.log('⚠️ Флаг инициализации установлен, но рецептов нет. Переинициализация...');
      await AsyncStorage.removeItem('appInitialized');
    }

    // Инициализируем заболевания
    const defaultDiseases = [
      { id: '1', name: 'Гастрит', description: 'Воспаление желудка', calories: 2400, vitamins: 'A, E, B2, B6', protein: 90, fat: 70, carbs: 350 },
      { id: '2', name: 'Сахарный диабет 2 типа', description: 'Нарушение обмена глюкозы', calories: 2000, vitamins: 'хром, магний, витамин D', protein: 100, fat: 80, carbs: 200 },
      { id: '3', name: 'Ожирение', description: 'Избыточный вес', calories: 1700, vitamins: 'D, C, цинк', protein: 120, fat: 60, carbs: 150 },
      { id: '4', name: 'Анемия', description: 'Недостаток железа', calories: 2300, vitamins: 'железо, витамин C', protein: 100, fat: 80, carbs: 300 },
      { id: '5', name: 'Гипертония', description: 'Повышенное давление', calories: 2200, vitamins: 'магний, калий', protein: 90, fat: 65, carbs: 300 },
      { id: '6', name: 'Гипотиреоз', description: 'Недостаточность щитовидной железы', calories: 2100, vitamins: 'йод, селен, цинк', protein: 95, fat: 70, carbs: 280 },
      { id: '7', name: 'Холецистит', description: 'Воспаление желчного пузыря', calories: 2300, vitamins: 'A, E, C', protein: 85, fat: 60, carbs: 320 },
      { id: '8', name: 'Панкреатит', description: 'Воспаление поджелудочной железы', calories: 2200, vitamins: 'A, E, C, B-комплекс', protein: 80, fat: 55, carbs: 300 },
      { id: '9', name: 'Подагра', description: 'Нарушение обмена мочевой кислоты', calories: 2000, vitamins: 'C, фолиевая кислота', protein: 70, fat: 60, carbs: 320 },
      { id: '10', name: 'Остеопороз', description: 'Снижение плотности костей', calories: 2400, vitamins: 'кальций, витамин D', protein: 100, fat: 75, carbs: 300 }
    ];
    await AsyncStorage.setItem('diseases', defaultDiseases);

    // Создаем тестовых пользователей
    const defaultUsers = [
      {
        id: 'user1',
        name: 'Каролина Миллер',
        email: 'miller@mail.ru',
        password: '123456',
        age: 28,
        weight: 65,
        height: 170,
        createdAt: new Date('2024-01-15').toISOString()
      },
      {
        id: 'user2',
        name: 'Дмитрий Тумаев',
        email: 'tumaev@mail.ru',
        password: '123456',
        age: 35,
        weight: 80,
        height: 180,
        createdAt: new Date('2024-02-10').toISOString()
      },
      {
        id: 'user3',
        name: 'Анна Петрова',
        email: 'petrova@mail.ru',
        password: '123456',
        age: 32,
        weight: 70,
        height: 165,
        createdAt: new Date('2024-03-05').toISOString()
      }
    ];
    await AsyncStorage.setItem('users', defaultUsers);

    // Создаем тестовые планы питания
    const defaultPlans = [
      {
        id: 'plan1',
        name: 'План для Каролина Миллер (🥣 Гастрит (повышенная кислотность))',
        duration: 'week',
        disease: 'gastritis',
        totalCalories: 2400,
        bzu: { protein: 90, fat: 70, carbs: 350 },
        recommendations: 'Цель: снизить раздражение слизистой, нормализовать секрецию',
        vitamins: 'A, E, B2, B6 (восстанавливают слизистую желудка)',
        createdAt: new Date('2024-11-20').toISOString(),
        dailyMeals: [
          {
            day: 'Понедельник',
            meals: [
              { type: 'Завтрак', name: 'Овсяная каша на воде с молоком', description: 'яйцо всмятку, слабый чай', calories: 400, protein: 18, fat: 12, carbs: 60 },
              { type: 'Перекус', name: 'Банан', description: 'тёплое молоко', calories: 200, protein: 8, fat: 5, carbs: 30 },
              { type: 'Обед', name: 'Суп-пюре из картофеля и моркови', description: 'паровые котлеты, рис, компот', calories: 600, protein: 25, fat: 20, carbs: 80 },
              { type: 'Ужин', name: 'Манная каша', description: 'творог 5%, ромашковый чай', calories: 400, protein: 20, fat: 10, carbs: 55 }
            ]
          },
          {
            day: 'Вторник',
            meals: [
              { type: 'Завтрак', name: 'Гречневая каша с маслом', description: 'омлет, травяной чай', calories: 420, protein: 20, fat: 14, carbs: 58 },
              { type: 'Перекус', name: 'Яблоко', description: 'кефир 1%', calories: 180, protein: 7, fat: 4, carbs: 28 },
              { type: 'Обед', name: 'Овощной суп', description: 'рыба на пару, гречка, салат', calories: 580, protein: 28, fat: 18, carbs: 75 },
              { type: 'Ужин', name: 'Запечённая рыба', description: 'тушёные овощи, чай', calories: 420, protein: 32, fat: 12, carbs: 45 }
            ]
          }
        ]
      },
      {
        id: 'plan2',
        name: 'План для Дмитрий Тумаев (🍎 Сахарный диабет 2 типа)',
        duration: 'month',
        disease: 'diabetes',
        totalCalories: 2000,
        bzu: { protein: 100, fat: 80, carbs: 200 },
        recommendations: 'Цель: стабилизировать уровень глюкозы, снизить инсулинорезистентность',
        vitamins: 'хром, магний, витамин D, омега-3, B1, B6',
        createdAt: new Date('2024-11-18').toISOString(),
        dailyMeals: [
          {
            day: 'Понедельник',
            meals: [
              { type: 'Завтрак', name: 'Гречка с отварной курицей', description: 'кофе без сахара', calories: 450, protein: 35, fat: 15, carbs: 45 },
              { type: 'Перекус', name: 'Яблоко', description: 'горсть орехов', calories: 200, protein: 5, fat: 12, carbs: 20 },
              { type: 'Обед', name: 'Овощной суп', description: 'рыба на пару, тушёные овощи', calories: 550, protein: 30, fat: 20, carbs: 50 },
              { type: 'Ужин', name: 'Творог с корицей', description: 'отрубной хлебец', calories: 300, protein: 25, fat: 10, carbs: 25 }
            ]
          }
        ]
      },
      {
        id: 'plan3',
        name: 'План для Анна Петрова (⚖️ Ожирение)',
        duration: 'half-year',
        disease: 'obesity',
        totalCalories: 1700,
        bzu: { protein: 120, fat: 60, carbs: 150 },
        recommendations: 'Цель: снижение калорийности и аппетита, сохранение мышц',
        vitamins: 'D, C, цинк, L-карнитин, комплекс B-группы',
        createdAt: new Date('2024-11-15').toISOString(),
        dailyMeals: [
          {
            day: 'Понедельник',
            meals: [
              { type: 'Завтрак', name: 'Омлет из 2 яиц с овощами', description: 'зелёный чай', calories: 350, protein: 25, fat: 20, carbs: 15 },
              { type: 'Перекус', name: 'Кефир 1%', description: 'яблоко', calories: 150, protein: 8, fat: 3, carbs: 20 },
              { type: 'Обед', name: 'Куриная грудка', description: 'гречка, салат с оливковым маслом', calories: 500, protein: 45, fat: 15, carbs: 40 },
              { type: 'Ужин', name: 'Запечённая рыба', description: 'тушёные кабачки', calories: 400, protein: 35, fat: 12, carbs: 25 }
            ]
          }
        ]
      },
      {
        id: 'plan4',
        name: 'План для Каролина Миллер (🩸 Анемия (железодефицитная))',
        duration: 'week',
        disease: 'anemia',
        totalCalories: 2300,
        bzu: { protein: 100, fat: 80, carbs: 300 },
        recommendations: 'Цель: повысить уровень железа и гемоглобина',
        vitamins: 'железо, витамин C, фолиевая кислота, B12',
        createdAt: new Date('2024-11-22').toISOString(),
        dailyMeals: [
          {
            day: 'Понедельник',
            meals: [
              { type: 'Завтрак', name: 'Овсянка с яблоком', description: 'чай с шиповником', calories: 400, protein: 15, fat: 10, carbs: 70 },
              { type: 'Перекус', name: 'Гранатовый сок', description: 'орехи', calories: 250, protein: 8, fat: 15, carbs: 25 },
              { type: 'Обед', name: 'Гречка с говядиной', description: 'салат из свёклы, чёрный хлеб', calories: 600, protein: 40, fat: 25, carbs: 65 },
              { type: 'Ужин', name: 'Запеканка из творога с изюмом', description: '', calories: 350, protein: 25, fat: 12, carbs: 40 }
            ]
          }
        ]
      },
      {
        id: 'plan5',
        name: 'План для Дмитрий Тумаев (❤️ Гипертония)',
        duration: 'month',
        disease: 'hypertension',
        totalCalories: 2200,
        bzu: { protein: 90, fat: 65, carbs: 300 },
        recommendations: 'Цель: снизить давление, улучшить сосудистый тонус',
        vitamins: 'магний, калий, коэнзим Q10, витамин C, омега-3',
        createdAt: new Date('2024-11-19').toISOString(),
        dailyMeals: [
          {
            day: 'Понедельник',
            meals: [
              { type: 'Завтрак', name: 'Овсянка с бананом', description: 'травяной чай', calories: 400, protein: 15, fat: 10, carbs: 70 },
              { type: 'Перекус', name: 'Йогурт без сахара', description: '', calories: 150, protein: 8, fat: 5, carbs: 15 },
              { type: 'Обед', name: 'Тушёная рыба', description: 'овощное рагу, компот без сахара', calories: 550, protein: 35, fat: 20, carbs: 50 },
              { type: 'Ужин', name: 'Куриное филе', description: 'салат из огурцов, ряженка', calories: 400, protein: 30, fat: 15, carbs: 35 }
            ]
          }
        ]
      }
    ];
    await AsyncStorage.setItem('dietPlans', defaultPlans);

    // Инициализируем рецепты для AI генерации
    const defaultRecipes = [
      {
        id: 'recipe1',
        name: 'Омлет с овощами',
        ingredients: ['яйца', 'помидоры', 'лук', 'перец', 'масло'],
        calories: 320,
        protein: 18,
        fat: 22,
        carbs: 12,
        description: 'Вкусный омлет с свежими овощами'
      },
      {
        id: 'recipe2',
        name: 'Салат из овощей',
        ingredients: ['помидоры', 'огурцы', 'лук', 'масло', 'зелень'],
        calories: 150,
        protein: 3,
        fat: 10,
        carbs: 15,
        description: 'Свежий овощной салат'
      },
      {
        id: 'recipe3',
        name: 'Куриная грудка с рисом',
        ingredients: ['курица', 'рис', 'лук', 'морковь'],
        calories: 450,
        protein: 35,
        fat: 12,
        carbs: 45,
        description: 'Диетическое блюдо с курицей и рисом'
      },
      {
        id: 'recipe4',
        name: 'Гречка с грибами',
        ingredients: ['гречка', 'грибы', 'лук', 'масло'],
        calories: 380,
        protein: 12,
        fat: 15,
        carbs: 55,
        description: 'Сытное блюдо из гречки и грибов'
      },
      {
        id: 'recipe5',
        name: 'Творожная запеканка',
        ingredients: ['творог', 'яйца', 'мука', 'сахар'],
        calories: 280,
        protein: 20,
        fat: 10,
        carbs: 25,
        description: 'Нежная творожная запеканка'
      },
      {
        id: 'recipe6',
        name: 'Овощной суп',
        ingredients: ['картофель', 'морковь', 'лук', 'капуста', 'помидоры'],
        calories: 200,
        protein: 5,
        fat: 5,
        carbs: 35,
        description: 'Легкий овощной суп'
      },
      {
        id: 'recipe7',
        name: 'Рыба на пару с овощами',
        ingredients: ['рыба', 'брокколи', 'морковь', 'кабачок'],
        calories: 250,
        protein: 28,
        fat: 8,
        carbs: 15,
        description: 'Полезная рыба с овощами на пару'
      },
      {
        id: 'recipe8',
        name: 'Паста с овощами',
        ingredients: ['макароны', 'помидоры', 'перец', 'лук', 'чеснок'],
        calories: 420,
        protein: 15,
        fat: 12,
        carbs: 65,
        description: 'Итальянская паста с овощами'
      },
      {
        id: 'recipe9',
        name: 'Тушеная капуста с мясом',
        ingredients: ['капуста', 'мясо', 'морковь', 'лук', 'томаты'],
        calories: 380,
        protein: 25,
        fat: 18,
        carbs: 28,
        description: 'Сытное блюдо из капусты и мяса'
      },
      {
        id: 'recipe10',
        name: 'Сырники',
        ingredients: ['творог', 'яйца', 'мука', 'сахар'],
        calories: 320,
        protein: 22,
        fat: 12,
        carbs: 30,
        description: 'Классические сырники'
      },
      {
        id: 'recipe11',
        name: 'Овощное рагу',
        ingredients: ['кабачок', 'баклажан', 'помидоры', 'перец', 'лук'],
        calories: 180,
        protein: 5,
        fat: 8,
        carbs: 25,
        description: 'Ароматное овощное рагу'
      },
      {
        id: 'recipe12',
        name: 'Куриный суп',
        ingredients: ['курица', 'картофель', 'морковь', 'лук', 'лапша'],
        calories: 350,
        protein: 22,
        fat: 10,
        carbs: 40,
        description: 'Наваристый куриный суп'
      },
      {
        id: 'recipe13',
        name: 'Борщ',
        ingredients: ['свекла', 'капуста', 'морковь', 'лук', 'мясо', 'помидоры'],
        calories: 280,
        protein: 18,
        fat: 12,
        carbs: 30,
        description: 'Классический борщ с мясом'
      },
      {
        id: 'recipe14',
        name: 'Плов',
        ingredients: ['рис', 'мясо', 'морковь', 'лук', 'чеснок'],
        calories: 520,
        protein: 28,
        fat: 20,
        carbs: 55,
        description: 'Ароматный плов с мясом'
      },
      {
        id: 'recipe15',
        name: 'Картофельное пюре с котлетой',
        ingredients: ['картофель', 'мясо', 'лук', 'яйца', 'молоко'],
        calories: 480,
        protein: 32,
        fat: 22,
        carbs: 38,
        description: 'Домашние котлеты с пюре'
      },
      {
        id: 'recipe16',
        name: 'Салат Цезарь',
        ingredients: ['курица', 'салат', 'помидоры', 'сыр', 'сухарики'],
        calories: 380,
        protein: 25,
        fat: 18,
        carbs: 28,
        description: 'Классический салат Цезарь'
      },
      {
        id: 'recipe17',
        name: 'Запеченная курица с картофелем',
        ingredients: ['курица', 'картофель', 'лук', 'морковь', 'специи'],
        calories: 450,
        protein: 35,
        fat: 18,
        carbs: 40,
        description: 'Сочная запеченная курица'
      },
      {
        id: 'recipe18',
        name: 'Творожные блины',
        ingredients: ['творог', 'яйца', 'мука', 'молоко', 'сахар'],
        calories: 320,
        protein: 18,
        fat: 12,
        carbs: 35,
        description: 'Нежные творожные блины'
      },
      {
        id: 'recipe19',
        name: 'Греческий салат',
        ingredients: ['помидоры', 'огурцы', 'перец', 'сыр', 'оливки', 'масло'],
        calories: 220,
        protein: 8,
        fat: 15,
        carbs: 12,
        description: 'Свежий греческий салат'
      },
      {
        id: 'recipe20',
        name: 'Рыбный суп',
        ingredients: ['рыба', 'картофель', 'морковь', 'лук', 'помидоры'],
        calories: 280,
        protein: 25,
        fat: 10,
        carbs: 25,
        description: 'Наваристый рыбный суп'
      },
      {
        id: 'recipe21',
        name: 'Каша овсяная с фруктами',
        ingredients: ['овсянка', 'молоко', 'банан', 'яблоко', 'мед'],
        calories: 350,
        protein: 12,
        fat: 8,
        carbs: 60,
        description: 'Полезная овсяная каша с фруктами'
      },
      {
        id: 'recipe22',
        name: 'Жаркое',
        ingredients: ['мясо', 'картофель', 'морковь', 'лук', 'чеснок'],
        calories: 420,
        protein: 30,
        fat: 18,
        carbs: 35,
        description: 'Сытное жаркое с мясом'
      },
      {
        id: 'recipe23',
        name: 'Суп-лапша',
        ingredients: ['курица', 'лапша', 'морковь', 'лук', 'яйца'],
        calories: 320,
        protein: 20,
        fat: 10,
        carbs: 38,
        description: 'Домашний суп с лапшой'
      },
      {
        id: 'recipe24',
        name: 'Оладьи',
        ingredients: ['мука', 'яйца', 'молоко', 'сахар', 'масло'],
        calories: 280,
        protein: 8,
        fat: 12,
        carbs: 38,
        description: 'Пышные оладьи'
      },
      {
        id: 'recipe25',
        name: 'Тушеные овощи с мясом',
        ingredients: ['мясо', 'кабачок', 'баклажан', 'помидоры', 'перец'],
        calories: 380,
        protein: 28,
        fat: 16,
        carbs: 28,
        description: 'Ароматные тушеные овощи с мясом'
      },
      {
        id: 'recipe26',
        name: 'Яичница с помидорами',
        ingredients: ['яйца', 'помидоры', 'лук', 'масло', 'зелень'],
        calories: 280,
        protein: 16,
        fat: 20,
        carbs: 8,
        description: 'Классическая яичница с помидорами'
      },
      {
        id: 'recipe27',
        name: 'Куриные крылышки',
        ingredients: ['курица', 'специи', 'чеснок', 'масло'],
        calories: 320,
        protein: 28,
        fat: 20,
        carbs: 5,
        description: 'Ароматные куриные крылышки'
      },
      {
        id: 'recipe28',
        name: 'Салат Оливье',
        ingredients: ['картофель', 'яйца', 'морковь', 'огурцы', 'мясо', 'майонез'],
        calories: 350,
        protein: 15,
        fat: 22,
        carbs: 25,
        description: 'Классический салат Оливье'
      },
      {
        id: 'recipe29',
        name: 'Голубцы',
        ingredients: ['капуста', 'мясо', 'рис', 'морковь', 'лук', 'томаты'],
        calories: 320,
        protein: 22,
        fat: 14,
        carbs: 28,
        description: 'Домашние голубцы с мясом и рисом'
      },
      {
        id: 'recipe30',
        name: 'Творожные сырники',
        ingredients: ['творог', 'яйца', 'мука', 'сахар', 'масло'],
        calories: 300,
        protein: 20,
        fat: 12,
        carbs: 32,
        description: 'Нежные творожные сырники'
      },
      {
        id: 'recipe31',
        name: 'Рыбные котлеты',
        ingredients: ['рыба', 'лук', 'яйца', 'мука', 'масло'],
        calories: 280,
        protein: 25,
        fat: 15,
        carbs: 18,
        description: 'Сочные рыбные котлеты'
      },
      {
        id: 'recipe32',
        name: 'Мясные фрикадельки',
        ingredients: ['мясо', 'рис', 'лук', 'яйца', 'морковь'],
        calories: 350,
        protein: 28,
        fat: 18,
        carbs: 22,
        description: 'Нежные мясные фрикадельки'
      },
      {
        id: 'recipe33',
        name: 'Овощной салат с сыром',
        ingredients: ['помидоры', 'огурцы', 'сыр', 'масло', 'зелень'],
        calories: 220,
        protein: 12,
        fat: 16,
        carbs: 10,
        description: 'Свежий овощной салат с сыром'
      },
      {
        id: 'recipe34',
        name: 'Куриный шашлык',
        ingredients: ['курица', 'лук', 'специи', 'масло'],
        calories: 280,
        protein: 32,
        fat: 14,
        carbs: 5,
        description: 'Ароматный куриный шашлык'
      },
      {
        id: 'recipe35',
        name: 'Картофель фри',
        ingredients: ['картофель', 'масло', 'специи'],
        calories: 320,
        protein: 4,
        fat: 18,
        carbs: 38,
        description: 'Хрустящий картофель фри'
      },
      {
        id: 'recipe36',
        name: 'Тушеная капуста',
        ingredients: ['капуста', 'морковь', 'лук', 'томаты', 'масло'],
        calories: 120,
        protein: 3,
        fat: 6,
        carbs: 15,
        description: 'Ароматная тушеная капуста'
      },
      {
        id: 'recipe37',
        name: 'Мясной рулет',
        ingredients: ['мясо', 'яйца', 'лук', 'морковь', 'специи'],
        calories: 380,
        protein: 30,
        fat: 22,
        carbs: 12,
        description: 'Сочный мясной рулет'
      },
      {
        id: 'recipe38',
        name: 'Рыбный пирог',
        ingredients: ['рыба', 'мука', 'яйца', 'лук', 'масло'],
        calories: 420,
        protein: 28,
        fat: 20,
        carbs: 35,
        description: 'Вкусный рыбный пирог'
      },
      {
        id: 'recipe39',
        name: 'Куриная лапша',
        ingredients: ['курица', 'лапша', 'морковь', 'лук', 'яйца'],
        calories: 340,
        protein: 22,
        fat: 12,
        carbs: 38,
        description: 'Домашняя куриная лапша'
      },
      {
        id: 'recipe40',
        name: 'Овощной суп-пюре',
        ingredients: ['картофель', 'морковь', 'лук', 'кабачок', 'молоко'],
        calories: 180,
        protein: 6,
        fat: 8,
        carbs: 22,
        description: 'Нежный овощной суп-пюре'
      },
      {
        id: 'recipe41',
        name: 'Куриные наггетсы',
        ingredients: ['курица', 'мука', 'яйца', 'масло', 'специи'],
        calories: 320,
        protein: 28,
        fat: 16,
        carbs: 18,
        description: 'Хрустящие куриные наггетсы'
      },
      {
        id: 'recipe42',
        name: 'Салат с тунцом',
        ingredients: ['рыба', 'яйца', 'огурцы', 'лук', 'майонез'],
        calories: 280,
        protein: 22,
        fat: 18,
        carbs: 8,
        description: 'Сытный салат с тунцом'
      },
      {
        id: 'recipe43',
        name: 'Мясной гуляш',
        ingredients: ['мясо', 'лук', 'морковь', 'томаты', 'мука'],
        calories: 380,
        protein: 32,
        fat: 20,
        carbs: 18,
        description: 'Сытный мясной гуляш'
      },
      {
        id: 'recipe44',
        name: 'Рис с овощами',
        ingredients: ['рис', 'морковь', 'лук', 'перец', 'масло'],
        calories: 280,
        protein: 6,
        fat: 10,
        carbs: 45,
        description: 'Ароматный рис с овощами'
      },
      {
        id: 'recipe45',
        name: 'Запеченная рыба',
        ingredients: ['рыба', 'лимон', 'специи', 'масло', 'лук'],
        calories: 220,
        protein: 28,
        fat: 10,
        carbs: 5,
        description: 'Нежная запеченная рыба'
      },
      {
        id: 'recipe46',
        name: 'Куриные тефтели',
        ingredients: ['курица', 'рис', 'лук', 'яйца', 'морковь'],
        calories: 300,
        protein: 26,
        fat: 12,
        carbs: 25,
        description: 'Нежные куриные тефтели'
      },
      {
        id: 'recipe47',
        name: 'Овощная запеканка',
        ingredients: ['кабачок', 'помидоры', 'сыр', 'яйца', 'лук'],
        calories: 240,
        protein: 14,
        fat: 14,
        carbs: 18,
        description: 'Сочная овощная запеканка'
      },
      {
        id: 'recipe48',
        name: 'Мясной салат',
        ingredients: ['мясо', 'огурцы', 'помидоры', 'лук', 'майонез'],
        calories: 320,
        protein: 24,
        fat: 20,
        carbs: 12,
        description: 'Сытный мясной салат'
      },
      {
        id: 'recipe49',
        name: 'Гречневая каша с мясом',
        ingredients: ['гречка', 'мясо', 'лук', 'морковь', 'масло'],
        calories: 420,
        protein: 30,
        fat: 18,
        carbs: 38,
        description: 'Сытная гречневая каша с мясом'
      },
      {
        id: 'recipe50',
        name: 'Куриный салат',
        ingredients: ['курица', 'огурцы', 'помидоры', 'лук', 'майонез'],
        calories: 280,
        protein: 22,
        fat: 16,
        carbs: 12,
        description: 'Легкий куриный салат'
      },
      {
        id: 'recipe51',
        name: 'Творожная запеканка с ягодами',
        ingredients: ['творог', 'яйца', 'мука', 'сахар', 'ягоды'],
        calories: 280,
        protein: 18,
        fat: 10,
        carbs: 30,
        description: 'Нежная творожная запеканка с ягодами'
      },
      {
        id: 'recipe52',
        name: 'Рыбный салат',
        ingredients: ['рыба', 'яйца', 'рис', 'морковь', 'майонез'],
        calories: 300,
        protein: 20,
        fat: 18,
        carbs: 20,
        description: 'Сытный рыбный салат'
      },
      {
        id: 'recipe53',
        name: 'Мясные оладьи',
        ingredients: ['мясо', 'лук', 'яйца', 'мука', 'масло'],
        calories: 350,
        protein: 28,
        fat: 20,
        carbs: 18,
        description: 'Сытные мясные оладьи'
      },
      {
        id: 'recipe54',
        name: 'Овощной омлет',
        ingredients: ['яйца', 'кабачок', 'помидоры', 'лук', 'сыр'],
        calories: 300,
        protein: 20,
        fat: 20,
        carbs: 12,
        description: 'Сытный овощной омлет'
      },
      {
        id: 'recipe55',
        name: 'Куриный бульон',
        ingredients: ['курица', 'морковь', 'лук', 'лапша', 'зелень'],
        calories: 180,
        protein: 15,
        fat: 8,
        carbs: 12,
        description: 'Наваристый куриный бульон'
      },
      {
        id: 'recipe56',
        name: 'Сырный суп',
        ingredients: ['сыр', 'картофель', 'морковь', 'лук', 'молоко'],
        calories: 320,
        protein: 18,
        fat: 20,
        carbs: 22,
        description: 'Нежный сырный суп'
      },
      {
        id: 'recipe57',
        name: 'Мясные шарики в томатном соусе',
        ingredients: ['мясо', 'томаты', 'лук', 'яйца', 'мука'],
        calories: 380,
        protein: 30,
        fat: 20,
        carbs: 20,
        description: 'Сочные мясные шарики в томатном соусе'
      },
      {
        id: 'recipe58',
        name: 'Овощной салат с курицей',
        ingredients: ['курица', 'помидоры', 'огурцы', 'лук', 'масло'],
        calories: 280,
        protein: 24,
        fat: 14,
        carbs: 12,
        description: 'Сытный овощной салат с курицей'
      },
      {
        id: 'recipe59',
        name: 'Рыбные тефтели',
        ingredients: ['рыба', 'рис', 'лук', 'яйца', 'морковь'],
        calories: 260,
        protein: 22,
        fat: 12,
        carbs: 18,
        description: 'Нежные рыбные тефтели'
      },
      {
        id: 'recipe60',
        name: 'Картофельные драники',
        ingredients: ['картофель', 'яйца', 'лук', 'мука', 'масло'],
        calories: 320,
        protein: 8,
        fat: 16,
        carbs: 38,
        description: 'Хрустящие картофельные драники'
      },
      {
        id: 'recipe61',
        name: 'Куриная печень',
        ingredients: ['курица', 'лук', 'морковь', 'масло', 'специи'],
        calories: 280,
        protein: 26,
        fat: 16,
        carbs: 8,
        description: 'Нежная куриная печень'
      },
      {
        id: 'recipe62',
        name: 'Овощной суп с фрикадельками',
        ingredients: ['мясо', 'картофель', 'морковь', 'лук', 'капуста'],
        calories: 300,
        protein: 22,
        fat: 12,
        carbs: 28,
        description: 'Сытный овощной суп с фрикадельками'
      },
      {
        id: 'recipe63',
        name: 'Творожная паста',
        ingredients: ['творог', 'макароны', 'яйца', 'сыр', 'масло'],
        calories: 380,
        protein: 24,
        fat: 16,
        carbs: 35,
        description: 'Сытная творожная паста'
      },
      {
        id: 'recipe64',
        name: 'Мясной салат с яйцами',
        ingredients: ['мясо', 'яйца', 'огурцы', 'помидоры', 'лук'],
        calories: 300,
        protein: 26,
        fat: 18,
        carbs: 10,
        description: 'Сытный мясной салат с яйцами'
      },
      {
        id: 'recipe65',
        name: 'Куриные сердечки',
        ingredients: ['курица', 'лук', 'морковь', 'масло', 'специи'],
        calories: 240,
        protein: 24,
        fat: 12,
        carbs: 6,
        description: 'Ароматные куриные сердечки'
      },
      {
        id: 'recipe66',
        name: 'Рыбный пирог с овощами',
        ingredients: ['рыба', 'капуста', 'морковь', 'лук', 'яйца'],
        calories: 340,
        protein: 24,
        fat: 18,
        carbs: 22,
        description: 'Сытный рыбный пирог с овощами'
      },
      {
        id: 'recipe67',
        name: 'Овощное рагу с мясом',
        ingredients: ['мясо', 'кабачок', 'баклажан', 'помидоры', 'перец'],
        calories: 360,
        protein: 28,
        fat: 18,
        carbs: 20,
        description: 'Ароматное овощное рагу с мясом'
      },
      {
        id: 'recipe68',
        name: 'Куриные ножки',
        ingredients: ['курица', 'картофель', 'лук', 'морковь', 'специи'],
        calories: 380,
        protein: 30,
        fat: 20,
        carbs: 22,
        description: 'Сочные куриные ножки'
      },
      {
        id: 'recipe69',
        name: 'Творожные вареники',
        ingredients: ['творог', 'мука', 'яйца', 'сахар', 'масло'],
        calories: 320,
        protein: 18,
        fat: 12,
        carbs: 38,
        description: 'Нежные творожные вареники'
      },
      {
        id: 'recipe70',
        name: 'Мясной салат с грибами',
        ingredients: ['мясо', 'грибы', 'лук', 'яйца', 'майонез'],
        calories: 340,
        protein: 28,
        fat: 20,
        carbs: 12,
        description: 'Сытный мясной салат с грибами'
      },
      {
        id: 'recipe71',
        name: 'Рыбные котлеты с рисом',
        ingredients: ['рыба', 'рис', 'лук', 'яйца', 'морковь'],
        calories: 300,
        protein: 26,
        fat: 14,
        carbs: 25,
        description: 'Сочные рыбные котлеты с рисом'
      },
      {
        id: 'recipe72',
        name: 'Овощной салат с яйцами',
        ingredients: ['яйца', 'помидоры', 'огурцы', 'лук', 'масло'],
        calories: 220,
        protein: 14,
        fat: 16,
        carbs: 8,
        description: 'Свежий овощной салат с яйцами'
      },
      {
        id: 'recipe73',
        name: 'Куриные бедра',
        ingredients: ['курица', 'картофель', 'лук', 'специи', 'масло'],
        calories: 400,
        protein: 32,
        fat: 22,
        carbs: 20,
        description: 'Сочные куриные бедра'
      },
      {
        id: 'recipe74',
        name: 'Творожная запеканка с яблоками',
        ingredients: ['творог', 'яблоко', 'яйца', 'мука', 'сахар'],
        calories: 300,
        protein: 18,
        fat: 10,
        carbs: 35,
        description: 'Нежная творожная запеканка с яблоками'
      },
      {
        id: 'recipe75',
        name: 'Мясной салат с овощами',
        ingredients: ['мясо', 'помидоры', 'огурцы', 'лук', 'майонез'],
        calories: 320,
        protein: 24,
        fat: 20,
        carbs: 12,
        description: 'Сытный мясной салат с овощами'
      },
      {
        id: 'recipe76',
        name: 'Рыбный суп с овощами',
        ingredients: ['рыба', 'картофель', 'морковь', 'лук', 'помидоры'],
        calories: 260,
        protein: 22,
        fat: 10,
        carbs: 22,
        description: 'Наваристый рыбный суп с овощами'
      },
      {
        id: 'recipe77',
        name: 'Куриные крылышки в соусе',
        ingredients: ['курица', 'лук', 'чеснок', 'специи', 'масло'],
        calories: 340,
        protein: 28,
        fat: 22,
        carbs: 6,
        description: 'Ароматные куриные крылышки в соусе'
      },
      {
        id: 'recipe78',
        name: 'Овощной салат с сыром и яйцами',
        ingredients: ['яйца', 'сыр', 'помидоры', 'огурцы', 'лук'],
        calories: 280,
        protein: 20,
        fat: 18,
        carbs: 10,
        description: 'Сытный овощной салат с сыром и яйцами'
      },
      {
        id: 'recipe79',
        name: 'Мясные котлеты с картофелем',
        ingredients: ['мясо', 'картофель', 'лук', 'яйца', 'мука'],
        calories: 420,
        protein: 32,
        fat: 22,
        carbs: 30,
        description: 'Сочные мясные котлеты с картофелем'
      },
      {
        id: 'recipe80',
        name: 'Рыбный салат с овощами',
        ingredients: ['рыба', 'яйца', 'помидоры', 'огурцы', 'лук'],
        calories: 260,
        protein: 22,
        fat: 16,
        carbs: 10,
        description: 'Свежий рыбный салат с овощами'
      },
      {
        id: 'recipe81',
        name: 'Куриный салат с грибами',
        ingredients: ['курица', 'грибы', 'лук', 'яйца', 'майонез'],
        calories: 300,
        protein: 26,
        fat: 18,
        carbs: 10,
        description: 'Сытный куриный салат с грибами'
      },
      {
        id: 'recipe82',
        name: 'Творожные оладьи',
        ingredients: ['творог', 'мука', 'яйца', 'сахар', 'масло'],
        calories: 320,
        protein: 20,
        fat: 14,
        carbs: 32,
        description: 'Пышные творожные оладьи'
      },
      {
        id: 'recipe83',
        name: 'Мясной салат с картофелем',
        ingredients: ['мясо', 'картофель', 'яйца', 'огурцы', 'майонез'],
        calories: 360,
        protein: 26,
        fat: 22,
        carbs: 18,
        description: 'Сытный мясной салат с картофелем'
      },
      {
        id: 'recipe84',
        name: 'Рыбные тефтели с овощами',
        ingredients: ['рыба', 'кабачок', 'морковь', 'лук', 'яйца'],
        calories: 280,
        protein: 24,
        fat: 14,
        carbs: 16,
        description: 'Нежные рыбные тефтели с овощами'
      },
      {
        id: 'recipe85',
        name: 'Куриный салат с яйцами',
        ingredients: ['курица', 'яйца', 'огурцы', 'помидоры', 'лук'],
        calories: 280,
        protein: 24,
        fat: 16,
        carbs: 10,
        description: 'Сытный куриный салат с яйцами'
      },
      {
        id: 'recipe86',
        name: 'Овощной салат с мясом',
        ingredients: ['мясо', 'помидоры', 'огурцы', 'лук', 'масло'],
        calories: 300,
        protein: 24,
        fat: 18,
        carbs: 12,
        description: 'Сытный овощной салат с мясом'
      },
      {
        id: 'recipe87',
        name: 'Рыбный салат с рисом',
        ingredients: ['рыба', 'рис', 'яйца', 'морковь', 'лук'],
        calories: 320,
        protein: 24,
        fat: 16,
        carbs: 22,
        description: 'Сытный рыбный салат с рисом'
      },
      {
        id: 'recipe88',
        name: 'Куриные котлеты с овощами',
        ingredients: ['курица', 'кабачок', 'морковь', 'лук', 'яйца'],
        calories: 300,
        protein: 28,
        fat: 16,
        carbs: 14,
        description: 'Сочные куриные котлеты с овощами'
      },
      {
        id: 'recipe89',
        name: 'Творожный салат',
        ingredients: ['творог', 'яйца', 'огурцы', 'помидоры', 'лук'],
        calories: 240,
        protein: 20,
        fat: 12,
        carbs: 12,
        description: 'Свежий творожный салат'
      },
      {
        id: 'recipe90',
        name: 'Мясной салат с рисом',
        ingredients: ['мясо', 'рис', 'яйца', 'морковь', 'лук'],
        calories: 380,
        protein: 28,
        fat: 20,
        carbs: 28,
        description: 'Сытный мясной салат с рисом'
      },
      {
        id: 'recipe91',
        name: 'Рыбный салат с картофелем',
        ingredients: ['рыба', 'картофель', 'яйца', 'огурцы', 'лук'],
        calories: 300,
        protein: 22,
        fat: 18,
        carbs: 20,
        description: 'Сытный рыбный салат с картофелем'
      },
      {
        id: 'recipe92',
        name: 'Куриный салат с картофелем',
        ingredients: ['курица', 'картофель', 'яйца', 'огурцы', 'лук'],
        calories: 320,
        protein: 26,
        fat: 18,
        carbs: 22,
        description: 'Сытный куриный салат с картофелем'
      },
      {
        id: 'recipe93',
        name: 'Овощной салат с рыбой',
        ingredients: ['рыба', 'помидоры', 'огурцы', 'лук', 'масло'],
        calories: 240,
        protein: 22,
        fat: 14,
        carbs: 8,
        description: 'Свежий овощной салат с рыбой'
      },
      {
        id: 'recipe94',
        name: 'Мясной салат с картофелем и яйцами',
        ingredients: ['мясо', 'картофель', 'яйца', 'огурцы', 'помидоры'],
        calories: 360,
        protein: 28,
        fat: 22,
        carbs: 18,
        description: 'Сытный мясной салат с картофелем и яйцами'
      },
      {
        id: 'recipe95',
        name: 'Рыбный салат с овощами и яйцами',
        ingredients: ['рыба', 'яйца', 'помидоры', 'огурцы', 'лук'],
        calories: 280,
        protein: 24,
        fat: 18,
        carbs: 10,
        description: 'Сытный рыбный салат с овощами и яйцами'
      },
      {
        id: 'recipe96',
        name: 'Куриный салат с овощами и яйцами',
        ingredients: ['курица', 'яйца', 'помидоры', 'огурцы', 'лук'],
        calories: 300,
        protein: 26,
        fat: 18,
        carbs: 12,
        description: 'Сытный куриный салат с овощами и яйцами'
      },
      {
        id: 'recipe97',
        name: 'Овощной салат с мясом и яйцами',
        ingredients: ['мясо', 'яйца', 'помидоры', 'огурцы', 'лук'],
        calories: 320,
        protein: 28,
        fat: 20,
        carbs: 12,
        description: 'Сытный овощной салат с мясом и яйцами'
      },
      {
        id: 'recipe98',
        name: 'Рыбный салат с мясом',
        ingredients: ['рыба', 'мясо', 'яйца', 'огурцы', 'лук'],
        calories: 340,
        protein: 32,
        fat: 22,
        carbs: 10,
        description: 'Очень сытный рыбный салат с мясом'
      },
      {
        id: 'recipe99',
        name: 'Куриный салат с мясом',
        ingredients: ['курица', 'мясо', 'яйца', 'огурцы', 'лук'],
        calories: 360,
        protein: 34,
        fat: 24,
        carbs: 10,
        description: 'Очень сытный куриный салат с мясом'
      },
      {
        id: 'recipe100',
        name: 'Универсальный салат',
        ingredients: ['яйца', 'помидоры', 'огурцы', 'лук', 'масло'],
        calories: 200,
        protein: 12,
        fat: 14,
        carbs: 10,
        description: 'Классический универсальный салат'
      }
    ];
    
    // Сохраняем рецепты
    const recipesSaved = await AsyncStorage.setItem('recipes', defaultRecipes);
    
    // Проверяем, что рецепты действительно сохранились
    const verifyRecipes = await AsyncStorage.getItem('recipes');
    if (!verifyRecipes || verifyRecipes.length === 0) {
      console.error('❌ Ошибка: рецепты не сохранились!');
      throw new Error('Не удалось сохранить рецепты в localStorage');
    }

    // Помечаем, что инициализация выполнена
    await AsyncStorage.setItem('appInitialized', true);

    console.log('✅ Хранилище заполнено начальными данными!');
    console.log(`- Пользователей: ${defaultUsers.length}`);
    console.log(`- Планов питания: ${defaultPlans.length}`);
    console.log(`- Заболеваний: ${defaultDiseases.length}`);
    console.log(`- Рецептов: ${defaultRecipes.length} (проверено: ${verifyRecipes.length})`);
    
    return {
      users: defaultUsers.length,
      plans: defaultPlans.length,
      diseases: defaultDiseases.length,
      recipes: defaultRecipes.length
    };
  }
};

export default AsyncStorage;

