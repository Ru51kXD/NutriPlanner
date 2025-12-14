import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Container,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
  Button
} from '@mui/material';
import {
  WbSunny,
  AcUnit,
  LocalFlorist,
  Nature,
  Close,
  Visibility,
  Favorite,
  FavoriteBorder
} from '@mui/icons-material';

// Сезонные блюда
const seasonalRecipes = {
  spring: [
    { name: 'Салат из свежих овощей', description: 'Помидоры, огурцы, редис, зелень', calories: 120, protein: 3, fat: 8, carbs: 12, ingredients: ['помидоры', 'огурцы', 'редис', 'зелень', 'масло'] },
    { name: 'Щавелевый суп', description: 'Классический весенний суп', calories: 180, protein: 5, fat: 6, carbs: 25, ingredients: ['щавель', 'яйца', 'картофель', 'лук'] },
    { name: 'Омлет с зеленью', description: 'Яйца с молодой зеленью', calories: 280, protein: 18, fat: 20, carbs: 8, ingredients: ['яйца', 'зелень', 'лук', 'масло'] },
    { name: 'Спаржа на пару', description: 'Весенняя спаржа с соусом', calories: 150, protein: 4, fat: 8, carbs: 15, ingredients: ['спаржа', 'масло', 'лимон'] },
    { name: 'Крапивный суп', description: 'Полезный суп из крапивы', calories: 160, protein: 6, fat: 5, carbs: 22, ingredients: ['крапива', 'яйца', 'картофель', 'лук'] },
    { name: 'Салат из редиса', description: 'Свежий редис с зеленью', calories: 100, protein: 2, fat: 6, carbs: 10, ingredients: ['редис', 'зелень', 'масло', 'сметана'] },
    { name: 'Овощное рагу', description: 'Молодые овощи тушеные', calories: 200, protein: 5, fat: 10, carbs: 22, ingredients: ['кабачок', 'баклажан', 'помидоры', 'перец'] },
    { name: 'Зеленый борщ', description: 'Весенний борщ со щавелем', calories: 220, protein: 8, fat: 8, carbs: 30, ingredients: ['щавель', 'яйца', 'картофель', 'лук', 'сметана'] }
  ],
  summer: [
    { name: 'Окрошка', description: 'Классическая летняя окрошка', calories: 180, protein: 8, fat: 6, carbs: 22, ingredients: ['квас', 'огурцы', 'редис', 'яйца', 'колбаса'] },
    { name: 'Салат из помидоров и огурцов', description: 'Свежий летний салат', calories: 110, protein: 2, fat: 7, carbs: 11, ingredients: ['помидоры', 'огурцы', 'лук', 'масло', 'зелень'] },
    { name: 'Холодный суп гаспачо', description: 'Испанский холодный суп', calories: 150, protein: 3, fat: 8, carbs: 18, ingredients: ['помидоры', 'перец', 'огурец', 'лук', 'чеснок'] },
    { name: 'Гриль из овощей', description: 'Овощи на гриле', calories: 200, protein: 5, fat: 12, carbs: 20, ingredients: ['кабачок', 'баклажан', 'перец', 'помидоры', 'масло'] },
    { name: 'Свекольник', description: 'Холодный свекольный суп', calories: 160, protein: 4, fat: 6, carbs: 25, ingredients: ['свекла', 'огурцы', 'яйца', 'зелень', 'кефир'] },
    { name: 'Салат Цезарь', description: 'Классический салат', calories: 320, protein: 15, fat: 22, carbs: 18, ingredients: ['курица', 'салат', 'сыр', 'сухарики', 'соус'] },
    { name: 'Фруктовый салат', description: 'Свежие летние фрукты', calories: 140, protein: 2, fat: 1, carbs: 32, ingredients: ['яблоки', 'груши', 'персики', 'ягоды'] },
    { name: 'Рыба на гриле', description: 'Рыба с овощами на гриле', calories: 280, protein: 30, fat: 12, carbs: 8, ingredients: ['рыба', 'лимон', 'овощи', 'масло'] },
    { name: 'Кукуруза вареная', description: 'Свежая кукуруза', calories: 120, protein: 4, fat: 2, carbs: 22, ingredients: ['кукуруза', 'масло', 'соль'] },
    { name: 'Борщ холодный', description: 'Холодный борщ с кефиром', calories: 200, protein: 6, fat: 8, carbs: 28, ingredients: ['свекла', 'огурцы', 'яйца', 'зелень', 'кефир'] }
  ],
  autumn: [
    { name: 'Тыквенный суп', description: 'Крем-суп из тыквы', calories: 220, protein: 5, fat: 10, carbs: 30, ingredients: ['тыква', 'лук', 'морковь', 'сливки'] },
    { name: 'Грибной суп', description: 'Наваристый грибной суп', calories: 250, protein: 8, fat: 12, carbs: 28, ingredients: ['грибы', 'картофель', 'лук', 'морковь', 'сливки'] },
    { name: 'Тушеная капуста', description: 'Капуста с мясом', calories: 280, protein: 12, fat: 15, carbs: 25, ingredients: ['капуста', 'мясо', 'морковь', 'лук', 'томаты'] },
    { name: 'Запеченная тыква', description: 'Тыква с медом и орехами', calories: 180, protein: 3, fat: 8, carbs: 28, ingredients: ['тыква', 'мед', 'орехи', 'корица'] },
    { name: 'Борщ', description: 'Классический борщ', calories: 240, protein: 10, fat: 10, carbs: 32, ingredients: ['свекла', 'капуста', 'мясо', 'картофель', 'морковь'] },
    { name: 'Гречка с грибами', description: 'Гречка с осенними грибами', calories: 320, protein: 12, fat: 14, carbs: 42, ingredients: ['гречка', 'грибы', 'лук', 'морковь', 'масло'] },
    { name: 'Яблочный пирог', description: 'Пирог с осенними яблоками', calories: 350, protein: 8, fat: 16, carbs: 45, ingredients: ['яблоки', 'мука', 'яйца', 'сахар', 'масло'] },
    { name: 'Тушеное мясо с овощами', description: 'Мясо с осенними овощами', calories: 380, protein: 28, fat: 20, carbs: 22, ingredients: ['мясо', 'морковь', 'лук', 'картофель', 'томаты'] },
    { name: 'Капустные котлеты', description: 'Котлеты из капусты', calories: 200, protein: 6, fat: 10, carbs: 25, ingredients: ['капуста', 'яйца', 'мука', 'лук'] },
    { name: 'Суп с фасолью', description: 'Сытный суп с фасолью', calories: 280, protein: 15, fat: 8, carbs: 38, ingredients: ['фасоль', 'картофель', 'морковь', 'лук', 'томаты'] }
  ],
  winter: [
    { name: 'Солянка', description: 'Наваристая солянка', calories: 320, protein: 18, fat: 16, carbs: 28, ingredients: ['мясо', 'колбаса', 'огурцы', 'оливки', 'лимон'] },
    { name: 'Борщ', description: 'Горячий борщ', calories: 240, protein: 10, fat: 10, carbs: 32, ingredients: ['свекла', 'капуста', 'мясо', 'картофель', 'морковь'] },
    { name: 'Щи', description: 'Классические щи', calories: 200, protein: 8, fat: 8, carbs: 25, ingredients: ['капуста', 'мясо', 'картофель', 'морковь', 'лук'] },
    { name: 'Пельмени', description: 'Домашние пельмени', calories: 420, protein: 22, fat: 18, carbs: 45, ingredients: ['мука', 'мясо', 'лук', 'яйца'] },
    { name: 'Голубцы', description: 'Голубцы с мясом и рисом', calories: 280, protein: 18, fat: 12, carbs: 28, ingredients: ['капуста', 'мясо', 'рис', 'морковь', 'лук'] },
    { name: 'Тушеная капуста с мясом', description: 'Сытное зимнее блюдо', calories: 320, protein: 20, fat: 16, carbs: 25, ingredients: ['капуста', 'мясо', 'морковь', 'лук', 'томаты'] },
    { name: 'Куриный суп', description: 'Наваристый куриный суп', calories: 280, protein: 22, fat: 10, carbs: 30, ingredients: ['курица', 'картофель', 'морковь', 'лук', 'лапша'] },
    { name: 'Запеченная утка', description: 'Утка с яблоками', calories: 450, protein: 35, fat: 28, carbs: 15, ingredients: ['утка', 'яблоки', 'картофель', 'лук'] },
    { name: 'Гречневая каша с мясом', description: 'Гречка с тушеным мясом', calories: 380, protein: 25, fat: 14, carbs: 42, ingredients: ['гречка', 'мясо', 'лук', 'морковь'] },
    { name: 'Холодец', description: 'Заливное из мяса', calories: 220, protein: 18, fat: 12, carbs: 8, ingredients: ['мясо', 'лук', 'морковь', 'чеснок'] }
  ]
};

const SeasonalMenuPage = () => {
  const [selectedSeason, setSelectedSeason] = useState('spring');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

  const handleOpenRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setDialogOpen(true);
  };

  const handleCloseRecipe = () => {
    setDialogOpen(false);
    setSelectedRecipe(null);
  };

  React.useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
    setFavoriteRecipes(favorites);
  }, []);

  const toggleFavoriteRecipe = (recipeName, e) => {
    if (e) e.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
    const index = favorites.indexOf(recipeName);
    
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(recipeName);
    }
    
    localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
    setFavoriteRecipes(favorites);
    window.dispatchEvent(new Event('favoriteRecipesChanged'));
  };

  const isRecipeFavorite = (recipeName) => {
    return favoriteRecipes.includes(recipeName);
  };

  const currentRecipes = seasonalRecipes[selectedSeason] || [];

  const seasonIcons = {
    spring: <LocalFlorist style={{ fontSize: 32, color: '#4CAF50' }} />,
    summer: <WbSunny style={{ fontSize: 32, color: '#FF9800' }} />,
    autumn: <Nature style={{ fontSize: 32, color: '#FF5722' }} />,
    winter: <AcUnit style={{ fontSize: 32, color: '#2196F3' }} />
  };

  const seasonColors = {
    spring: '#4CAF50',
    summer: '#FF9800',
    autumn: '#FF5722',
    winter: '#2196F3'
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
          🍂 Сезонное меню
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" style={{ marginBottom: '32px' }}>
          Выберите сезон, чтобы увидеть рекомендуемые блюда
        </Typography>

        <Box style={{ marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px auto' }}>
          <FormControl fullWidth>
            <InputLabel>Сезон</InputLabel>
            <Select
              value={selectedSeason}
              label="Сезон"
              onChange={(e) => setSelectedSeason(e.target.value)}
            >
              <MenuItem value="spring">🌸 Весна</MenuItem>
              <MenuItem value="summer">☀️ Лето</MenuItem>
              <MenuItem value="autumn">🍂 Осень</MenuItem>
              <MenuItem value="winter">❄️ Зима</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {currentRecipes.length > 0 && (
          <Box>
            <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              {seasonIcons[selectedSeason]}
              <Typography variant="h5" style={{ marginLeft: '12px', color: seasonColors[selectedSeason] }}>
                {selectedSeason === 'spring' && 'Весенние блюда'}
                {selectedSeason === 'summer' && 'Летние блюда'}
                {selectedSeason === 'autumn' && 'Осенние блюда'}
                {selectedSeason === 'winter' && 'Зимние блюда'}
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {currentRecipes.map((recipe, index) => (
                <Grid 
                  item 
                  xs={12} 
                  md={6} 
                  lg={4} 
                  key={index}
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  <Card 
                    style={{ 
                      height: '100%', 
                      borderLeft: `4px solid ${seasonColors[selectedSeason]}`,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => handleOpenRecipe(recipe)}
                    sx={{
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                      }
                    }}
                  >
                    <CardContent>
                      <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <Typography variant="h6" gutterBottom style={{ color: seasonColors[selectedSeason], fontWeight: 600 }}>
                          {recipe.name}
                        </Typography>
                        <Box style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <IconButton
                            size="small"
                            onClick={(e) => toggleFavoriteRecipe(recipe.name, e)}
                            style={{ 
                              color: isRecipeFavorite(recipe.name) ? '#EF4444' : '#9CA3AF'
                            }}
                          >
                            {isRecipeFavorite(recipe.name) ? <Favorite /> : <FavoriteBorder />}
                          </IconButton>
                          <Button
                            size="small"
                            startIcon={<Visibility />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenRecipe(recipe);
                            }}
                            style={{ color: seasonColors[selectedSeason] }}
                          >
                            Открыть
                          </Button>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary" style={{ marginBottom: '16px' }}>
                        {recipe.description}
                      </Typography>

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

                      <Grid container spacing={1}>
                        <Grid item xs={3}>
                          <Box textAlign="center">
                            <Typography variant="h6" style={{ color: '#ED8936', fontWeight: 'bold', fontSize: '1.1rem' }}>
                              {recipe.calories}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ккал
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={3}>
                          <Box textAlign="center">
                            <Typography variant="h6" style={{ color: '#4299E1', fontWeight: 'bold', fontSize: '1.1rem' }}>
                              {recipe.protein}г
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Б
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={3}>
                          <Box textAlign="center">
                            <Typography variant="h6" style={{ color: '#38A169', fontWeight: 'bold', fontSize: '1.1rem' }}>
                              {recipe.fat}г
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Ж
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={3}>
                          <Box textAlign="center">
                            <Typography variant="h6" style={{ color: '#ED8936', fontWeight: 'bold', fontSize: '1.1rem' }}>
                              {recipe.carbs}г
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              У
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
            background: `linear-gradient(135deg, ${seasonColors[selectedSeason]} 0%, ${seasonColors[selectedSeason]}dd 100%)`,
            color: 'white',
            padding: '32px 40px',
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
              background: 'rgba(255,255,255,0.15)',
              filter: 'blur(40px)'
            }} />
            <Box style={{
              position: 'absolute',
              bottom: '-30px',
              left: '-30px',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              filter: 'blur(30px)'
            }} />
            
            <Box style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 1 }}>
              <Box style={{
                background: 'rgba(255,255,255,0.25)',
                borderRadius: '16px',
                padding: '12px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                {seasonIcons[selectedSeason]}
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
          <DialogContent style={{ padding: '32px 40px', background: 'linear-gradient(to bottom, #FAFAFA 0%, #FFFFFF 100%)' }}>
            {selectedRecipe && (
              <Box>
                <Typography variant="body1" color="text.secondary" style={{ marginBottom: '24px', fontSize: '1.1rem' }}>
                  {selectedRecipe.description}
                </Typography>

                <Divider style={{ margin: '24px 0' }} />

                <Typography variant="h6" gutterBottom style={{ fontWeight: 600, marginBottom: '16px' }}>
                  📋 Ингредиенты:
                </Typography>
                <Box style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                  {selectedRecipe.ingredients.map((ingredient, idx) => (
                    <Chip
                      key={idx}
                      label={ingredient}
                      style={{ 
                        backgroundColor: '#E8F5E9', 
                        color: '#2E8B57',
                        fontSize: '0.95rem',
                        padding: '4px 8px'
                      }}
                    />
                  ))}
                </Box>

                <Divider style={{ margin: '24px 0' }} />

                <Typography variant="h6" gutterBottom style={{ fontWeight: 600, marginBottom: '20px' }}>
                  🥗 Пищевая ценность:
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={6} md={3}>
                    <Card style={{ 
                      background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                      color: 'white',
                      textAlign: 'center',
                      padding: '20px',
                      borderRadius: '16px'
                    }}>
                      <Typography variant="h4" style={{ fontWeight: 800, marginBottom: '4px' }}>
                        {selectedRecipe.calories}
                      </Typography>
                      <Typography variant="body2" style={{ opacity: 0.9 }}>
                        ккал
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Card style={{ 
                      background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                      color: 'white',
                      textAlign: 'center',
                      padding: '20px',
                      borderRadius: '16px'
                    }}>
                      <Typography variant="h4" style={{ fontWeight: 800, marginBottom: '4px' }}>
                        {selectedRecipe.protein}г
                      </Typography>
                      <Typography variant="body2" style={{ opacity: 0.9 }}>
                        Белки
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Card style={{ 
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      color: 'white',
                      textAlign: 'center',
                      padding: '20px',
                      borderRadius: '16px'
                    }}>
                      <Typography variant="h4" style={{ fontWeight: 800, marginBottom: '4px' }}>
                        {selectedRecipe.fat}г
                      </Typography>
                      <Typography variant="body2" style={{ opacity: 0.9 }}>
                        Жиры
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Card style={{ 
                      background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                      color: 'white',
                      textAlign: 'center',
                      padding: '20px',
                      borderRadius: '16px'
                    }}>
                      <Typography variant="h4" style={{ fontWeight: 800, marginBottom: '4px' }}>
                        {selectedRecipe.carbs}г
                      </Typography>
                      <Typography variant="body2" style={{ opacity: 0.9 }}>
                        Углеводы
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions style={{ 
            padding: '24px 40px', 
            justifyContent: 'center',
            background: 'linear-gradient(to top, #F9FAFB 0%, #FFFFFF 100%)',
            borderTop: '1px solid rgba(0,0,0,0.05)'
          }}>
            <Button 
              onClick={handleCloseRecipe}
              variant="contained"
              style={{
                background: `linear-gradient(135deg, ${seasonColors[selectedSeason]} 0%, ${seasonColors[selectedSeason]}dd 100%)`,
                color: 'white',
                borderRadius: '16px',
                padding: '14px 48px',
                fontWeight: 700,
                fontSize: '1.1rem',
                boxShadow: `0 8px 24px ${seasonColors[selectedSeason]}40`,
                textTransform: 'none',
                transition: 'all 0.3s ease'
              }}
              sx={{
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 12px 32px ${seasonColors[selectedSeason]}50`,
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

export default SeasonalMenuPage;

