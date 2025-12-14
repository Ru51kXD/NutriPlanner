import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './views/Dashboard';
import LoginPage from './views/LoginPage';
import RegisterPage from './views/RegisterPage';
import ProfilePage from './views/ProfilePage';
import PlansPage from './views/PlansPage';
import GeneratorPage from './views/GeneratorPage';
import ProgressPage from './views/ProgressPage';
import DiaryPage from './views/DiaryPage';
import AdminPage from './views/AdminPage';
import RecipeGeneratorPage from './views/RecipeGeneratorPage';
import SeasonalMenuPage from './views/SeasonalMenuPage';
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';
import ScrollToTop from './components/ScrollToTop';
import { StorageService } from './utils/storage';
import { colors } from './theme/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary.main,
      light: colors.primary.light,
      dark: colors.primary.dark,
    },
    secondary: {
      main: colors.secondary.main,
      light: colors.secondary.light,
      dark: colors.secondary.dark,
    },
    background: {
      default: colors.background.light,
      paper: colors.background.white,
    },
    success: {
      main: colors.primary.main,
      light: colors.primary.light,
    },
    info: {
      main: colors.secondary.main,
      light: colors.secondary.light,
    },
    warning: {
      main: colors.warning.main,
      light: colors.warning.light,
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    }
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.05)',
    '0px 4px 8px rgba(0,0,0,0.08)',
    '0px 8px 16px rgba(0,0,0,0.1)',
    '0px 12px 24px rgba(0,0,0,0.12)',
    '0px 16px 32px rgba(0,0,0,0.14)',
    '0px 20px 40px rgba(0,0,0,0.16)',
    '0px 24px 48px rgba(0,0,0,0.18)',
    '0px 28px 56px rgba(0,0,0,0.2)',
    '0px 32px 64px rgba(0,0,0,0.22)',
    '0px 36px 72px rgba(0,0,0,0.24)',
    '0px 40px 80px rgba(0,0,0,0.26)',
    '0px 44px 88px rgba(0,0,0,0.28)',
    '0px 48px 96px rgba(0,0,0,0.3)',
    '0px 52px 104px rgba(0,0,0,0.32)',
    '0px 56px 112px rgba(0,0,0,0.34)',
    '0px 60px 120px rgba(0,0,0,0.36)',
    '0px 64px 128px rgba(0,0,0,0.38)',
    '0px 68px 136px rgba(0,0,0,0.4)',
    '0px 72px 144px rgba(0,0,0,0.42)',
    '0px 76px 152px rgba(0,0,0,0.44)',
    '0px 80px 160px rgba(0,0,0,0.46)',
    '0px 84px 168px rgba(0,0,0,0.48)',
    '0px 88px 176px rgba(0,0,0,0.5)',
    '0px 92px 184px rgba(0,0,0,0.52)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.2)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px 0 rgba(16, 185, 129, 0.3)',
          },
        },
        contained: {
          background: colors.primary.gradient,
          color: colors.text.white,
          '&:hover': {
            background: `linear-gradient(135deg, ${colors.primary.dark} 0%, #047857 100%)`,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: '1px solid rgba(255,255,255,0.1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
        },
        elevation3: {
          boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
        },
      },
    },
  },
});

function App() {
  // Инициализируем хранилище при загрузке приложения
  React.useEffect(() => {
    const initData = async () => {
      try {
        await StorageService.initializeDefaultData();
        console.log('✅ Данные инициализированы');
      } catch (error) {
        console.error('❌ Ошибка инициализации данных:', error);
        // Не блокируем приложение, если инициализация не удалась
      }
    };
    initData();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <ScrollToTop />
        <div className="App" style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative'
        }}>
          {/* Фоновое изображение */}
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'url(/backgroundimage.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            zIndex: 0,
            opacity: 0.5
          }} />
          {/* Затемнение для лучшей читаемости */}
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.25) 0%, rgba(118, 75, 162, 0.25) 25%, rgba(240, 147, 251, 0.2) 50%, rgba(79, 172, 254, 0.25) 75%, rgba(0, 242, 254, 0.2) 100%)',
            zIndex: 1
          }} />
          {/* Контент поверх фона */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
          <style>{`
            @keyframes gradient {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideInRight {
              from {
                opacity: 0;
                transform: translateX(30px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
            @keyframes scaleIn {
              from {
                opacity: 0;
                transform: scale(0.9);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
            .page-transition {
              animation: fadeInUp 0.6s ease-out;
            }
          `}</style>
          <AppHeader />
          <main style={{ flex: 1, position: 'relative' }} className="page-transition">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/plans" element={<PlansPage />} />
              <Route path="/generator" element={<GeneratorPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/diary" element={<DiaryPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/recipe-generator" element={<RecipeGeneratorPage />} />
              <Route path="/seasonal-menu" element={<SeasonalMenuPage />} />
              </Routes>
            </main>
            <AppFooter />
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;