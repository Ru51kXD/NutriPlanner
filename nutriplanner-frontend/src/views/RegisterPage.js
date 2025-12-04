import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { PersonAdd, Login, TrendingDown, TrendingUp, FitnessCenter } from '@mui/icons-material';
import { StorageService } from '../utils/storage';

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

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    weight: '',
    height: '',
    disease: '',
    goal: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    if (!formData.name || !formData.email || !formData.password) {
      setError('Пожалуйста, заполните все обязательные поля');
      setLoading(false);
      return;
    }

    if (!formData.disease) {
      setError('Пожалуйста, укажите основное заболевание');
      setLoading(false);
      return;
    }

    if (!formData.goal) {
      setError('Пожалуйста, укажите цель (похудение/набор массы)');
      setLoading(false);
      return;
    }

    try {
      // Проверяем, существует ли пользователь с таким email
      const users = await StorageService.getUsers();
      const existingUser = users.find(u => u.email === formData.email);
      
      if (existingUser) {
        setError('Пользователь с таким email уже существует');
        setLoading(false);
        return;
      }

      // Создаем нового пользователя
      const newUser = {
        name: formData.name,
        email: formData.email,
        password: formData.password, // В реальном приложении нужно хешировать
        age: formData.age ? parseInt(formData.age) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        disease: formData.disease,
        goal: formData.goal
      };

      const savedUser = await StorageService.saveUser(newUser);

      // Сохраняем данные в localStorage для быстрого доступа
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userId', savedUser.id);
      localStorage.setItem('userName', savedUser.name);
      localStorage.setItem('userEmail', savedUser.email);
      if (savedUser.age) localStorage.setItem('userAge', savedUser.age.toString());
      if (savedUser.weight) localStorage.setItem('userWeight', savedUser.weight.toString());
      if (savedUser.height) localStorage.setItem('userHeight', savedUser.height.toString());
      if (savedUser.disease) localStorage.setItem('userDisease', savedUser.disease);
      if (savedUser.goal) localStorage.setItem('userGoal', savedUser.goal);

      // Отправляем событие для обновления состояния в шапке
      window.dispatchEvent(new Event('authStateChanged'));

      // Перенаправляем на главную страницу (Dashboard)
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Registration error:', err);
      setError('Ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" style={{ padding: '64px 16px' }}>
      <Card elevation={8} style={{ borderRadius: '12px' }}>
        <CardContent style={{ padding: '32px' }}>
          <Box textAlign="center" style={{ marginBottom: '24px' }}>
            <PersonAdd style={{ fontSize: 48, color: '#2E8B57', marginBottom: '16px' }} />
            <Typography variant="h4" component="h1" gutterBottom style={{ fontWeight: 'bold' }}>
              Регистрация
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Создайте аккаунт для получения персонализированных рационов питания
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" style={{ marginBottom: '16px' }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Полное имя"
                  margin="normal"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="Иван Иванов"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  margin="normal"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  placeholder="your@email.com"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Возраст"
                  type="number"
                  margin="normal"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  placeholder="25"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Пароль"
                  type="password"
                  margin="normal"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Подтвердите пароль"
                  type="password"
                  margin="normal"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Вес (кг)"
                  type="number"
                  margin="normal"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  placeholder="70"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Рост (см)"
                  type="number"
                  margin="normal"
                  value={formData.height}
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
                  placeholder="175"
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth required margin="normal">
                  <InputLabel>Основное заболевание *</InputLabel>
                  <Select
                    value={formData.disease}
                    onChange={(e) => setFormData({...formData, disease: e.target.value})}
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
                <FormControl fullWidth required margin="normal">
                  <InputLabel>Цель *</InputLabel>
                  <Select
                    value={formData.goal}
                    onChange={(e) => setFormData({...formData, goal: e.target.value})}
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
            
            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              disabled={loading}
              style={{ 
                marginTop: '24px', 
                padding: '12px',
                backgroundColor: '#2E8B57',
                color: 'white'
              }}
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
            
            <Box style={{ textAlign: 'center', marginTop: '24px' }}>
              <Typography variant="body2" color="text.secondary">
                Уже есть аккаунт?{' '}
                <Button
                  component={Link}
                  to="/login"
                  startIcon={<Login />}
                  style={{ textTransform: 'none', color: '#2E8B57' }}
                >
                  Войти
                </Button>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RegisterPage;