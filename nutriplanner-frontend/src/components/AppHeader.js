import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Logout, Menu, Close } from '@mui/icons-material';
import { colors, getTextColor } from '../theme/colors';

const AppHeader = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Проверяем статус авторизации при загрузке и при изменении
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem('isAuthenticated') === 'true';
      const name = localStorage.getItem('userName') || '';
      setIsAuthenticated(authStatus);
      setUserName(name);
    };

    checkAuth();
    
    // Слушаем изменения в localStorage (для синхронизации между вкладками)
    const handleStorageChange = (e) => {
      if (e.key === 'isAuthenticated' || e.key === 'userName') {
        checkAuth();
      }
    };

    // Слушаем кастомное событие для обновления состояния
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChanged', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    // Очищаем данные авторизации
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userAge');
    localStorage.removeItem('userWeight');
    localStorage.removeItem('userHeight');
    
    setIsAuthenticated(false);
    setUserName('');
    
    // Отправляем событие для обновления состояния в других компонентах
    window.dispatchEvent(new Event('authStateChanged'));
    
    // Перенаправляем на главную страницу
    navigate('/');
  };

  const handleNavigation = (path) => {
    setMobileOpen(false); // Закрываем мобильное меню
    // Плавная прокрутка вверх перед переходом
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    // Небольшая задержка для плавности
    setTimeout(() => {
      navigate(path);
    }, 200);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <AppBar 
      position="sticky"
      elevation={0}
      style={{ 
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 253, 250, 0.98) 100%)',
        backdropFilter: 'blur(30px) saturate(180%)',
        boxShadow: '0 4px 20px rgba(16, 185, 129, 0.08), 0 0 0 1px rgba(16, 185, 129, 0.05)',
        borderBottom: '1px solid rgba(16, 185, 129, 0.1)',
        position: 'relative',
        overflow: 'visible',
        top: 0,
        zIndex: 1100
      }}
    >
      {/* Декоративные элементы */}
      <Box style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        background: 'linear-gradient(90deg, transparent 0%, rgba(16, 185, 129, 0.03) 50%, transparent 100%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <Box style={{
        position: 'absolute',
        top: '-30%',
        right: '-10%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      
      <Container maxWidth="xl" style={{ position: 'relative', zIndex: 1 }}>
        <Toolbar style={{ 
          justifyContent: 'space-between', 
          padding: '16px 0', 
          position: 'relative', 
          zIndex: 1,
          minHeight: '64px'
        }}>
          <Box
            component={Link}
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              zIndex: 2
            }}
            sx={{
              '&:hover': {
                transform: 'scale(1.05)',
              }
            }}
          >
            <Box style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              borderRadius: '12px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
              fontSize: '1.5rem',
              lineHeight: 1,
              minWidth: '44px',
              minHeight: '44px'
            }}>
              🌱
            </Box>
            <Typography
              variant="h4"
              style={{
                fontWeight: 900,
                textDecoration: 'none',
                color: '#10B981', // Fallback цвет
                background: 'linear-gradient(135deg, #10B981 0%, #059669 50%, #3B82F6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: isMobile ? '1.3rem' : '1.85rem',
                letterSpacing: '-0.02em',
                margin: 0,
                padding: 0,
                position: 'relative',
                display: isMobile ? 'none' : 'inline-block'
              }}
              sx={{
                '@supports not (-webkit-background-clip: text)': {
                  color: '#10B981',
                  background: 'none'
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-4px',
                  left: 0,
                  width: '0%',
                  height: '3px',
                  background: 'linear-gradient(90deg, #10B981 0%, #3B82F6 100%)',
                  borderRadius: '2px',
                  transition: 'width 0.4s ease'
                },
                '&:hover::after': {
                  width: '100%'
                }
              }}
            >
              NutriPlanner
            </Typography>
          </Box>

          {isMobile && (
            <IconButton
              onClick={handleDrawerToggle}
              style={{ color: '#374151' }}
              sx={{ display: { md: 'none' } }}
            >
              <Menu />
            </IconButton>
          )}

          <Box 
            sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              gap: '8px', 
              alignItems: 'center', 
              flexWrap: 'wrap' 
            }}
          >
            <Button 
              onClick={() => handleNavigation('/generator')}
              variant="contained"
              style={{ 
                background: colors.primary.gradient,
                color: colors.text.white,
                fontWeight: 700,
                borderRadius: '14px',
                padding: '10px 24px',
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                textTransform: 'none',
                fontSize: '0.95rem',
                letterSpacing: '0.01em',
                position: 'relative',
                overflow: 'hidden'
              }}
              sx={{
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  transition: 'left 0.5s ease'
                },
                '&:hover::before': {
                  left: '100%'
                },
                '&:hover': {
                  transform: 'translateY(-3px) scale(1.02)',
                  boxShadow: '0 10px 28px rgba(16, 185, 129, 0.45), inset 0 1px 0 rgba(255,255,255,0.3)',
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                },
                '&:active': {
                  transform: 'translateY(-1px) scale(0.98)',
                }
              }}
            >
              ✨ Создать рацион
            </Button>
            <Button 
              onClick={() => handleNavigation('/plans')}
              style={{ 
                color: '#374151',
                fontWeight: 600,
                borderRadius: '12px',
                padding: '10px 18px',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                textTransform: 'none',
                fontSize: '0.95rem',
                position: 'relative'
              }}
              sx={{
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(59, 130, 246, 0.08) 100%)',
                  color: '#10B981',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
                }
              }}
            >
              📋 Мои планы
            </Button>
            <Button 
              onClick={() => handleNavigation('/progress')}
              style={{ 
                color: '#374151',
                fontWeight: 600,
                borderRadius: '12px',
                padding: '10px 18px',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                textTransform: 'none',
                fontSize: '0.95rem'
              }}
              sx={{
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(59, 130, 246, 0.08) 100%)',
                  color: '#10B981',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
                }
              }}
            >
              📈 Прогресс
            </Button>
            <Button 
              onClick={() => handleNavigation('/recipe-generator')}
              style={{ 
                color: '#374151',
                fontWeight: 600,
                borderRadius: '12px',
                padding: '10px 18px',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                textTransform: 'none',
                fontSize: '0.95rem'
              }}
              sx={{
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(59, 130, 246, 0.08) 100%)',
                  color: '#10B981',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
                }
              }}
            >
              🍳 Рецепты
            </Button>
            <Button 
              onClick={() => handleNavigation('/seasonal-menu')}
              style={{ 
                color: '#374151',
                fontWeight: 600,
                borderRadius: '12px',
                padding: '10px 18px',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                textTransform: 'none',
                fontSize: '0.95rem'
              }}
              sx={{
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(59, 130, 246, 0.08) 100%)',
                  color: '#10B981',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
                }
              }}
            >
              🍂 Сезоны
            </Button>
            {isAuthenticated ? (
              <>
                {userName && !isMobile && (
                  <Typography 
                    variant="body2" 
                    onClick={() => handleNavigation('/profile')}
                    style={{ 
                      color: '#374151',
                      fontWeight: 600,
                      padding: '10px 18px',
                      fontSize: '0.9rem',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      userSelect: 'none'
                    }}
                    sx={{
                      '&:hover': {
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(59, 130, 246, 0.08) 100%)',
                        color: '#10B981',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
                      }
                    }}
                  >
                    👤 {userName}
                  </Typography>
                )}
                <Button 
                  onClick={handleLogout}
                  variant="outlined"
                  startIcon={<Logout />}
                  style={{ 
                    borderColor: '#EF4444',
                    borderWidth: '2px',
                    color: '#EF4444',
                    fontWeight: 700,
                    borderRadius: '14px',
                    padding: isMobile ? '8px 16px' : '10px 24px',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    textTransform: 'none',
                    fontSize: isMobile ? '0.85rem' : '0.95rem',
                    background: 'rgba(239, 68, 68, 0.03)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  sx={{
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '0%',
                      height: '100%',
                      background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                      transition: 'width 0.4s ease',
                      zIndex: 0
                    },
                    '&:hover::before': {
                      width: '100%'
                    },
                    '&:hover': {
                      borderColor: '#EF4444',
                      color: 'white',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 8px 20px rgba(239, 68, 68, 0.35)',
                    },
                    '& > span': {
                      position: 'relative',
                      zIndex: 1
                    }
                  }}
                >
                  {isMobile ? '' : 'Выйти'}
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => handleNavigation('/login')}
                variant="outlined"
                style={{ 
                  borderColor: '#10B981',
                  borderWidth: '2px',
                  color: '#10B981',
                  fontWeight: 700,
                  borderRadius: '14px',
                    padding: isMobile ? '8px 16px' : '10px 24px',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    textTransform: 'none',
                    fontSize: isMobile ? '0.85rem' : '0.95rem',
                    background: 'rgba(16, 185, 129, 0.03)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
                sx={{
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '0%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    transition: 'width 0.4s ease',
                    zIndex: 0
                  },
                  '&:hover::before': {
                    width: '100%'
                  },
                  '&:hover': {
                    borderColor: '#10B981',
                    color: 'white',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 8px 20px rgba(16, 185, 129, 0.35)',
                  },
                  '& > span': {
                    position: 'relative',
                    zIndex: 1
                  }
                }}
              >
                {isMobile ? '' : 'Войти'}
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Мобильное меню */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: { xs: '280px', sm: '320px' },
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 253, 250, 0.98) 100%)',
            backdropFilter: 'blur(30px)',
          }
        }}
      >
        <Box style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(16, 185, 129, 0.1)' }}>
          <Typography variant="h6" style={{ fontWeight: 700, color: '#10B981' }}>
            Меню
          </Typography>
          <IconButton onClick={handleDrawerToggle}>
            <Close />
          </IconButton>
        </Box>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation('/generator')}>
              <ListItemText primary="✨ Создать рацион" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation('/plans')}>
              <ListItemText primary="📋 Мои планы" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation('/progress')}>
              <ListItemText primary="📈 Прогресс" />
            </ListItemButton>
          </ListItem>
          {isAuthenticated && (
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavigation('/profile')}>
                <ListItemText primary={`👤 ${userName || 'Профиль'}`} />
              </ListItemButton>
            </ListItem>
          )}
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation('/recipe-generator')}>
              <ListItemText primary="🍳 Рецепты" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation('/seasonal-menu')}>
              <ListItemText primary="🍂 Сезоны" />
            </ListItemButton>
          </ListItem>
          {isAuthenticated ? (
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout} style={{ color: '#EF4444' }}>
                <ListItemText primary="Выйти" />
              </ListItemButton>
            </ListItem>
          ) : (
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavigation('/login')}>
                <ListItemText primary="Войти" />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default AppHeader;