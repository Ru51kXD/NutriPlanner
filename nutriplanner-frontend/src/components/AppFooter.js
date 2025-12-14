import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Container, 
  Grid,
  Button,
  IconButton
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  Facebook,
  Instagram,
  Twitter,
  Favorite
} from '@mui/icons-material';

const AppFooter = () => {
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
      component="footer"
      style={{
        background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
        color: 'white',
        padding: '48px 0 24px 0',
        marginTop: 'auto',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Декоративные элементы */}
      <Box
        style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
          filter: 'blur(40px)'
        }}
      />
      <Box
        style={{
          position: 'absolute',
          bottom: '-50px',
          left: '-50px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%)',
          filter: 'blur(40px)'
        }}
      />

      <Container maxWidth="lg" style={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={{ xs: 3, md: 4 }} sx={{ marginBottom: { xs: '24px', md: '32px' } }}>
          {/* О проекте */}
          <Grid item xs={12} md={4}>
            <Box style={{ marginBottom: '24px' }}>
              <Typography 
                variant="h5" 
                component="div" 
                style={{ 
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '16px',
                  background: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                🌱 NutriPlanner
              </Typography>
              <Typography 
                variant="body1" 
                style={{ 
                  color: '#cbd5e0',
                  lineHeight: 1.8,
                  marginBottom: '20px'
                }}
              >
                Ваш персональный помощник в планировании питания с учётом медицинских ограничений. 
                Индивидуальные рационы для здорового образа жизни.
              </Typography>
              <Box style={{ display: 'flex', gap: '12px' }}>
                <IconButton 
                  style={{ 
                    color: '#10B981',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                  }}
                  sx={{
                    '&:hover': {
                      background: 'rgba(16, 185, 129, 0.2)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Facebook />
                </IconButton>
                <IconButton 
                  style={{ 
                    color: '#10B981',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                  }}
                  sx={{
                    '&:hover': {
                      background: 'rgba(16, 185, 129, 0.2)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Instagram />
                </IconButton>
                <IconButton 
                  style={{ 
                    color: '#10B981',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                  }}
                  sx={{
                    '&:hover': {
                      background: 'rgba(16, 185, 129, 0.2)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Twitter />
                </IconButton>
              </Box>
            </Box>
          </Grid>
          
          {/* Навигация */}
          <Grid item xs={12} md={2}>
            <Typography variant="h6" gutterBottom style={{ 
              fontWeight: 800, 
              marginBottom: '24px',
              background: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: '1.3rem'
            }}>
              Навигация
            </Typography>
            <Box style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Button 
                onClick={() => handleSmoothNavigation('/generator')}
                style={{ 
                  color: '#e2e8f0',
                  textTransform: 'none',
                  justifyContent: 'flex-start',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                sx={{
                  '&:hover': {
                    color: '#10B981',
                    background: 'rgba(16, 185, 129, 0.15)',
                    borderColor: 'rgba(16, 185, 129, 0.4)',
                    transform: 'translateX(8px)',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                  }
                }}
              >
                Создать рацион
              </Button>
              <Button 
                onClick={() => handleSmoothNavigation('/plans')}
                style={{ 
                  color: '#e2e8f0',
                  textTransform: 'none',
                  justifyContent: 'flex-start',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                sx={{
                  '&:hover': {
                    color: '#10B981',
                    background: 'rgba(16, 185, 129, 0.15)',
                    borderColor: 'rgba(16, 185, 129, 0.4)',
                    transform: 'translateX(8px)',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                  }
                }}
              >
                Мои планы
              </Button>
              <Button 
                onClick={() => handleSmoothNavigation('/progress')}
                style={{ 
                  color: '#e2e8f0',
                  textTransform: 'none',
                  justifyContent: 'flex-start',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                sx={{
                  '&:hover': {
                    color: '#10B981',
                    background: 'rgba(16, 185, 129, 0.15)',
                    borderColor: 'rgba(16, 185, 129, 0.4)',
                    transform: 'translateX(8px)',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                  }
                }}
              >
                Прогресс
              </Button>
              <Button 
                onClick={() => handleSmoothNavigation('/recipe-generator')}
                style={{ 
                  color: '#e2e8f0',
                  textTransform: 'none',
                  justifyContent: 'flex-start',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                sx={{
                  '&:hover': {
                    color: '#10B981',
                    background: 'rgba(16, 185, 129, 0.15)',
                    borderColor: 'rgba(16, 185, 129, 0.4)',
                    transform: 'translateX(8px)',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                  }
                }}
              >
                Генерация рецептов
              </Button>
              <Button 
                onClick={() => handleSmoothNavigation('/admin')}
                style={{ 
                  color: '#e2e8f0',
                  textTransform: 'none',
                  justifyContent: 'flex-start',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                sx={{
                  '&:hover': {
                    color: '#EF4444',
                    background: 'rgba(239, 68, 68, 0.15)',
                    borderColor: 'rgba(239, 68, 68, 0.4)',
                    transform: 'translateX(8px)',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
                  }
                }}
              >
                🛠️ Админ панель
              </Button>
            </Box>
          </Grid>
          
          {/* Возможности */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom style={{ fontWeight: 700, marginBottom: '20px' }}>
              Возможности
            </Typography>
            <Box style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#cbd5e0' }}>
              <Typography variant="body2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#10B981' }}>✓</span> 30+ заболеваний
              </Typography>
              <Typography variant="body2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#10B981' }}>✓</span> AI генерация рецептов
              </Typography>
              <Typography variant="body2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#10B981' }}>✓</span> Сезонное меню
              </Typography>
              <Typography variant="body2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#10B981' }}>✓</span> Отслеживание прогресса
              </Typography>
              <Typography variant="body2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#10B981' }}>✓</span> Индивидуальные рационы
              </Typography>
            </Box>
          </Grid>
          
          {/* Контакты */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom style={{ fontWeight: 700, marginBottom: '20px' }}>
              Контакты
            </Typography>
            <Box style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Box style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#cbd5e0' }}>
                <Email style={{ color: '#10B981', fontSize: '20px' }} />
                <Typography variant="body2">
                  support@nutriplanner.ru
                </Typography>
              </Box>
              <Box style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#cbd5e0' }}>
                <Phone style={{ color: '#10B981', fontSize: '20px' }} />
                <Typography variant="body2">
                  +7 (999) 999-99-99
                </Typography>
              </Box>
              <Box style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#cbd5e0' }}>
                <LocationOn style={{ color: '#10B981', fontSize: '20px' }} />
                <Typography variant="body2">
                  Астана, Казахстан
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        {/* Разделитель */}
        <Box
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <Typography 
            variant="body2" 
            style={{ 
              color: '#a0aec0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            © 2025 NutriPlanner. Все права защищены.
          </Typography>
          <Typography 
            variant="body2" 
            style={{ 
              color: '#a0aec0',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Сделано с <Favorite style={{ fontSize: '14px', color: '#EF4444' }} /> для вашего здоровья
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AppFooter;