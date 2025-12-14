import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Avatar,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Person,
  Email,
  CalendarToday,
  LocalHospital,
  Restaurant,
  Edit,
  Save,
  Cancel,
  FitnessCenter,
  TrendingDown,
  TrendingUp,
  Favorite,
  FavoriteBorder,
  Close,
  ExpandMore
} from '@mui/icons-material';
import { StorageService } from '../utils/storage';
import { getAvatarOptions, getAvatar } from '../utils/imageUtils';

const diseases = [
  { value: 'gastritis', label: '🥣 Гастрит (повышенная кислотность)' },
  { value: 'diabetes', label: '🍎 Сахарный диабет 2 типа' },
  { value: 'obesity', label: '⚖️ Ожирение' },
  { value: 'anemia', label: '🩸 Анемия (железодефицитная)' },
  { value: 'hypertension', label: '❤️ Гипертония' },
  { value: 'hypothyroidism', label: '🦋 Гипотиреоз' },
  { value: 'hyperthyroidism', label: '⚡ Гипертиреоз' },
  { value: 'cholecystitis', label: '🟡 Холецистит' },
  { value: 'pancreatitis', label: '🔶 Панкреатит' },
  { value: 'colitis', label: '🟠 Колит' },
  { value: 'gout', label: '🟣 Подагра' },
  { value: 'osteoporosis', label: '🦴 Остеопороз' },
  { value: 'arthritis', label: '🦵 Артрит' },
  { value: 'celiac', label: '🌾 Целиакия' },
  { value: 'lactose_intolerance', label: '🥛 Непереносимость лактозы' },
  { value: 'ibs', label: '💊 Синдром раздраженного кишечника' },
  { value: 'crohns', label: '🔴 Болезнь Крона' },
  { value: 'ulcer', label: '🟥 Язвенная болезнь желудка' },
  { value: 'kidney_disease', label: '🫘 Заболевания почек' },
  { value: 'heart_disease', label: '❤️ Заболевания сердца' },
  { value: 'liver_disease', label: '🟢 Заболевания печени' },
  { value: 'asthma', label: '🌬️ Бронхиальная астма' },
  { value: 'copd', label: '🫁 ХОБЛ' },
  { value: 'migraine', label: '💢 Мигрень' },
  { value: 'epilepsy', label: '⚡ Эпилепсия' },
  { value: 'depression', label: '💙 Депрессия' },
  { value: 'anxiety', label: '😰 Тревожное расстройство' },
  { value: 'pcos', label: '🌸 Синдром поликистозных яичников' },
  { value: 'endometriosis', label: '🌺 Эндометриоз' },
  { value: 'pregnancy', label: '🤰 Беременность' },
  { value: 'menopause', label: '🌙 Менопауза' },
  { value: 'adhd', label: '🧠 СДВГ' },
  { value: 'autism', label: '🌈 Расстройство аутистического спектра' },
  { value: 'fibromyalgia', label: '💜 Фибромиалгия' },
  { value: 'none', label: 'Нет заболеваний' }
];

const goals = [
  { value: 'weight_loss', label: '⚖️ Похудение', icon: <TrendingDown /> },
  { value: 'weight_gain', label: '💪 Набор массы', icon: <TrendingUp /> },
  { value: 'maintain', label: '🔄 Поддержание веса', icon: <FitnessCenter /> }
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: localStorage.getItem('userName') || 'Пользователь',
    email: localStorage.getItem('userEmail') || '',
    age: localStorage.getItem('userAge') || '',
    weight: localStorage.getItem('userWeight') || '',
    height: localStorage.getItem('userHeight') || '',
    disease: localStorage.getItem('userDisease') || '',
    goal: localStorage.getItem('userGoal') || '',
    joinDate: 'Сегодня',
    plansCreated: 0,
    favoriteRecipes: 0
  });
  const [recentPlans, setRecentPlans] = useState([]);
  const [favoritePlans, setFavoritePlans] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [planViewDialogOpen, setPlanViewDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    age: '',
    weight: '',
    height: '',
    disease: '',
    goal: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadUserData();
    loadUserPlans();
    loadFavoritePlans();
    loadFavoriteRecipes();
  }, []);

  const loadFavoriteRecipes = () => {
    const favorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
    setUserData(prev => ({ ...prev, favoriteRecipes: favorites.length }));
  };

  // Слушаем изменения избранных рецептов
  useEffect(() => {
    const handleStorageChange = () => {
      loadFavoriteRecipes();
    };
    
    window.addEventListener('favoriteRecipesChanged', handleStorageChange);
    return () => {
      window.removeEventListener('favoriteRecipesChanged', handleStorageChange);
    };
  }, []);

  const loadFavoritePlans = () => {
    const favorites = JSON.parse(localStorage.getItem('favoritePlans') || '[]');
    setFavoritePlans(favorites);
  };

  const toggleFavoritePlan = (planId) => {
    const favorites = JSON.parse(localStorage.getItem('favoritePlans') || '[]');
    const index = favorites.indexOf(planId);
    
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(planId);
    }
    
    localStorage.setItem('favoritePlans', JSON.stringify(favorites));
    setFavoritePlans(favorites);
  };

  const isPlanFavorite = (planId) => {
    return favoritePlans.includes(planId);
  };

  const handleOpenPlanView = async (planId) => {
    const plans = await StorageService.getPlans();
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      setSelectedPlan(plan);
      setPlanViewDialogOpen(true);
    }
  };

  const getDiseaseLabel = (diseaseValue) => {
    if (!diseaseValue) return 'Не указано';
    if (typeof diseaseValue === 'object' && diseaseValue.name) {
      return diseaseValue.name;
    }
    const disease = diseases.find(d => d.value === diseaseValue);
    return disease ? disease.label : diseaseValue;
  };

  const getDiseaseColor = (disease) => {
    const diseaseColors = {
      'gastritis': 'success',
      'diabetes': 'error',
      'obesity': 'warning',
      'anemia': 'secondary',
      'hypertension': 'info'
    };
    return diseaseColors[disease] || 'default';
  };

  const loadUserData = async () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      const users = await StorageService.getUsers();
      const user = users.find(u => u.id === userId);
      if (user) {
        const disease = user.disease || localStorage.getItem('userDisease') || '';
        const goal = user.goal || localStorage.getItem('userGoal') || '';
        
        setUserData({
          name: user.name,
          email: user.email,
          age: user.age || '',
          weight: user.weight || '',
          height: user.height || '',
          disease: disease,
          goal: goal,
          joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : 'Сегодня',
          plansCreated: 0
        });
        
        // Сохраняем в localStorage для быстрого доступа
        if (disease) localStorage.setItem('userDisease', disease);
        if (goal) localStorage.setItem('userGoal', goal);
      }
    } else {
      // Если пользователь не найден в базе, загружаем из localStorage
      const disease = localStorage.getItem('userDisease') || '';
      const goal = localStorage.getItem('userGoal') || '';
      setUserData(prev => ({
        ...prev,
        disease: disease,
        goal: goal
      }));
    }
  };

  const handleOpenEditDialog = () => {
    setEditForm({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      weight: userData.weight,
      height: userData.height,
      disease: userData.disease || '',
      goal: userData.goal || ''
    });
    setEditDialogOpen(true);
    setError('');
    setSuccess('');
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setError('');
    setSuccess('');
  };

  const handleSaveProfile = async () => {
    // Валидация
    if (!editForm.name.trim()) {
      setError('Имя обязательно для заполнения');
      return;
    }
    
    if (!editForm.email.trim()) {
      setError('Email обязателен для заполнения');
      return;
    }
    
    if (!editForm.disease) {
      setError('Основное заболевание обязательно для указания');
      return;
    }
    
    if (!editForm.goal) {
      setError('Цель (похудение/набор массы) обязательна для указания');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const userId = localStorage.getItem('userId');
      
      if (userId) {
        // Обновляем пользователя в базе
        const updatedUser = await StorageService.updateUser(userId, {
          name: editForm.name,
          email: editForm.email,
          age: editForm.age ? parseInt(editForm.age) : null,
          weight: editForm.weight ? parseFloat(editForm.weight) : null,
          height: editForm.height ? parseFloat(editForm.height) : null,
          disease: editForm.disease,
          goal: editForm.goal
        });

        if (updatedUser) {
          // Обновляем localStorage
          localStorage.setItem('userName', editForm.name);
          localStorage.setItem('userEmail', editForm.email);
          localStorage.setItem('userAge', editForm.age);
          localStorage.setItem('userWeight', editForm.weight);
          localStorage.setItem('userHeight', editForm.height);
          localStorage.setItem('userDisease', editForm.disease);
          localStorage.setItem('userGoal', editForm.goal);

          // Обновляем состояние
          setUserData(prev => ({
            ...prev,
            name: editForm.name,
            email: editForm.email,
            age: editForm.age,
            weight: editForm.weight,
            height: editForm.height,
            disease: editForm.disease,
            goal: editForm.goal
          }));

          setSuccess('Профиль успешно обновлен!');
          setTimeout(() => {
            handleCloseEditDialog();
          }, 1000);
        } else {
          setError('Не удалось обновить профиль');
        }
      } else {
        // Если пользователя нет в базе, сохраняем только в localStorage
        localStorage.setItem('userName', editForm.name);
        localStorage.setItem('userEmail', editForm.email);
        localStorage.setItem('userAge', editForm.age);
        localStorage.setItem('userWeight', editForm.weight);
        localStorage.setItem('userHeight', editForm.height);
        localStorage.setItem('userDisease', editForm.disease);
        localStorage.setItem('userGoal', editForm.goal);

        setUserData(prev => ({
          ...prev,
          name: editForm.name,
          email: editForm.email,
          age: editForm.age,
          weight: editForm.weight,
          height: editForm.height,
          disease: editForm.disease,
          goal: editForm.goal
        }));

        setSuccess('Профиль успешно обновлен!');
        setTimeout(() => {
          handleCloseEditDialog();
        }, 1000);
      }
    } catch (error) {
      console.error('Ошибка сохранения профиля:', error);
      setError('Ошибка при сохранении профиля');
    } finally {
      setLoading(false);
    }
  };

  const loadUserPlans = async () => {
    const plans = await StorageService.getPlans();
    const userId = localStorage.getItem('userId');
    // Фильтруем планы по пользователю (если есть связь) или показываем все
    const userPlans = plans.slice(0, 5); // Последние 5 планов
    setRecentPlans(userPlans.map(plan => ({
      id: plan.id,
      name: plan.name,
      date: plan.createdAt ? new Date(plan.createdAt).toLocaleDateString('ru-RU') : 'Недавно',
      disease: plan.disease,
      fullPlan: plan
    })));
    setUserData(prev => ({ ...prev, plansCreated: plans.length }));
  };

  return (
    <Container maxWidth="lg" sx={{ padding: { xs: '16px 0', md: '32px 0' } }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold',
          fontSize: { xs: '1.5rem', md: '2.125rem' },
          px: { xs: 2, md: 0 }
        }}
      >
        👤 Профиль пользователя
      </Typography>

      <Grid container spacing={{ xs: 2, md: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{
            padding: { xs: '16px', md: '24px' },
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <Avatar
              src={userData.avatarUrl}
              onClick={() => setAvatarDialogOpen(true)}
              sx={{ 
                cursor: 'pointer', 
                '&:hover': { opacity: 0.8, transform: 'scale(1.05)' },
                transition: 'all 0.3s ease',
                width: 100,
                height: 100,
                margin: '0 auto 16px auto',
                backgroundColor: '#2E8B57',
                fontSize: '2rem'
              }}
            >
              {!userData.avatarUrl && userData.name.split(' ').map(n => n[0]).join('')}
            </Avatar>
            <Typography variant="caption" style={{ display: 'block', textAlign: 'center', color: '#666', marginBottom: '16px' }}>
              Нажмите на аватар, чтобы изменить
            </Typography>
            
            <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold' }}>
              {userData.name}
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <Email />
                </ListItemIcon>
                <ListItemText primary="Email" secondary={userData.email} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CalendarToday />
                </ListItemIcon>
                <ListItemText primary="Дата регистрации" secondary={userData.joinDate} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LocalHospital />
                </ListItemIcon>
                <ListItemText 
                  primary="Основное заболевание" 
                  secondary={userData.disease ? diseases.find(d => d.value === userData.disease)?.label || userData.disease : 'Не указано'} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <FitnessCenter />
                </ListItemIcon>
                <ListItemText 
                  primary="Цель" 
                  secondary={userData.goal ? goals.find(g => g.value === userData.goal)?.label || userData.goal : 'Не указано'} 
                />
              </ListItem>
              {userData.age && (
                <ListItem>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText primary="Возраст" secondary={`${userData.age} лет`} />
                </ListItem>
              )}
              {userData.weight && userData.height && (
                <ListItem>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Параметры" 
                    secondary={`Вес: ${userData.weight} кг, Рост: ${userData.height} см`} 
                  />
                </ListItem>
              )}
            </List>

            <Button 
              variant="contained" 
              fullWidth 
              style={{ marginTop: '16px' }}
              startIcon={<Edit />}
              onClick={handleOpenEditDialog}
            >
              Редактировать профиль
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} md={6}>
              <Card style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}>
                <CardContent style={{ textAlign: 'center' }}>
                  <Restaurant style={{ fontSize: 48, color: '#2E8B57', marginBottom: '8px' }} />
                  <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                    {userData.plansCreated}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Созданных планов
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}>
                <CardContent style={{ textAlign: 'center' }}>
                  <Person style={{ fontSize: 48, color: '#3182CE', marginBottom: '8px' }} />
                  <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                    {userData.favoriteRecipes}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Любимых рецептов
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Paper style={{ 
                padding: '24px',
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}>
                <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold' }}>
                  📋 Последние планы питания
                </Typography>
                <List>
                  {recentPlans.map((plan) => (
                    <ListItem key={plan.id} divider>
                      <ListItemText
                        primary={plan.name}
                        secondary={`Создан: ${plan.date}`}
                      />
                      <Box style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={() => toggleFavoritePlan(plan.id)}
                          style={{
                            color: isPlanFavorite(plan.id) ? '#EF4444' : '#9CA3AF'
                          }}
                        >
                          {isPlanFavorite(plan.id) ? <Favorite /> : <FavoriteBorder />}
                        </IconButton>
                        <Button 
                          variant="outlined" 
                          size="small"
                          onClick={() => handleOpenPlanView(plan.id)}
                          style={{
                            borderColor: '#10B981',
                            color: '#10B981'
                          }}
                          sx={{
                            '&:hover': {
                              borderColor: '#059669',
                              backgroundColor: 'rgba(16, 185, 129, 0.1)'
                            }
                          }}
                        >
                          Открыть
                        </Button>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Диалог редактирования профиля */}
      <Dialog 
        open={editDialogOpen} 
        onClose={handleCloseEditDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: '24px',
            padding: '0'
          }
        }}
      >
        <DialogTitle style={{ 
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          color: 'white',
          padding: '24px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Edit />
          <Typography variant="h5" style={{ fontWeight: 700 }}>
            Редактирование профиля
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ padding: { xs: '16px', md: '32px' }, maxHeight: { xs: 'calc(100vh - 200px)', md: '70vh' }, overflow: 'auto' }}>
          {error && (
            <Alert severity="error" sx={{ marginBottom: { xs: '16px', md: '24px' } }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ marginBottom: { xs: '16px', md: '24px' } }}>
              {success}
            </Alert>
          )}

          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Имя *"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email *"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Возраст"
                type="number"
                value={editForm.age}
                onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                inputProps={{ min: 1, max: 120 }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Вес (кг)"
                type="number"
                value={editForm.weight}
                onChange={(e) => setEditForm({ ...editForm, weight: e.target.value })}
                inputProps={{ min: 1, max: 300, step: 0.1 }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Рост (см)"
                type="number"
                value={editForm.height}
                onChange={(e) => setEditForm({ ...editForm, height: e.target.value })}
                inputProps={{ min: 50, max: 250 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Основное заболевание *</InputLabel>
                <Select
                  value={editForm.disease}
                  onChange={(e) => setEditForm({ ...editForm, disease: e.target.value })}
                  label="Основное заболевание *"
                >
                  {diseases.map((disease) => (
                    <MenuItem key={disease.value} value={disease.value}>
                      {disease.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Цель *</InputLabel>
                <Select
                  value={editForm.goal}
                  onChange={(e) => setEditForm({ ...editForm, goal: e.target.value })}
                  label="Цель *"
                >
                  {goals.map((goal) => (
                    <MenuItem key={goal.value} value={goal.value}>
                      <Box display="flex" alignItems="center" gap={1}>
                        {goal.icon}
                        {goal.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ padding: { xs: '16px', md: '24px 32px' }, justifyContent: 'space-between', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 0 } }}>
          <Button 
            onClick={handleCloseEditDialog}
            variant="outlined"
            startIcon={<Cancel />}
            disabled={loading}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleSaveProfile}
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <Save />}
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: 'white'
            }}
          >
            {loading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог выбора аватара */}
      <Dialog 
        open={avatarDialogOpen} 
        onClose={() => setAvatarDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Выберите аватар</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} style={{ marginTop: '8px' }}>
            {getAvatarOptions().map((avatarUrl, index) => (
              <Grid item xs={4} sm={3} key={index}>
                <Avatar
                  src={avatarUrl}
                  onClick={() => {
                    const newAvatarUrl = avatarUrl;
                    setUserData(prev => ({ ...prev, avatarUrl: newAvatarUrl }));
                    localStorage.setItem('userAvatarUrl', newAvatarUrl);
                    const userId = localStorage.getItem('userId');
                    if (userId) {
                      StorageService.updateUser(userId, { avatarUrl: newAvatarUrl });
                    }
                    setAvatarDialogOpen(false);
                  }}
                  sx={{
                    width: 80,
                    height: 80,
                    cursor: 'pointer',
                    border: userData.avatarUrl === avatarUrl ? '3px solid #10B981' : '3px solid transparent',
                    '&:hover': { transform: 'scale(1.1)', border: '3px solid #10B981' },
                    transition: 'all 0.3s ease',
                    margin: '0 auto'
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAvatarDialogOpen(false)}>Закрыть</Button>
        </DialogActions>
      </Dialog>

      {/* Диалог просмотра плана */}
      <Dialog 
        open={planViewDialogOpen} 
        onClose={() => setPlanViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: '24px',
            padding: '0'
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          color: 'white',
          padding: { xs: '16px', md: '24px 32px' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Restaurant />
            <Typography variant="h5" style={{ fontWeight: 700 }}>
              {selectedPlan?.name || 'План питания'}
            </Typography>
          </Box>
          <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconButton
              onClick={() => selectedPlan && toggleFavoritePlan(selectedPlan.id)}
              style={{ color: 'white' }}
            >
              {selectedPlan && isPlanFavorite(selectedPlan.id) ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            <IconButton
              onClick={() => setPlanViewDialogOpen(false)}
              style={{ color: 'white' }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ padding: { xs: '16px', md: '32px' }, maxHeight: { xs: 'calc(100vh - 200px)', md: '70vh' }, overflow: 'auto' }}>
          {selectedPlan && (
            <Box>
              <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid item xs={12}>
                  <Box style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    marginBottom: '16px'
                  }}>
                    <Chip 
                      label={getDiseaseLabel(selectedPlan.disease)}
                      color={getDiseaseColor(selectedPlan.disease)}
                      size="medium"
                    />
                    <Typography variant="body2" style={{ color: '#718096' }}>
                      Создан: {selectedPlan.createdAt ? new Date(selectedPlan.createdAt).toLocaleDateString('ru-RU') : 'Недавно'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card style={{
                    background: 'rgba(16, 185, 129, 0.05)',
                    padding: '16px',
                    borderRadius: '12px'
                  }}>
                    <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold' }}>
                      📊 Калории и БЖУ
                    </Typography>
                    <Box style={{ marginTop: '16px' }}>
                      <Typography variant="body1" style={{ marginBottom: '8px' }}>
                        <strong>Калории:</strong> {selectedPlan.totalCalories || 'Не указано'} ккал/день
                      </Typography>
                      <Box style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <Chip 
                          label={`Белки: ${selectedPlan.bzu?.protein || 0}g`} 
                          size="small" 
                          style={{ backgroundColor: '#667eea', color: 'white' }}
                        />
                        <Chip 
                          label={`Жиры: ${selectedPlan.bzu?.fat || 0}g`} 
                          size="small" 
                          style={{ backgroundColor: '#764ba2', color: 'white' }}
                        />
                        <Chip 
                          label={`Углеводы: ${selectedPlan.bzu?.carbs || 0}g`} 
                          size="small" 
                          style={{ backgroundColor: '#f093fb', color: 'white' }}
                        />
                      </Box>
                    </Box>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card style={{
                    background: 'rgba(59, 130, 246, 0.05)',
                    padding: '16px',
                    borderRadius: '12px'
                  }}>
                    <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold' }}>
                      📅 Период
                    </Typography>
                    <Typography variant="body1" style={{ marginTop: '16px' }}>
                      {selectedPlan.duration === 'week' ? 'Неделя' : 
                       selectedPlan.duration === 'month' ? 'Месяц' :
                       selectedPlan.duration === 'half-year' ? 'Полгода' : 
                       selectedPlan.duration === 'year' ? 'Год' : 'Не указано'}
                    </Typography>
                  </Card>
                </Grid>

                {selectedPlan.weeks && selectedPlan.weeks.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', marginTop: '16px' }}>
                      📋 Меню на неделю
                    </Typography>
                    <Box style={{ marginTop: '16px' }}>
                      {selectedPlan.weeks[0]?.days?.map((day, dayIndex) => (
                        <Accordion key={dayIndex} style={{ marginBottom: '8px' }}>
                          <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                              {day.day}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <List>
                              {day.meals?.map((meal, mealIndex) => (
                                <ListItem key={mealIndex}>
                                  <ListItemIcon>
                                    <Restaurant style={{ color: '#10B981' }} />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={meal.name}
                                    secondary={`${meal.type} • ${meal.calories} ккал • Б: ${meal.protein}g Ж: ${meal.fat}g У: ${meal.carbs}g`}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </Box>
                  </Grid>
                )}

                {selectedPlan.recommendations && (
                  <Grid item xs={12}>
                    <Card style={{
                      background: 'rgba(240, 147, 251, 0.05)',
                      padding: '16px',
                      borderRadius: '12px'
                    }}>
                      <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold' }}>
                        💡 Рекомендации
                      </Typography>
                      <Typography variant="body1" style={{ marginTop: '8px' }}>
                        {selectedPlan.recommendations}
                      </Typography>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ 
          padding: { xs: '16px', md: '24px 32px' }, 
          justifyContent: 'flex-end',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 }
        }}>
          <Button 
            onClick={() => setPlanViewDialogOpen(false)}
            variant="outlined"
            startIcon={<Close />}
            fullWidth={window.innerWidth < 600}
          >
            Закрыть
          </Button>
          <Button 
            onClick={() => {
              if (selectedPlan) {
                navigate('/plans');
                setPlanViewDialogOpen(false);
              }
            }}
            variant="contained"
            fullWidth={window.innerWidth < 600}
            sx={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: 'white'
            }}
          >
            Перейти к планам
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;