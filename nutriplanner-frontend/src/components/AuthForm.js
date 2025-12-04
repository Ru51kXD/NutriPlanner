import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper
} from '@mui/material';

const AuthForm = ({ mode, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'register' && formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (mode === 'register' && !formData.name) {
      setError('Пожалуйста, введите имя');
      return;
    }

    onSubmit(formData);
  };

  return (
    <Paper elevation={3} style={{ padding: '32px', maxWidth: 400, margin: '0 auto' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        {mode === 'login' ? 'Вход' : 'Регистрация'}
      </Typography>

      {error && (
        <Alert severity="error" style={{ marginBottom: '16px' }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        {mode === 'register' && (
          <TextField
            fullWidth
            label="Имя"
            margin="normal"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        )}

        <TextField
          fullWidth
          label="Email"
          type="email"
          margin="normal"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />

        <TextField
          fullWidth
          label="Пароль"
          type="password"
          margin="normal"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />

        {mode === 'register' && (
          <TextField
            fullWidth
            label="Подтвердите пароль"
            type="password"
            margin="normal"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            required
          />
        )}

        <Button
          fullWidth
          variant="contained"
          size="large"
          type="submit"
          disabled={loading}
          style={{ marginTop: '24px' }}
        >
          {loading ? 'Загрузка...' : (mode === 'login' ? 'Войти' : 'Зарегистрироваться')}
        </Button>
      </Box>
    </Paper>
  );
};

export default AuthForm;