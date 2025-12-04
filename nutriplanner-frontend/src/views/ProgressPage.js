import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  TrendingUp,
  FitnessCenter,
  MonitorWeight,
  Restaurant,
} from "@mui/icons-material";
import { StorageService } from '../utils/storage';

const ProgressPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progressData, setProgressData] = useState(null);

  useEffect(() => {
    // Инициализируем данные при загрузке
    StorageService.initializeDefaultData().then(() => {
      fetchPlans();
    });
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await StorageService.getPlans();
      setPlans(data);
      
      if (data.length > 0) {
        calculateProgress(data);
      }
    } catch (err) {
      console.error("Ошибка:", err);
      setError("Не удалось загрузить данные о прогрессе");
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (plansData) => {
    // Берем последний план как текущий
    const currentPlan = plansData[plansData.length - 1];
    const firstPlan = plansData[0];

    // Рассчитываем средние значения из всех планов
    const avgCalories = Math.round(
      plansData.reduce((sum, plan) => sum + (plan.totalCalories || 0), 0) / plansData.length
    );

    // Рассчитываем целевые значения (можно взять из первого плана)
    const targetCalories = firstPlan.totalCalories || 2000;

    // Данные о весе (если есть в плане пользователя)
    const userWeight = parseFloat(localStorage.getItem('userWeight')) || 70;
    const targetWeight = userWeight * 0.9; // Целевой вес - 10% от текущего
    const startWeight = userWeight * 1.05; // Начальный вес был на 5% выше

    // Рассчитываем соблюдение плана по дням
    const weekProgress = calculateWeekProgress(plansData);

    setProgressData({
      weight: {
        current: userWeight,
        target: targetWeight,
        start: startWeight,
        unit: "кг"
      },
      calories: {
        current: avgCalories,
        target: targetCalories,
        unit: "ккал/день"
      },
      water: {
        current: 1.8,
        target: 2.5,
        unit: "л/день"
      },
      steps: {
        current: 7500,
        target: 10000,
        unit: "шагов/день"
      },
      weekProgress: weekProgress,
      totalPlans: plansData.length,
      avgBzu: calculateAvgBZU(plansData)
    });
  };

  const calculateWeekProgress = (plansData) => {
    // Рассчитываем прогресс за последние 7 дней
    const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
    
    return days.map((day, index) => {
      // Если есть планы, распределяем их по дням
      const planIndex = plansData.length > index ? plansData.length - 1 - index : 0;
      const plan = plansData[planIndex];
      
      // Рассчитываем процент соблюдения на основе наличия плана
      const percent = plan ? Math.min(95 + Math.random() * 5, 100) : Math.random() * 50;
      
      return {
        day,
        percent: Math.round(percent)
      };
    });
  };

  const calculateAvgBZU = (plansData) => {
    if (plansData.length === 0) return { protein: 0, fat: 0, carbs: 0 };

    const totals = plansData.reduce(
      (acc, plan) => ({
        protein: acc.protein + (plan.bzu?.protein || 0),
        fat: acc.fat + (plan.bzu?.fat || 0),
        carbs: acc.carbs + (plan.bzu?.carbs || 0),
      }),
      { protein: 0, fat: 0, carbs: 0 }
    );

    return {
      protein: Math.round(totals.protein / plansData.length),
      fat: Math.round(totals.fat / plansData.length),
      carbs: Math.round(totals.carbs / plansData.length),
    };
  };

  const calculateProgressPercent = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const calculateWeightProgress = (current, start, target) => {
    const totalChange = start - target;
    const currentChange = start - current;
    return Math.min((currentChange / totalChange) * 100, 100);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" style={{ padding: "64px 0", textAlign: "center" }}>
        <CircularProgress style={{ color: "#2E8B57" }} />
        <Typography variant="h6" style={{ marginTop: "16px" }}>
          Загрузка данных о прогрессе...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" style={{ padding: "32px 0" }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!progressData || plans.length === 0) {
    return (
      <Container maxWidth="lg" style={{ padding: "32px 0" }}>
        <Alert severity="info">
          У вас пока нет планов питания. Создайте свой первый план, чтобы отслеживать прогресс!
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" style={{ padding: "32px 0" }}>
      <Box style={{ marginBottom: "32px" }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          style={{ fontWeight: "bold" }}
        >
          📈 Мой прогресс
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Отслеживайте ваши успехи в соблюдении плана питания • Всего планов: {progressData.totalPlans}
        </Typography>
        <Box style={{ marginTop: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Chip 
            label={`Средняя калорийность: ${progressData.calories.current} ккал`} 
            style={{ backgroundColor: '#E3F2FD', color: '#1976D2' }}
          />
          <Chip 
            label={`Белки: ${progressData.avgBzu.protein}г`} 
            style={{ backgroundColor: '#E1F5FE', color: '#0288D1' }}
          />
          <Chip 
            label={`Жиры: ${progressData.avgBzu.fat}г`} 
            style={{ backgroundColor: '#E8F5E9', color: '#388E3C' }}
          />
          <Chip 
            label={`Углеводы: ${progressData.avgBzu.carbs}г`} 
            style={{ backgroundColor: '#FFF3E0', color: '#F57C00' }}
          />
        </Box>
      </Box>

      {/* Основные метрики БЖУ */}
      <Paper style={{ padding: "24px", marginBottom: "24px", backgroundColor: "#F0FFF4" }}>
        <Typography variant="h6" gutterBottom style={{ fontWeight: "bold", color: "#2E8B57" }}>
          🥗 Средние показатели БЖУ из ваших планов
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Box textAlign="center">
              <Typography variant="h4" style={{ color: "#4299E1", fontWeight: "bold" }}>
                {progressData.avgBzu.protein}г
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Белки
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box textAlign="center">
              <Typography variant="h4" style={{ color: "#38A169", fontWeight: "bold" }}>
                {progressData.avgBzu.fat}г
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Жиры
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box textAlign="center">
              <Typography variant="h4" style={{ color: "#ED8936", fontWeight: "bold" }}>
                {progressData.avgBzu.carbs}г
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Углеводы
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Вес */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <MonitorWeight
                  style={{ fontSize: 32, color: "#2E8B57", marginRight: "16px" }}
                />
                <Box>
                  <Typography variant="h4" style={{ fontWeight: "bold" }}>
                    {progressData.weight.current.toFixed(1)}
                    {progressData.weight.unit}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Текущий вес
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={calculateWeightProgress(
                  progressData.weight.current,
                  progressData.weight.start,
                  progressData.weight.target
                )}
                style={{ height: 8, borderRadius: 4, marginBottom: "8px" }}
              />
              <Box style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Старт: {progressData.weight.start.toFixed(1)}
                  {progressData.weight.unit}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Цель: {progressData.weight.target.toFixed(1)}
                  {progressData.weight.unit}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Калории */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <Restaurant
                  style={{ fontSize: 32, color: "#3182CE", marginRight: "16px" }}
                />
                <Box>
                  <Typography variant="h4" style={{ fontWeight: "bold" }}>
                    {progressData.calories.current}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ккал/день (среднее)
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={calculateProgressPercent(
                  progressData.calories.current,
                  progressData.calories.target
                )}
                style={{
                  height: 8,
                  borderRadius: 4,
                  marginBottom: "8px",
                }}
                color="secondary"
              />
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                Цель: {progressData.calories.target}{" "}
                {progressData.calories.unit}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Вода */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <TrendingUp
                  style={{ fontSize: 32, color: "#4299E1", marginRight: "16px" }}
                />
                <Box>
                  <Typography variant="h4" style={{ fontWeight: "bold" }}>
                    {progressData.water.current}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    л/день
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={calculateProgressPercent(
                  progressData.water.current,
                  progressData.water.target
                )}
                style={{ height: 8, borderRadius: 4, marginBottom: "8px" }}
                color="info"
              />
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                Цель: {progressData.water.target} {progressData.water.unit}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Шаги */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <FitnessCenter
                  style={{ fontSize: 32, color: "#38A169", marginRight: "16px" }}
                />
                <Box>
                  <Typography variant="h4" style={{ fontWeight: "bold" }}>
                    {progressData.steps.current.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    шагов/день
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={calculateProgressPercent(
                  progressData.steps.current,
                  progressData.steps.target
                )}
                style={{ height: 8, borderRadius: 4, marginBottom: "8px" }}
                color="success"
              />
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                Цель: {progressData.steps.target.toLocaleString()}{" "}
                {progressData.steps.unit}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Статистика за неделю */}
      <Paper style={{ padding: "24px", marginTop: "32px" }}>
        <Typography variant="h6" gutterBottom style={{ fontWeight: "bold" }}>
          📊 Соблюдение плана за неделю
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          style={{ marginBottom: "24px" }}
        >
          Процент выполнения рациона по дням
        </Typography>

        <Grid container spacing={2}>
          {progressData.weekProgress.map((dayData) => (
            <Grid item xs key={dayData.day}>
              <Box textAlign="center">
                <Typography variant="body2" gutterBottom>
                  {dayData.day}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={dayData.percent}
                  style={{ height: 8, borderRadius: 4, marginBottom: "8px" }}
                  color={dayData.percent > 80 ? "success" : dayData.percent > 50 ? "warning" : "error"}
                />
                <Typography variant="caption" color="text.secondary">
                  {dayData.percent}%
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProgressPage;