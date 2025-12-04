import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import background from '../assets/image111.jpg';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  Container,
  alpha
} from '@mui/material';
import {
  LocalHospital,
  CalendarToday,
  Psychology,
  Restaurant,
  People,
  TrendingUp
} from '@mui/icons-material';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleSmoothNavigation = (path) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setTimeout(() => {
      navigate(path);
    }, 400);
  };

  return (
<Box
  style={{
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
    backgroundSize: '400% 400%',
    animation: 'gradient 15s ease infinite',
    minHeight: '100vh',
    padding: '32px 0',
    position: 'relative',
    overflow: 'hidden'
  }}
>
  <style>{`
    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
    .float-animation {
      animation: float 6s ease-in-out infinite;
    }
  `}</style>
      {/* Декоративные элементы */}
      <Box
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
          opacity: 0.1
        }}
      />
      <Box
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)',
          opacity: 0.1
        }}
      />

      <Container maxWidth="lg" style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <Box textAlign="center" style={{ marginBottom: '64px', padding: '32px 0' }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            style={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #FFFFFF 30%, #E0E0E0 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              textShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            Nutrition Planner
          </Typography>
          <Typography 
            variant="h5" 
            style={{ 
              color: 'rgba(255,255,255,0.9)',
              marginBottom: '32px',
              textShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}
          >
            Индивидуальные рационы питания с учётом медицинских ограничений
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            className="float-animation"
            onClick={() => handleSmoothNavigation('/generator')}
            style={{ 
              padding: '18px 56px',
              fontSize: '1.3rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              borderRadius: '50px',
              boxShadow: '0 20px 60px rgba(16, 185, 129, 0.4)',
              textTransform: 'none',
              color: 'white',
              transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
            sx={{
              '&:hover': {
                transform: 'translateY(-6px) scale(1.08)',
                boxShadow: '0 30px 80px rgba(16, 185, 129, 0.6)',
              },
              '&:active': {
                transform: 'translateY(-2px) scale(1.02)',
              }
            }}
          >
            ✨ Создать рацион
          </Button>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={4} style={{ marginBottom: '64px' }}>
          <Grid item xs={12} md={4}>
            <Card style={{ 
              height: '100%', 
              textAlign: 'center', 
              padding: '24px',
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              transition: 'all 0.3s ease'
            }}
            sx={{
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
              }
            }}>
              <CardContent>
                <LocalHospital style={{ 
                  fontSize: 64, 
                  color: '#667eea', 
                  marginBottom: '16px',
                  filter: 'drop-shadow(0 4px 8px rgba(102, 126, 234, 0.3))'
                }} />
                <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold', color: '#2D3748' }}>
                  30+ Заболеваний
                </Typography>
                <Typography variant="body2" style={{ color: '#718096', lineHeight: 1.6 }}>
                  Специализированные диеты для диабета, гипертонии, гастрита и других заболеваний с медицинским подходом
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card style={{ 
              height: '100%', 
              textAlign: 'center', 
              padding: '24px',
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              transition: 'all 0.3s ease'
            }}
            sx={{
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
              }
            }}>
              <CardContent>
                <Psychology style={{ 
                  fontSize: 64, 
                  color: '#764ba2', 
                  marginBottom: '16px',
                  filter: 'drop-shadow(0 4px 8px rgba(118, 75, 162, 0.3))'
                }} />
                <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold', color: '#2D3748' }}>
                   Аналитика
                </Typography>
                <Typography variant="body2" style={{ color: '#718096', lineHeight: 1.6 }}>
                Анализ ваших данных и адаптация рационов под индивидуальные потребности и прогресс
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card style={{ 
              height: '100%', 
              textAlign: 'center', 
              padding: '24px',
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              transition: 'all 0.3s ease'
            }}
            sx={{
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
              }
            }}>
              <CardContent>
                <Restaurant style={{ 
                  fontSize: 64, 
                  color: '#f093fb', 
                  marginBottom: '16px',
                  filter: 'drop-shadow(0 4px 8px rgba(240, 147, 251, 0.3))'
                }} />
                <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold', color: '#2D3748' }}>
                  Детальный расчёт
                </Typography>
                <Typography variant="body2" style={{ color: '#718096', lineHeight: 1.6 }}>
                  Полный расчёт КБЖУ, витаминов и минералов для каждого приёма пищи с персонализированными рекомендациями
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Stats Section */}
        <Box style={{ 
          textAlign: 'center',
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '48px 24px',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <Typography variant="h3" gutterBottom style={{ fontWeight: 'bold', color: 'white', marginBottom: '48px' }}>
            Почему выбирают нас?
          </Typography>
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <People style={{ fontSize: 64, color: 'rgba(255,255,255,0.9)', marginBottom: '16px' }} />
              <Typography variant="h2" style={{ color: 'white', fontWeight: 'bold', marginBottom: '8px' }}>
                2,847+
              </Typography>
              <Typography variant="h6" style={{ color: 'rgba(255,255,255,0.8)' }}>Довольных пользователей</Typography>
              <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.7)', marginTop: '8px' }}>
                Присоединяйтесь к сообществу людей, заботящихся о своём здоровье
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <TrendingUp style={{ fontSize: 64, color: 'rgba(255,255,255,0.9)', marginBottom: '16px' }} />
              <Typography variant="h2" style={{ color: 'white', fontWeight: 'bold', marginBottom: '8px' }}>
                15,692+
              </Typography>
              <Typography variant="h6" style={{ color: 'rgba(255,255,255,0.8)' }}>Созданных рационов</Typography>
              <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.7)', marginTop: '8px' }}>
                Индивидуальные планы питания для различных медицинских потребностей
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <LocalHospital style={{ fontSize: 64, color: 'rgba(255,255,255,0.9)', marginBottom: '16px' }} />
              <Typography variant="h2" style={{ color: 'white', fontWeight: 'bold', marginBottom: '8px' }}>
                30+
              </Typography>
              <Typography variant="h6" style={{ color: 'rgba(255,255,255,0.8)' }}>Заболеваний</Typography>
              <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.7)', marginTop: '8px' }}>
                Поддержка широкого спектра медицинских ограничений и состояний
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box textAlign="center" style={{ marginTop: '80px', padding: '48px 0' }}>
          <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
            Готовы начать путь к здоровому питанию?
          </Typography>
          <Typography variant="h6" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '32px' }}>
            Создайте свой первый индивидуальный рацион прямо сейчас
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => handleSmoothNavigation('/generator')}
            style={{ 
              padding: '18px 56px',
              fontSize: '1.2rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
              borderRadius: '50px',
              boxShadow: '0 20px 60px rgba(59, 130, 246, 0.4)',
              textTransform: 'none',
              color: 'white',
              transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
            sx={{
              '&:hover': {
                transform: 'translateY(-6px) scale(1.08)',
                boxShadow: '0 30px 80px rgba(59, 130, 246, 0.6)',
              },
              '&:active': {
                transform: 'translateY(-2px) scale(1.02)',
              }
            }}
          >
            🚀 Начать бесплатно
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;