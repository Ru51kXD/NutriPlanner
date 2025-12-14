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
  CardContent
} from '@mui/material';
import { Login, PersonAdd } from '@mui/icons-material';
import { StorageService } from '../utils/storage';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('Пожалуйста, заполните все поля');
      setLoading(false);
      return;
    }

    try {
      // Ищем пользователя в localStorage
      const users = await StorageService.getUsers();
      const user = users.find(u => u.email === formData.email && u.password === formData.password);

      if (user) {
        // Успешный вход
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userEmail', user.email);
        if (user.age) localStorage.setItem('userAge', user.age);
        if (user.weight) localStorage.setItem('userWeight', user.weight);
        if (user.height) localStorage.setItem('userHeight', user.height);
        
        // Отправляем событие для обновления состояния в шапке
        window.dispatchEvent(new Event('authStateChanged'));
        
        navigate('/');
      } else {
        setError('Неверный email или пароль');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" style={{ padding: '64px 16px' }}>
      <Card elevation={8} style={{ 
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
      }}>
        <CardContent style={{ padding: '32px' }}>
          <Box textAlign="center" style={{ marginBottom: '24px' }}>
            <Login style={{ fontSize: 48, color: '#2E8B57', marginBottom: '16px' }} />
            <Typography variant="h4" component="h1" gutterBottom style={{ fontWeight: 'bold' }}>
              Вход в систему
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Войдите в свой аккаунт для доступа к персонализированным рационам
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" style={{ marginBottom: '16px' }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
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
            <TextField
              fullWidth
              label="Пароль"
              type="password"
              margin="normal"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              placeholder="Введите ваш пароль"
            />
            
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
              {loading ? 'Вход...' : 'Войти'}
            </Button>
            
            <Box style={{ textAlign: 'center', marginTop: '24px' }}>
              <Typography variant="body2" color="text.secondary">
                Нет аккаунта?{' '}
                <Button
                  component={Link}
                  to="/register"
                  startIcon={<PersonAdd />}
                  style={{ textTransform: 'none', color: '#2E8B57' }}
                >
                  Зарегистрироваться
                </Button>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LoginPage;