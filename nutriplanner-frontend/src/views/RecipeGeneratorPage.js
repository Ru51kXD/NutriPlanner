import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Alert,
  Container,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton
} from '@mui/material';
import {
  Search,
  Delete,
  Restaurant,
  Close,
  Visibility,
  Favorite,
  FavoriteBorder
} from '@mui/icons-material';
import { StorageService } from '../utils/storage';
import { getRecipeImage } from '../utils/imageUtils';

const RecipeGeneratorPage = () => {
  const [productInput, setProductInput] = useState('');
  const [products, setProducts] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [recipeDatabase, setRecipeDatabase] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [error, setError] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

  // Загружаем избранные рецепты
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
    setFavoriteRecipes(favorites);
  }, []);

  const toggleFavoriteRecipe = (recipeId, e) => {
    e.stopPropagation(); // Предотвращаем открытие диалога при клике на лайк
    const favorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
    const index = favorites.indexOf(recipeId);
    
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(recipeId);
    }
    
    localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
    setFavoriteRecipes(favorites);
    window.dispatchEvent(new Event('favoriteRecipesChanged'));
  };

  const isRecipeFavorite = (recipeId) => {
    return favoriteRecipes.includes(recipeId);
  };

  // Загружаем рецепты из хранилища при монтировании компонента
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        // Сначала инициализируем данные, если они еще не инициализированы
        await StorageService.initializeDefaultData();
        
        // Небольшая задержка для гарантии сохранения данных
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Загружаем рецепты
        let loadedRecipes = await StorageService.getRecipes();
        
        // Если рецептов нет, проверяем localStorage напрямую
        if (!loadedRecipes || loadedRecipes.length === 0) {
          const storedRecipes = localStorage.getItem('recipes');
          if (storedRecipes) {
            try {
              loadedRecipes = JSON.parse(storedRecipes);
            } catch (e) {
              console.error('Ошибка парсинга рецептов из localStorage:', e);
            }
          }
        }
        
        // Если все еще нет рецептов, принудительно переинициализируем
        if (!loadedRecipes || loadedRecipes.length === 0) {
          console.log('Рецепты не найдены, принудительная инициализация...');
          // Очищаем флаг инициализации
          localStorage.removeItem('appInitialized');
          // Повторно инициализируем
          await StorageService.initializeDefaultData();
          await new Promise(resolve => setTimeout(resolve, 200));
          loadedRecipes = await StorageService.getRecipes();
        }
        
        if (loadedRecipes && loadedRecipes.length > 0) {
          console.log(`✅ Загружено рецептов: ${loadedRecipes.length}`);
          setRecipeDatabase(loadedRecipes);
          setLoadingRecipes(false);
          setError('');
        } else {
          console.error('❌ Рецепты не загружены после инициализации');
          setError('Не удалось загрузить рецепты. Попробуйте обновить страницу или нажмите кнопку "Перезагрузить рецепты".');
          setLoadingRecipes(false);
        }
      } catch (error) {
        console.error('Ошибка загрузки рецептов:', error);
        setError('Ошибка загрузки базы рецептов. Попробуйте обновить страницу.');
        setLoadingRecipes(false);
      }
    };
    loadRecipes();
  }, []);

  // Функция для принудительной перезагрузки рецептов
  const reloadRecipes = async () => {
    setLoadingRecipes(true);
    setError('');
    try {
      // Очищаем флаг инициализации
      localStorage.removeItem('appInitialized');
      // Переинициализируем
      await StorageService.initializeDefaultData();
      await new Promise(resolve => setTimeout(resolve, 200));
      const loadedRecipes = await StorageService.getRecipes();
      if (loadedRecipes && loadedRecipes.length > 0) {
        setRecipeDatabase(loadedRecipes);
        setError('');
        console.log(`✅ Рецепты перезагружены: ${loadedRecipes.length}`);
      } else {
        setError('Не удалось загрузить рецепты. Попробуйте обновить страницу.');
      }
    } catch (error) {
      console.error('Ошибка перезагрузки рецептов:', error);
      setError('Ошибка перезагрузки базы рецептов.');
    } finally {
      setLoadingRecipes(false);
    }
  };

  const normalizeProduct = (product) => {
    return product.toLowerCase().trim();
  };

  const addProduct = () => {
    const input = productInput.trim();
    if (!input) return;
    
    // Разделяем по запятым, если пользователь ввел несколько продуктов
    const productsToAdd = input.split(',').map(p => normalizeProduct(p)).filter(p => p && p.length > 0);
    
    if (productsToAdd.length === 0) return;
    
    // Проверяем лимит
    if (products.length + productsToAdd.length > 20) {
      setError('Слишком много продуктов! Максимум 20.');
      return;
    }
    
    // Добавляем только новые продукты
    const newProducts = productsToAdd.filter(p => !products.includes(p));
    
    if (newProducts.length > 0) {
      setProducts([...products, ...newProducts]);
      setProductInput('');
      setError('');
    } else {
      setError('Эти продукты уже добавлены');
    }
  };

  const removeProduct = (product) => {
    setProducts(products.filter(p => p !== product));
  };

  // Расширенный словарь синонимов для улучшения поиска
  const getProductSynonyms = (product) => {
    const synonyms = {
      'яйца': ['яйцо', 'яичный', 'яичница', 'омлет', 'яичка', 'яички'],
      'курица': ['куриное', 'куриный', 'куриная грудка', 'куриное филе', 'цыпленок', 'курочка', 'куриные', 'курицу'],
      'мясо': ['говядина', 'свинина', 'баранина', 'фарш', 'мясной', 'мясные', 'мясом'],
      'рыба': ['рыбный', 'рыбка', 'филе рыбы', 'рыбные', 'рыбу', 'рыбой'],
      'помидоры': ['помидор', 'томат', 'томаты', 'томатный', 'помидорами'],
      'огурцы': ['огурец', 'огурчики', 'огурцов'],
      'лук': ['луковица', 'репчатый лук', 'луком', 'лука', 'луковицу'],
      'морковь': ['морковка', 'морковью', 'морковкой', 'морковку'],
      'картофель': ['картошка', 'картофельный', 'картофелем', 'картошкой'],
      'капуста': ['капустка', 'белокочанная капуста', 'капустой', 'капусту'],
      'перец': ['болгарский перец', 'перчик', 'перцем', 'перца'],
      'макароны': ['паста', 'макаронные изделия', 'спагетти', 'макаронами', 'пастой'],
      'рис': ['рисовый', 'рисом', 'риса'],
      'гречка': ['гречневая крупа', 'гречневая', 'гречкой', 'гречневой'],
      'творог': ['творожный', 'творогом', 'творога'],
      'молоко': ['молочный', 'молоком'],
      'мука': ['мучной', 'мукой', 'муки'],
      'масло': ['растительное масло', 'подсолнечное масло', 'оливковое масло', 'маслом'],
      'сыр': ['сырный', 'сыром', 'сыра'],
      'грибы': ['грибной', 'шампиньоны', 'грибами', 'грибов'],
      'кабачок': ['кабачки', 'цуккини', 'кабачком', 'кабачками'],
      'баклажан': ['баклажаны', 'баклажаном', 'баклажанами'],
      'брокколи': ['брокколи'],
      'лапша': ['вермишель', 'лапшой', 'лапши'],
      'зелень': ['укроп', 'петрушка', 'базилик', 'зеленый лук', 'зеленью'],
      'чеснок': ['чеснока', 'чесноком'],
      'специи': ['специя', 'приправа', 'приправы', 'специями'],
      'томаты': ['томат', 'помидоры', 'помидор', 'томатный'],
      'лимон': ['лимоном', 'лимона', 'лимонный']
    };
    
    const normalized = product.toLowerCase().trim();
    const productSynonyms = [normalized];
    
    // Ищем синонимы - проверяем все варианты
    for (const [key, values] of Object.entries(synonyms)) {
      if (key === normalized || 
          normalized.includes(key) || 
          key.includes(normalized) ||
          values.some(v => v === normalized || normalized.includes(v) || v.includes(normalized))) {
        productSynonyms.push(key, ...values);
        break;
      }
    }
    
    return [...new Set(productSynonyms)];
  };

  const findRecipes = () => {
    if (products.length === 0) {
      setError('Добавьте хотя бы один продукт');
      return;
    }

    if (products.length > 15) {
      setError('Список продуктов слишком большой. Пожалуйста, используйте не более 15 продуктов.');
      setRecipes([]);
      return;
    }

    setLoading(true);
    setError('');

    // Имитация AI поиска (в реальности здесь был бы API вызов)
    setTimeout(() => {
      if (recipeDatabase.length === 0) {
        setError('База рецептов не загружена. Пожалуйста, обновите страницу.');
        setLoading(false);
        return;
      }

      // Улучшенный алгоритм поиска с весовой системой и умным сопоставлением
      const foundRecipes = recipeDatabase.map(recipe => {
        let matchScore = 0;
        let matchedIngredients = [];
        let totalWeight = 0;
        
        recipe.ingredients.forEach(ingredient => {
          const ingredientLower = ingredient.toLowerCase().trim();
          let bestMatch = 0;
          let matchedProduct = null;
          
          products.forEach(product => {
            const productSynonyms = getProductSynonyms(product);
            let matchWeight = 0;
            
            productSynonyms.forEach(synonym => {
              const synonymLower = synonym.toLowerCase().trim();
              
              // Точное совпадение - максимальный вес (10 баллов)
              if (ingredientLower === synonymLower) {
                matchWeight = Math.max(matchWeight, 10);
              }
              // Ингредиент содержит продукт или наоборот - высокий вес (8 баллов)
              else if (ingredientLower.includes(synonymLower) || synonymLower.includes(ingredientLower)) {
                // Если длина совпадения больше 3 символов - больше вес
                const matchLength = Math.min(ingredientLower.length, synonymLower.length);
                matchWeight = Math.max(matchWeight, matchLength > 3 ? 8 : 6);
              }
              // Частичное совпадение - средний вес (4 балла)
              else if (ingredientLower.split(' ').some(word => word.includes(synonymLower)) ||
                       synonymLower.split(' ').some(word => word.includes(ingredientLower))) {
                matchWeight = Math.max(matchWeight, 4);
              }
            });
            
            if (matchWeight > bestMatch) {
              bestMatch = matchWeight;
              matchedProduct = product;
            }
          });
          
          if (bestMatch > 0) {
            matchScore += bestMatch;
            totalWeight += bestMatch;
            if (!matchedIngredients.includes(ingredient)) {
              matchedIngredients.push(ingredient);
            }
          }
        });
        
        // Дополнительные бонусы:
        // - Бонус за процент совпадения ингредиентов
        const ingredientMatchRatio = matchedIngredients.length / recipe.ingredients.length;
        const bonusScore = ingredientMatchRatio * 5;
        
        // - Бонус за большее количество совпадений
        const quantityBonus = matchedIngredients.length * 2;
        
        const finalScore = matchScore + bonusScore + quantityBonus;
        
        return {
          ...recipe,
          matchScore: finalScore,
          matchedIngredients,
          matchPercentage: (matchedIngredients.length / recipe.ingredients.length) * 100,
          ingredientMatchCount: matchedIngredients.length
        };
      })
      .filter(recipe => recipe.matchScore > 0) // Находим рецепты хотя бы с 1 совпадением
      .sort((a, b) => {
        // Сортируем по финальному счету (больше = лучше)
        if (Math.abs(b.matchScore - a.matchScore) > 1) {
          return b.matchScore - a.matchScore;
        }
        // Если счет близок, сортируем по количеству совпадений ингредиентов
        if (b.ingredientMatchCount !== a.ingredientMatchCount) {
          return b.ingredientMatchCount - a.ingredientMatchCount;
        }
        // Если количество совпадений одинаково, сортируем по проценту совпадения
        return b.matchPercentage - a.matchPercentage;
      });

      if (foundRecipes.length === 0) {
        setError('Рецепты не найдены. Попробуйте изменить список продуктов.');
        setRecipes([]);
      } else {
        // Убираем служебные поля перед отображением
        const recipesToShow = foundRecipes.map(({ matchScore, matchedIngredients, matchPercentage, ...recipe }) => recipe);
        setRecipes(recipesToShow);
        setError('');
      }

      setLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addProduct();
    }
  };

  const handleOpenRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setDialogOpen(true);
  };

  const handleCloseRecipe = () => {
    setDialogOpen(false);
    setSelectedRecipe(null);
  };

  return (
    <Container maxWidth="lg" style={{ padding: '32px 0' }} className="fade-in-up">
      <Paper elevation={3} style={{ 
        padding: '32px', 
        marginBottom: '32px',
        animation: 'fadeInUp 0.8s ease-out',
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
      }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" style={{ color: '#2E8B57' }}>
          🤖 AI Генерация рецептов
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" style={{ marginBottom: '16px' }}>
          Введите список продуктов, которые есть у вас дома, и мы подберем подходящие рецепты
        </Typography>
        {!loadingRecipes && recipeDatabase.length > 0 && (
          <Typography variant="body2" color="text.secondary" align="center" style={{ marginBottom: '32px', color: '#10B981', fontWeight: 600 }}>
            ✅ База рецептов загружена: {recipeDatabase.length} рецептов
          </Typography>
        )}

        {loadingRecipes && (
          <Alert severity="info" style={{ marginBottom: '16px' }}>
            <Box display="flex" alignItems="center" gap={2}>
              <CircularProgress size={20} />
              <span>Загрузка базы рецептов...</span>
            </Box>
          </Alert>
        )}
        
        {error && (
          <Alert 
            severity={error.includes('не найден') ? 'warning' : 'error'} 
            style={{ marginBottom: '16px' }}
            action={
              error.includes('не загружена') || error.includes('Не удалось') ? (
                <Button color="inherit" size="small" onClick={reloadRecipes}>
                  Перезагрузить рецепты
                </Button>
              ) : null
            }
          >
            {error}
          </Alert>
        )}

        <Box style={{ marginBottom: '24px' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Добавить продукт"
                value={productInput}
                onChange={(e) => setProductInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Например: яйца, курица, помидоры..."
                helperText="Можно ввести несколько продуктов через запятую. Нажмите Enter или кнопку для добавления"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="contained"
                onClick={addProduct}
                style={{ backgroundColor: '#2E8B57', height: '56px' }}
              >
                Добавить
              </Button>
            </Grid>
          </Grid>
        </Box>

        {products.length > 0 && (
          <Box style={{ marginBottom: '24px' }}>
            <Typography variant="h6" gutterBottom>
              Ваши продукты ({products.length}/20):
            </Typography>
            <Box style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {products.map((product, index) => (
                <Chip
                  key={index}
                  label={product}
                  onDelete={() => removeProduct(product)}
                  deleteIcon={<Delete />}
                  style={{ backgroundColor: '#E8F5E9', color: '#2E8B57' }}
                />
              ))}
            </Box>
          </Box>
        )}

        <Box style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Button
            variant="contained"
            size="large"
            onClick={findRecipes}
            disabled={loading || products.length === 0 || loadingRecipes || recipeDatabase.length === 0}
            startIcon={loading ? <CircularProgress size={20} /> : <Search />}
            style={{ 
              backgroundColor: '#2E8B57',
              padding: '12px 48px',
              fontSize: '1.1rem'
            }}
          >
            {loading ? 'Поиск рецептов...' : loadingRecipes ? 'Загрузка базы...' : 'Подобрать блюда'}
          </Button>
        </Box>

        {recipes.length > 0 && (
          <Box>
            <Typography variant="h5" gutterBottom style={{ color: '#2E8B57', marginBottom: '24px' }}>
              🍽️ Найденные рецепты ({recipes.length})
            </Typography>
            <Grid container spacing={3}>
              {recipes.map((recipe, index) => (
                <Grid 
                  item 
                  xs={12} 
                  md={6} 
                  key={index}
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both`
                  }}
                >
                  <Card 
                    style={{ 
                      height: '100%', 
                      borderLeft: '4px solid', 
                      borderColor: '#2E8B57',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      overflow: 'hidden'
                    }}
                    onClick={() => handleOpenRecipe(recipe)}
                    sx={{
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                      }
                    }}
                  >
                    <Box
                      style={{
                        width: '100%',
                        height: '200px',
                        backgroundImage: `url(${getRecipeImage(recipe.name)})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative'
                      }}
                    >
                      <Box
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3))'
                        }}
                      />
                    </Box>
                    <CardContent>
                      <Box style={{ display: 'flex', alignItems: 'start', marginBottom: '16px' }}>
                        <Box style={{ flex: 1 }}>
                          <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="h6" gutterBottom style={{ color: '#2E8B57', fontWeight: 600 }}>
                              {recipe.name}
                            </Typography>
                            <Box style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <IconButton
                                size="small"
                                onClick={(e) => toggleFavoriteRecipe(recipe.id, e)}
                                style={{ 
                                  color: isRecipeFavorite(recipe.id) ? '#EF4444' : '#9CA3AF'
                                }}
                              >
                                {isRecipeFavorite(recipe.id) ? <Favorite /> : <FavoriteBorder />}
                              </IconButton>
                              <Button
                                size="small"
                                startIcon={<Visibility />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenRecipe(recipe);
                                }}
                                style={{ color: '#2E8B57' }}
                              >
                                Открыть
                              </Button>
                            </Box>
                          </Box>
                          <Typography variant="body2" color="text.secondary" style={{ marginBottom: '12px' }}>
                            {recipe.description}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant="subtitle2" gutterBottom>
                        Ингредиенты:
                      </Typography>
                      <Box style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '16px' }}>
                        {recipe.ingredients.map((ingredient, idx) => (
                          <Chip
                            key={idx}
                            label={ingredient}
                            size="small"
                            variant="outlined"
                            style={{ fontSize: '0.75rem' }}
                          />
                        ))}
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={3}>
                          <Box textAlign="center">
                            <Typography variant="h6" style={{ color: '#ED8936', fontWeight: 'bold' }}>
                              {recipe.calories}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ккал
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={3}>
                          <Box textAlign="center">
                            <Typography variant="h6" style={{ color: '#4299E1', fontWeight: 'bold' }}>
                              {recipe.protein}г
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Белки
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={3}>
                          <Box textAlign="center">
                            <Typography variant="h6" style={{ color: '#38A169', fontWeight: 'bold' }}>
                              {recipe.fat}г
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Жиры
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={3}>
                          <Box textAlign="center">
                            <Typography variant="h6" style={{ color: '#ED8936', fontWeight: 'bold' }}>
                              {recipe.carbs}г
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Углеводы
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Диалог детального просмотра рецепта */}
        <Dialog 
          open={dialogOpen} 
          onClose={handleCloseRecipe}
          maxWidth="md"
          fullWidth
          PaperProps={{
            style: {
              borderRadius: '28px',
              padding: '0',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
            }
          }}
        >
          <DialogTitle style={{ 
            background: 'linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%)',
            color: 'white',
            padding: '28px 32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Декоративные элементы */}
            <Box style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              filter: 'blur(30px)'
            }} />
            <Box style={{
              position: 'absolute',
              bottom: '-30px',
              left: '-30px',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
              filter: 'blur(25px)'
            }} />
            
            <Box style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 1 }}>
              <Box style={{
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '16px',
                padding: '12px',
                backdropFilter: 'blur(10px)'
              }}>
                <Restaurant style={{ fontSize: 36 }} />
              </Box>
              <Typography variant="h4" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                {selectedRecipe?.name}
              </Typography>
            </Box>
            <IconButton 
              onClick={handleCloseRecipe} 
              style={{ 
                color: 'white',
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                position: 'relative',
                zIndex: 1
              }}
              sx={{
                '&:hover': {
                  background: 'rgba(255,255,255,0.3)',
                  transform: 'rotate(90deg)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent style={{ padding: '32px', background: 'linear-gradient(to bottom, #FAFAFA 0%, #FFFFFF 100%)' }}>
            {selectedRecipe && (
              <Box>
                <Box style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '28px',
                  border: '1px solid rgba(16, 185, 129, 0.2)'
                }}>
                  <Typography variant="body1" style={{ 
                    fontSize: '1.15rem', 
                    lineHeight: 1.7,
                    color: '#374151',
                    fontWeight: 500
                  }}>
                    {selectedRecipe.description}
                  </Typography>
                </Box>

                <Box style={{ marginBottom: '32px' }}>
                  <Typography variant="h5" gutterBottom style={{ 
                    fontWeight: 700, 
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: '#1F2937'
                  }}>
                    <Box style={{
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      borderRadius: '12px',
                      padding: '8px 12px',
                      color: 'white',
                      fontSize: '1.2rem'
                    }}>
                      📋
                    </Box>
                    Ингредиенты:
                  </Typography>
                  <Box style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '12px'
                  }}>
                    {selectedRecipe.ingredients.map((ingredient, idx) => (
                      <Chip
                        key={idx}
                        label={ingredient}
                        style={{ 
                          background: 'linear-gradient(135deg, #E8F5E9 0%, #D1FAE5 100%)',
                          color: '#047857',
                          fontSize: '1rem',
                          padding: '8px 16px',
                          height: 'auto',
                          fontWeight: 600,
                          border: '2px solid rgba(16, 185, 129, 0.2)',
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
                        }}
                        sx={{
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 16px rgba(16, 185, 129, 0.25)',
                            transition: 'all 0.3s ease'
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h5" gutterBottom style={{ 
                    fontWeight: 700, 
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: '#1F2937'
                  }}>
                    <Box style={{
                      background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                      borderRadius: '12px',
                      padding: '8px 12px',
                      color: 'white',
                      fontSize: '1.2rem'
                    }}>
                      🥗
                    </Box>
                    Пищевая ценность:
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={6} md={3}>
                      <Card style={{ 
                        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                        color: 'white',
                        textAlign: 'center',
                        padding: '28px 20px',
                        borderRadius: '20px',
                        boxShadow: '0 10px 30px rgba(245, 158, 11, 0.3)',
                        border: '2px solid rgba(255,255,255,0.2)',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      sx={{
                        '&:hover': {
                          transform: 'translateY(-8px) scale(1.05)',
                          boxShadow: '0 20px 40px rgba(245, 158, 11, 0.4)',
                        }
                      }}
                      >
                        <Box style={{
                          position: 'absolute',
                          top: '-20px',
                          right: '-20px',
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.2)',
                          filter: 'blur(20px)'
                        }} />
                        <Typography variant="h3" style={{ 
                          fontWeight: 900, 
                          marginBottom: '8px',
                          position: 'relative',
                          zIndex: 1,
                          textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                        }}>
                          {selectedRecipe.calories}
                        </Typography>
                        <Typography variant="body1" style={{ 
                          opacity: 0.95,
                          fontWeight: 600,
                          position: 'relative',
                          zIndex: 1
                        }}>
                          ккал
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Card style={{ 
                        background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                        color: 'white',
                        textAlign: 'center',
                        padding: '28px 20px',
                        borderRadius: '20px',
                        boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
                        border: '2px solid rgba(255,255,255,0.2)',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      sx={{
                        '&:hover': {
                          transform: 'translateY(-8px) scale(1.05)',
                          boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)',
                        }
                      }}
                      >
                        <Box style={{
                          position: 'absolute',
                          top: '-20px',
                          right: '-20px',
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.2)',
                          filter: 'blur(20px)'
                        }} />
                        <Typography variant="h3" style={{ 
                          fontWeight: 900, 
                          marginBottom: '8px',
                          position: 'relative',
                          zIndex: 1,
                          textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                        }}>
                          {selectedRecipe.protein}г
                        </Typography>
                        <Typography variant="body1" style={{ 
                          opacity: 0.95,
                          fontWeight: 600,
                          position: 'relative',
                          zIndex: 1
                        }}>
                          Белки
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Card style={{ 
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        color: 'white',
                        textAlign: 'center',
                        padding: '28px 20px',
                        borderRadius: '20px',
                        boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
                        border: '2px solid rgba(255,255,255,0.2)',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      sx={{
                        '&:hover': {
                          transform: 'translateY(-8px) scale(1.05)',
                          boxShadow: '0 20px 40px rgba(16, 185, 129, 0.4)',
                        }
                      }}
                      >
                        <Box style={{
                          position: 'absolute',
                          top: '-20px',
                          right: '-20px',
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.2)',
                          filter: 'blur(20px)'
                        }} />
                        <Typography variant="h3" style={{ 
                          fontWeight: 900, 
                          marginBottom: '8px',
                          position: 'relative',
                          zIndex: 1,
                          textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                        }}>
                          {selectedRecipe.fat}г
                        </Typography>
                        <Typography variant="body1" style={{ 
                          opacity: 0.95,
                          fontWeight: 600,
                          position: 'relative',
                          zIndex: 1
                        }}>
                          Жиры
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Card style={{ 
                        background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                        color: 'white',
                        textAlign: 'center',
                        padding: '28px 20px',
                        borderRadius: '20px',
                        boxShadow: '0 10px 30px rgba(239, 68, 68, 0.3)',
                        border: '2px solid rgba(255,255,255,0.2)',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      sx={{
                        '&:hover': {
                          transform: 'translateY(-8px) scale(1.05)',
                          boxShadow: '0 20px 40px rgba(239, 68, 68, 0.4)',
                        }
                      }}
                      >
                        <Box style={{
                          position: 'absolute',
                          top: '-20px',
                          right: '-20px',
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.2)',
                          filter: 'blur(20px)'
                        }} />
                        <Typography variant="h3" style={{ 
                          fontWeight: 900, 
                          marginBottom: '8px',
                          position: 'relative',
                          zIndex: 1,
                          textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                        }}>
                          {selectedRecipe.carbs}г
                        </Typography>
                        <Typography variant="body1" style={{ 
                          opacity: 0.95,
                          fontWeight: 600,
                          position: 'relative',
                          zIndex: 1
                        }}>
                          Углеводы
                        </Typography>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions style={{ 
            padding: '24px 32px', 
            justifyContent: 'center',
            background: 'linear-gradient(to top, #F9FAFB 0%, #FFFFFF 100%)',
            borderTop: '1px solid rgba(0,0,0,0.05)'
          }}>
            <Button 
              onClick={handleCloseRecipe}
              variant="contained"
              style={{
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: 'white',
                borderRadius: '16px',
                padding: '14px 48px',
                fontWeight: 700,
                fontSize: '1.1rem',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
                textTransform: 'none',
                transition: 'all 0.3s ease'
              }}
              sx={{
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 32px rgba(16, 185, 129, 0.4)',
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                }
              }}
            >
              Закрыть
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default RecipeGeneratorPage;

