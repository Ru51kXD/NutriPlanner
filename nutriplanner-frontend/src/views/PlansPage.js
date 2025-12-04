import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Restaurant,
  CalendarToday,
  LocalHospital,
  Share,
  Visibility,
  Delete,
  ExpandMore,
  Close
} from '@mui/icons-material';
import { StorageService } from '../utils/storage';

const PlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  // Данные заболеваний для отображения
  const diseasesData = [
    { value: 'gastritis', label: '🥣 Гастрит', goal: 'снизить раздражение слизистой', bzu: { protein: 90, fat: 70, carbs: 350 }, calories: 2400, vitamins: 'A, E, B2, B6' },
    { value: 'diabetes', label: '🍎 Диабет', goal: 'стабилизировать уровень глюкозы', bzu: { protein: 100, fat: 80, carbs: 200 }, calories: 2000, vitamins: 'хром, магний, витамин D' },
    { value: 'obesity', label: '⚖️ Ожирение', goal: 'снижение калорийности', bzu: { protein: 120, fat: 60, carbs: 150 }, calories: 1700, vitamins: 'D, C, цинк, L-карнитин' },
    { value: 'anemia', label: '🩸 Анемия', goal: 'повысить уровень железа', bzu: { protein: 100, fat: 80, carbs: 300 }, calories: 2300, vitamins: 'железо, витамин C, фолиевая кислота' },
    { value: 'hypertension', label: '❤️ Гипертония', goal: 'снизить давление', bzu: { protein: 90, fat: 65, carbs: 300 }, calories: 2200, vitamins: 'магний, калий, коэнзим Q10' }
  ];

  useEffect(() => {
    // Инициализируем данные при загрузке
    StorageService.initializeDefaultData().then(() => {
      loadPlans();
    });
  }, []);

  const loadPlans = async () => {
    try {
      const data = await StorageService.getPlans();
      console.log("Загруженные планы из localStorage:", data);
      setPlans(data);
    } catch (error) {
      console.error("Ошибка загрузки:", error);
    }
  };

  // Удаление плана
  const deletePlanFromServer = async (planId) => {
    try {
      await StorageService.deletePlan(planId);
      setPlans((prev) => prev.filter((p) => p.id !== planId));
      console.log("План удален:", planId);
    } catch (error) {
      console.error("Ошибка удаления:", error);
    }
  };

  const viewPlan = (plan) => {
    setSelectedPlan(plan);
    setViewDialog(true);
  };

  const deletePlan = (planId) => {
    deletePlanFromServer(planId);
  };

  const sharePlan = (plan) => {
    navigator.clipboard.writeText(`Мой план питания: ${plan.name}`);
    setSnackbar({ open: true, message: '✅ Ссылка на план скопирована в буфер обмена!' });
  };

  const getDiseaseColor = (disease) => {
    const colors = {
      'gastritis': 'success',
      'diabetes': 'error',
      'obesity': 'warning',
      'anemia': 'secondary',
      'hypertension': 'info'
    };
    return colors[disease] || 'default';
  };

const getDiseaseLabel = (diseaseValue) => {
  if (!diseaseValue) return 'Не указано';

  // Если disease — объект (из БД), взять поле name
  if (typeof diseaseValue === 'object' && diseaseValue.name) {
    return diseaseValue.name;
  }

  // Иначе — это строка (‘diabetes’ и т.п.)
  const disease = diseasesData.find(d => d.value === diseaseValue);
  return disease ? disease.label : diseaseValue;
};


  const getDiseaseInfo = (diseaseValue) => {
    return diseasesData.find(d => d.value === diseaseValue) || {};
  };

  return (
    <Container maxWidth="lg" style={{ padding: '32px 0', minHeight: '80vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Box style={{ marginBottom: '32px', textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom style={{ fontWeight: 'bold', color: '#2D3748' }}>
          📋 Мои планы питания
        </Typography>
        <Typography variant="body1" style={{ color: '#718096' }}>
          Все созданные вами индивидуальные рационы питания
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {plans.map((plan, index) => {
          const diseaseInfo = getDiseaseInfo(plan.disease) || {};
          const bzu = plan.bzu || diseaseInfo.bzu || { protein: 0, fat: 0, carbs: 0 };
          const calories = plan.totalCalories || diseaseInfo.calories || 0;
          
          return (
            <Grid 
              item 
              xs={12} 
              md={6} 
              key={plan.id}
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              <Card style={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer'
              }}
              sx={{
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.15)'
                }
              }}>
                <CardContent style={{ flexGrow: 1 }}>
                  <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <Typography variant="h6" component="h2" gutterBottom style={{ fontWeight: 'bold', color: '#2D3748' }}>
                      {plan.name}
                    </Typography>
                    <Chip 
                      label={getDiseaseLabel(plan.disease)}
                      color={getDiseaseColor(plan.disease)}
                      size="small"
                    />
                  </Box>

                  <Box style={{ marginBottom: '16px' }}>
                    <Box style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <CalendarToday style={{ fontSize: 16, marginRight: '8px', color: '#718096' }} />
                      <Typography variant="body2" style={{ color: '#718096' }}>
                        Период: {plan.duration === 'week' ? 'Неделя' : 
                                plan.duration === 'month' ? 'Месяц' :
                                plan.duration === 'half-year' ? 'Полгода' : 'Год'}
                      </Typography>
                    </Box>
                    <Box style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <Restaurant style={{ fontSize: 16, marginRight: '8px', color: '#718096' }} />
                      <Typography variant="body2" style={{ color: '#718096' }}>
                        {calories} ккал/день
                      </Typography>
                    </Box>
                    <Box style={{ display: 'flex', alignItems: 'center' }}>
                      <LocalHospital style={{ fontSize: 16, marginRight: '8px', color: '#718096' }} />
                      <Typography variant="body2" style={{ color: '#718096' }}>
                        Создан: {new Date(plan.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>

                  <Box style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    <Chip 
                      label={`Б: ${bzu.protein}g`} 
                      size="small" 
                      variant="outlined" 
                      style={{ borderColor: '#667eea', color: '#667eea' }}
                    />
                    <Chip 
                      label={`Ж: ${bzu.fat}g`} 
                      size="small" 
                      variant="outlined" 
                      style={{ borderColor: '#764ba2', color: '#764ba2' }}
                    />
                    <Chip 
                      label={`У: ${bzu.carbs}g`} 
                      size="small" 
                      variant="outlined" 
                      style={{ borderColor: '#f093fb', color: '#f093fb' }}
                    />
                  </Box>

                  <Typography variant="body2" style={{ color: '#4A5568', fontStyle: 'italic' }}>
                    {plan.recommendations || diseaseInfo.goal || 'Индивидуальные рекомендации по питанию'}
                  </Typography>
                </CardContent>

                <CardActions style={{ justifyContent: 'space-between', padding: '16px', borderTop: '1px solid #E2E8F0' }}>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<Visibility />}
                    onClick={() => viewPlan(plan)}
                    style={{ borderColor: '#667eea', color: '#667eea' }}
                  >
                    Просмотреть
                  </Button>
                  <Box style={{ display: 'flex', gap: '8px' }}>
                    <Button 
                      startIcon={<Share />} 
                      size="small"
                      onClick={() => sharePlan(plan)}
                      style={{ color: '#718096' }}
                    >
                      Поделиться
                    </Button>
                    <Button 
                      startIcon={<Delete />} 
                      size="small"
                      onClick={() => deletePlan(plan.id)}
                      style={{ color: '#E53E3E' }}
                    >
                      Удалить
                    </Button>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {plans.length === 0 && (
        <Box textAlign="center" style={{ padding: '80px 0' }}>
          <Restaurant style={{ fontSize: 96, color: '#A0AEC0', marginBottom: '24px', opacity: 0.5 }} />
          <Typography variant="h5" gutterBottom style={{ color: '#718096', fontWeight: 'bold' }}>
            У вас пока нет созданных планов
          </Typography>
          <Typography variant="body1" style={{ color: '#A0AEC0', marginBottom: '32px' }}>
            Создайте свой первый индивидуальный рацион питания
          </Typography>
          <Button 
            variant="contained" 
            href="/generator"
            style={{ 
              background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
              padding: '12px 32px',
              fontSize: '1.1rem',
              borderRadius: '25px'
            }}
          >
            Создать рацион
          </Button>
        </Box>
      )}

      {/* Диалог просмотра плана */}
      <Dialog 
        open={viewDialog} 
        onClose={() => setViewDialog(false)} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          style: {
            borderRadius: '28px',
            padding: '0',
            overflow: 'hidden',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
            background: 'linear-gradient(to bottom, #FAFAFA 0%, #FFFFFF 100%)'
          }
        }}
      >
        <DialogTitle style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
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
              <Typography variant="h4" style={{ margin: 0, fontSize: '2rem' }}>🍽️</Typography>
            </Box>
            <Box>
              <Typography variant="h4" style={{ fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '4px' }}>
                {selectedPlan?.name}
              </Typography>
              <Typography variant="body1" style={{ opacity: 0.95, fontWeight: 500 }}>
                Детальный просмотр рациона питания
              </Typography>
            </Box>
          </Box>
          <IconButton 
            onClick={() => setViewDialog(false)} 
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
          {selectedPlan && (() => {
            const diseaseInfo = getDiseaseInfo(selectedPlan.disease) || {};
            const bzu = selectedPlan.bzu || diseaseInfo.bzu || { protein: 0, fat: 0, carbs: 0 };
            const calories = selectedPlan.totalCalories || diseaseInfo.calories || 0;
            
            return (
              <Box>
                {/* Основная информация */}
                <Grid container spacing={3} style={{ marginBottom: '32px' }}>
                  <Grid item xs={12} md={3}>
                    <Card style={{ 
                      textAlign: 'center', 
                      padding: '28px 20px', 
                      background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                      color: 'white',
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
                      <Typography variant="h3" style={{ fontWeight: 900, marginBottom: '8px', position: 'relative', zIndex: 1, textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                        {calories}
                      </Typography>
                      <Typography variant="body1" style={{ opacity: 0.95, fontWeight: 600, position: 'relative', zIndex: 1 }}>ккал/день</Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card style={{ 
                      textAlign: 'center', 
                      padding: '28px 20px', 
                      background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                      color: 'white',
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
                      <Typography variant="h3" style={{ fontWeight: 900, marginBottom: '8px', position: 'relative', zIndex: 1, textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                        {bzu.protein}
                      </Typography>
                      <Typography variant="body1" style={{ opacity: 0.95, fontWeight: 600, position: 'relative', zIndex: 1 }}>Белки (г)</Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card style={{ 
                      textAlign: 'center', 
                      padding: '28px 20px', 
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      color: 'white',
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
                      <Typography variant="h3" style={{ fontWeight: 900, marginBottom: '8px', position: 'relative', zIndex: 1, textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                        {bzu.fat}
                      </Typography>
                      <Typography variant="body1" style={{ opacity: 0.95, fontWeight: 600, position: 'relative', zIndex: 1 }}>Жиры (г)</Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card style={{ 
                      textAlign: 'center', 
                      padding: '28px 20px', 
                      background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                      color: 'white',
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
                      <Typography variant="h3" style={{ fontWeight: 900, marginBottom: '8px', position: 'relative', zIndex: 1, textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                        {bzu.carbs}
                      </Typography>
                      <Typography variant="body1" style={{ opacity: 0.95, fontWeight: 600, position: 'relative', zIndex: 1 }}>Углеводы (г)</Typography>
                    </Card>
                  </Grid>
                </Grid>

                {/* Детали плана */}
                <Grid container spacing={2} style={{ marginBottom: '24px' }}>
                  <Grid item xs={12} md={6}>
                    <Card style={{ padding: '16px' }}>
                      <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold' }}>📋 Информация о плане</Typography>
                      <Typography><strong>Заболевание:</strong> {getDiseaseLabel(selectedPlan.disease)}</Typography>
                      <Typography><strong>Период:</strong> {
                        selectedPlan.duration === 'week' ? 'Неделя' : 
                        selectedPlan.duration === 'month' ? 'Месяц' :
                        selectedPlan.duration === 'half-year' ? 'Полгода' : 'Год'
                      }</Typography>
                      <Typography><strong>Дата создания:</strong> {new Date(selectedPlan.createdAt).toLocaleDateString()}</Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card style={{ padding: '16px' }}>
                      <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold' }}>💊 Рекомендации</Typography>
                      <Typography><strong>Основная цель:</strong> {diseaseInfo.goal || 'Не указана'}</Typography>
                      <Typography><strong>Витамины:</strong> {selectedPlan.vitamins || diseaseInfo.vitamins || 'Не указаны'}</Typography>
                      <Typography><strong>Рекомендации:</strong> {selectedPlan.recommendations || diseaseInfo.goal || 'Индивидуальные рекомендации'}</Typography>
                    </Card>
                  </Grid>
                </Grid>

                {/* Питание по дням */}
                <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', marginBottom: '16px' }}>
                  📅 План питания
                </Typography>
                
                {(selectedPlan.dailyMeals || []).length > 0 ? (
                  selectedPlan.dailyMeals.map((dayMeals, dayIndex) => (
                    <Accordion key={dayIndex} style={{ marginBottom: '8px' }}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="h6" style={{ fontWeight: 'bold' }}>{dayMeals.day}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          {dayMeals.meals.map((meal, mealIndex) => (
                            <Grid item xs={12} md={6} key={mealIndex}>
                              <Card style={{ padding: '12px', borderLeft: `4px solid #667eea` }}>
                                <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                                  <Typography variant="subtitle1" style={{ fontWeight: 'bold', color: '#667eea' }}>
                                    {meal.type}
                                  </Typography>
                                  <Chip 
                                    label={`${meal.calories} ккал`} 
                                    size="small" 
                                    style={{ backgroundColor: '#667eea', color: 'white' }}
                                  />
                                </Box>
                                <Typography variant="h6" gutterBottom style={{ color: '#2D3748' }}>
                                  {meal.name}
                                </Typography>
                                <Typography variant="body2" style={{ color: '#718096', marginBottom: '12px' }}>
                                  {meal.description}
                                </Typography>
                                <Box style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                  <Chip label={`Б: ${meal.protein}g`} size="small" variant="outlined" />
                                  <Chip label={`Ж: ${meal.fat}g`} size="small" variant="outlined" />
                                  <Chip label={`У: ${meal.carbs}g`} size="small" variant="outlined" />
                                </Box>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  ))
                ) : (
                  <Card style={{ padding: '20px', textAlign: 'center' }}>
                    <Typography variant="body1" style={{ color: '#718096' }}>
                      Детальный план питания будет сгенерирован в ближайшее время
                    </Typography>
                  </Card> 
                )}
              </Box>
            );
          })()}
        </DialogContent>
        
        <DialogActions style={{ 
          padding: '24px 40px', 
          justifyContent: 'center',
          background: 'linear-gradient(to top, #F9FAFB 0%, #FFFFFF 100%)',
          borderTop: '1px solid rgba(0,0,0,0.05)',
          gap: '12px'
        }}>
          <Button 
            onClick={() => setViewDialog(false)}
            style={{
              color: '#718096',
              borderRadius: '16px',
              padding: '12px 32px',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem',
              transition: 'all 0.3s ease'
            }}
            sx={{
              '&:hover': {
                background: 'rgba(113, 128, 150, 0.1)',
                color: '#4A5568',
                transform: 'translateY(-2px)',
              }
            }}
          >
            Закрыть
          </Button>
          <Button 
            variant="contained" 
            onClick={() => sharePlan(selectedPlan)}
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: '16px',
              padding: '12px 40px',
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '1rem',
              boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
              transition: 'all 0.3s ease'
            }}
            sx={{
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 32px rgba(102, 126, 234, 0.4)',
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
              }
            }}
          >
            📤 Поделиться планом
          </Button>
        </DialogActions>
      </Dialog>

      {/* Красивое уведомление */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: 'white',
            fontWeight: 600,
            fontSize: '1rem',
            padding: '16px 24px',
            minWidth: '300px'
          }
        }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity="success"
          sx={{
            width: '100%',
            background: 'transparent',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white'
            },
            '& .MuiAlert-action': {
              color: 'white'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PlansPage;