import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  Add,
  Restaurant,
  LocalDining
} from '@mui/icons-material';

const DiaryPage = () => {
  const [mealEntry, setMealEntry] = useState({
    type: '',
    food: '',
    calories: '',
    notes: ''
  });

  const todayMeals = [
    {
      id: 1,
      type: 'Завтрак',
      food: 'Овсяная каша с ягодами',
      calories: 350,
      time: '08:30',
      nutrients: { protein: 12, fat: 8, carbs: 55 }
    },
    {
      id: 2,
      type: 'Обед',
      food: 'Куриная грудка с овощами',
      calories: 450,
      time: '13:00',
      nutrients: { protein: 35, fat: 15, carbs: 40 }
    },
    {
      id: 3,
      type: 'Ужин',
      food: 'Рыба на пару с брокколи',
      calories: 380,
      time: '19:30',
      nutrients: { protein: 30, fat: 12, carbs: 25 }
    }
  ];

  const totalCalories = todayMeals.reduce((sum, meal) => sum + meal.calories, 0);
  const targetCalories = 2000;

  const handleAddMeal = (e) => {
    e.preventDefault();
    console.log('Adding meal:', mealEntry);
    setMealEntry({ type: '', food: '', calories: '', notes: '' });
  };

  return (
    <Container maxWidth="lg" style={{ padding: '32px 0' }}>
      <Box style={{ marginBottom: '32px' }}>
        <Typography variant="h4" component="h1" gutterBottom style={{ fontWeight: 'bold' }}>
          📖 Дневник питания
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Отслеживайте ваше ежедневное питание
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🎯 Сегодня
              </Typography>
              
              <Box style={{ textAlign: 'center', margin: '24px 0' }}>
                <Typography variant="h3" style={{ color: '#2E8B57', fontWeight: 'bold' }}>
                  {totalCalories}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  из {targetCalories} ккал
                </Typography>
              </Box>

              <LinearProgress 
                variant="determinate" 
                value={(totalCalories / targetCalories) * 100}
                style={{ height: 8, borderRadius: 4, marginBottom: '16px' }}
              />

              <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Завтрак: 350 ккал
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Обед: 450 ккал
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ужин: 380 ккал
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Paper style={{ padding: '24px', marginTop: '24px' }}>
            <Typography variant="h6" gutterBottom>
              <Add style={{ marginRight: '8px' }} />
              Добавить прием пищи
            </Typography>
            
            <Box component="form" onSubmit={handleAddMeal}>
              <TextField
                fullWidth
                label="Тип приема пищи"
                select
                margin="normal"
                value={mealEntry.type}
                onChange={(e) => setMealEntry({...mealEntry, type: e.target.value})}
                SelectProps={{
                  native: true,
                }}
              >
                <option value=""></option>
                <option value="breakfast">Завтрак</option>
                <option value="lunch">Обед</option>
                <option value="dinner">Ужин</option>
                <option value="snack">Перекус</option>
              </TextField>

              <TextField
                fullWidth
                label="Что вы съели?"
                margin="normal"
                value={mealEntry.food}
                onChange={(e) => setMealEntry({...mealEntry, food: e.target.value})}
                placeholder="Например: Овсяная каша с ягодами"
              />

              <TextField
                fullWidth
                label="Калории"
                type="number"
                margin="normal"
                value={mealEntry.calories}
                onChange={(e) => setMealEntry({...mealEntry, calories: e.target.value})}
                placeholder="350"
              />

              <TextField
                fullWidth
                label="Заметки"
                multiline
                rows={2}
                margin="normal"
                value={mealEntry.notes}
                onChange={(e) => setMealEntry({...mealEntry, notes: e.target.value})}
                placeholder="Дополнительные заметки..."
              />

              <Button 
                type="submit" 
                variant="contained" 
                fullWidth 
                style={{ marginTop: '16px' }}
              >
                Добавить
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper style={{ padding: '24px' }}>
            <Typography variant="h6" gutterBottom>
              <LocalDining style={{ marginRight: '8px' }} />
              Приемы пищи за сегодня
            </Typography>

            {todayMeals.map((meal) => (
              <Card key={meal.id} style={{ marginBottom: '16px', borderLeft: '4px solid', borderColor: '#2E8B57' }}>
                <CardContent>
                  <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <Box>
                      <Typography variant="h6" component="h3">
                        {meal.type}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {meal.time} • {meal.food}
                      </Typography>
                    </Box>
                    <Chip 
                      label={`${meal.calories} ккал`}
                      style={{ backgroundColor: '#2E8B57', color: 'white' }}
                      variant="outlined"
                    />
                  </Box>

                  <Box style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <Chip label={`Б: ${meal.nutrients.protein}g`} size="small" />
                    <Chip label={`Ж: ${meal.nutrients.fat}g`} size="small" />
                    <Chip label={`У: ${meal.nutrients.carbs}g`} size="small" />
                  </Box>
                </CardContent>
              </Card>
            ))}

            {todayMeals.length === 0 && (
              <Box textAlign="center" style={{ padding: '32px 0' }}>
                <Restaurant style={{ fontSize: 48, color: 'text.secondary', marginBottom: '16px' }} />
                <Typography variant="h6" gutterBottom>
                  Пока нет записей о питании
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Добавьте ваш первый прием пищи
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DiaryPage;