import React, { useState, useEffect } from "react";
import {
  Paper,
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Card,
  CardContent,
  Container,
  InputAdornment,
} from "@mui/material";
import { Plus } from "lucide-react";
import { Lock, Person, Security } from "@mui/icons-material";
import { StorageService } from '../utils/storage';

const API_BASE_URL = "http://localhost:8080/api";

// Компонент для табов
function TabPanel({ children, value, index }) {
  return value === index ? <div>{children}</div> : null;
}

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [dietPlans, setDietPlans] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Проверяем авторизацию при загрузке
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuthenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
      loadAllData();
    }
  }, []);

  // Модальные окна
  const [userDialog, setUserDialog] = useState({ 
    open: false, 
    mode: 'create', 
    data: { name: '', email: '', password: '' } 
  });
  const [planDialog, setPlanDialog] = useState({ 
    open: false, 
    mode: 'create', 
    data: { name: '', diseaseId: '', calories: '' } 
  });
  const [diseaseDialog, setDiseaseDialog] = useState({ 
    open: false, 
    mode: 'create', 
    data: { name: '', description: '' } 
  });

  // Загрузка всех данных
  useEffect(() => {
    loadAllData();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    
    if (loginForm.username === 'admin' && loginForm.password === 'nimda') {
      localStorage.setItem('adminAuthenticated', 'true');
      setIsAuthenticated(true);
      loadAllData();
    } else {
      setLoginError('Неверный логин или пароль');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
    setLoginForm({ username: '', password: '' });
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Загружаем данные из localStorage через StorageService
      await Promise.all([loadUsers(), loadDietPlans(), loadDiseases()]);
    } catch (e) {
      console.error('Error in loadAllData:', e);
      showSnackbar("Ошибка загрузки данных.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const loadUsers = async () => {
    try {
      const data = await StorageService.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading users:', error);
      showSnackbar(`Ошибка загрузки пользователей: ${error.message}`, "error");
    }
  };

  const loadDietPlans = async () => {
    try {
      const data = await StorageService.getPlans();
      setDietPlans(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading diet plans:', error);
      showSnackbar(`Ошибка загрузки рационов: ${error.message}`, "error");
    }
  };

  const loadDiseases = async () => {
    try {
      const data = await StorageService.getDiseases();
      setDiseases(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading diseases:', error);
      showSnackbar(`Ошибка загрузки заболеваний: ${error.message}`, "error");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Удалить пользователя?")) return;
    try {
      await StorageService.deleteUser(id);
      showSnackbar("Пользователь удалён");
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      showSnackbar("Ошибка удаления пользователя", "error");
    }
  };

  const deleteDisease = async (id) => {
    if (!window.confirm("Удалить заболевание?")) return;
    try {
      await StorageService.deleteDisease(id);
      showSnackbar("Заболевание удалено");
      loadDiseases();
    } catch (error) {
      console.error('Error deleting disease:', error);
      showSnackbar("Ошибка удаления заболевания", "error");
    }
  };

  const deletePlan = async (id) => {
    if (!window.confirm("Удалить рацион?")) return;
    try {
      await StorageService.deletePlan(id);
      showSnackbar("Рацион удалён");
      loadDietPlans();
    } catch (error) {
      console.error('Error deleting diet plan:', error);
      showSnackbar("Ошибка удаления рациона", "error");
    }
  };

  // Создание и редактирование пользователей
  const handleUserSubmit = async () => {
    const { mode, data } = userDialog;
    
    if (!data.name || !data.email) {
      showSnackbar('Заполните все обязательные поля', 'error');
      return;
    }
    
    if (mode === 'create' && !data.password) {
      showSnackbar('Введите пароль', 'error');
      return;
    }
    
    try {
      if (mode === 'create') {
        await StorageService.saveUser({
          name: data.name,
          email: data.email,
          password: data.password
        });
        showSnackbar('Пользователь создан');
      } else {
        await StorageService.updateUser(data.id, {
          name: data.name,
          email: data.email
        });
        showSnackbar('Пользователь обновлён');
      }
      
      setUserDialog({ open: false, mode: 'create', data: { name: '', email: '', password: '' } });
      loadUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      showSnackbar('Ошибка сохранения пользователя', 'error');
    }
  };

  // Создание и редактирование рационов
  const handlePlanSubmit = async () => {
    const { mode, data } = planDialog;
    
    if (!data.name || !data.calories) {
      showSnackbar('Заполните все обязательные поля', 'error');
      return;
    }
    
    try {
      if (mode === 'create') {
        await StorageService.savePlan({
          name: data.name,
          disease: data.diseaseId,
          totalCalories: parseInt(data.calories)
        });
        showSnackbar('Рацион создан');
      } else {
        await StorageService.updatePlan(data.id, {
          name: data.name,
          disease: data.diseaseId,
          totalCalories: parseInt(data.calories)
        });
        showSnackbar('Рацион обновлён');
      }
      
      setPlanDialog({ open: false, mode: 'create', data: { name: '', diseaseId: '', calories: '' } });
      loadDietPlans();
    } catch (error) {
      console.error('Error saving plan:', error);
      showSnackbar('Ошибка сохранения рациона', 'error');
    }
  };

const handleDiseaseSubmit = async () => {
  const { mode, data } = diseaseDialog;

  if (!data.name) {
    showSnackbar('Введите название заболевания', 'error');
    return;
  }

  try {
    if (mode === 'create') {
      await StorageService.saveDisease({
        name: data.name,
        description: data.description || ''
      });
      showSnackbar('Заболевание создано');
    } else {
      await StorageService.updateDisease(data.id, {
        name: data.name,
        description: data.description || ''
      });
      showSnackbar('Заболевание обновлено');
    }

    setDiseaseDialog({ open: false, mode: 'create', data: { name: '', description: '' } });
    loadDiseases();
  } catch (error) {
    console.error('Error saving disease:', error);
    showSnackbar('Ошибка сохранения заболевания', 'error');
  }
};


  // Если не авторизован, показываем форму входа
  if (!isAuthenticated) {
    return (
      <Container maxWidth="sm" style={{ padding: '64px 16px' }}>
        <Card elevation={8} style={{ borderRadius: '24px', overflow: 'hidden' }}>
          <Box style={{
            background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
            padding: '32px',
            textAlign: 'center',
            color: 'white'
          }}>
            <Security style={{ fontSize: 64, marginBottom: '16px' }} />
            <Typography variant="h4" component="h1" style={{ fontWeight: 800, marginBottom: '8px' }}>
              Админ панель
            </Typography>
            <Typography variant="body1" style={{ opacity: 0.9 }}>
              Введите учетные данные для доступа
            </Typography>
          </Box>
          
          <CardContent style={{ padding: '32px' }}>
            <form onSubmit={handleLogin}>
              {loginError && (
                <Alert severity="error" style={{ marginBottom: '24px' }}>
                  {loginError}
                </Alert>
              )}
              
              <TextField
                fullWidth
                label="Логин"
                margin="normal"
                required
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
                style={{ marginBottom: '20px' }}
              />
              
              <TextField
                fullWidth
                label="Пароль"
                type="password"
                margin="normal"
                required
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                }}
                style={{ marginBottom: '24px' }}
              />
              
              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                  color: 'white',
                  padding: '14px',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(239, 68, 68, 0.3)'
                }}
                sx={{
                  '&:hover': {
                    background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 32px rgba(239, 68, 68, 0.4)'
                  }
                }}
              >
                Войти
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Typography variant="h4" fontWeight="bold">
          🛠️ Панель администратора
        </Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={handleLogout}
          startIcon={<Lock />}
        >
          Выйти
        </Button>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="fullWidth"
        >
          <Tab label="Пользователи" />
          <Tab label="Рационы" />
          <Tab label="Заболевания" />
        </Tabs>
      </Paper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Пользователи */}
          <TabPanel value={tabValue} index={0}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6">Пользователи</Typography>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<Plus size={18} />}
                  onClick={() => setUserDialog({ 
                    open: true, 
                    mode: 'create', 
                    data: { name: '', email: '', password: '' } 
                  })}
                >
                  Создать
                </Button>
              </Box>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Имя</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell align="right">Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length > 0 ? (
                    users.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell>{u.id}</TableCell>
                        <TableCell>{u.name}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell align="right">
                          <Button
                            variant="outlined"
                            size="small"
                            color="primary"
                            sx={{ mr: 1 }}
                            onClick={() => setUserDialog({ 
                              open: true, 
                              mode: 'edit', 
                              data: { id: u.id, name: u.name, email: u.email } 
                            })}
                          >
                            Изменить
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            onClick={() => deleteUser(u.id)}
                          >
                            Удалить
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        Нет данных
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Paper>
          </TabPanel>

          {/* Рационы */}
          <TabPanel value={tabValue} index={1}>
            <Paper sx={{ p: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Рационы</Typography>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<Plus size={18} />}
                  onClick={() => setPlanDialog({ 
                    open: true, 
                    mode: 'create', 
                    data: { name: '', diseaseId: '', calories: '' } 
                  })}
                >
                  Создать
                </Button>
              </Box>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Название</TableCell>
                    <TableCell>Заболевание</TableCell>
                    <TableCell>Калории</TableCell>
                    <TableCell align="right">Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dietPlans.length > 0 ? (
                    dietPlans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell>{plan.id}</TableCell>
                        <TableCell>{plan.name}</TableCell>
                        <TableCell>{plan.disease || plan.diseaseId || "-"}</TableCell>
                        <TableCell>{plan.totalCalories || plan.calories || "-"}</TableCell>
                        <TableCell align="right">
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            sx={{ mr: 1 }}
                            onClick={() => setPlanDialog({ 
                              open: true, 
                              mode: 'edit', 
                              data: { 
                                id: plan.id,
                                name: plan.name,
                                diseaseId: plan.disease || plan.diseaseId || '',
                                calories: plan.totalCalories || plan.calories || ''
                              } 
                            })}
                          >
                            Изменить
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => deletePlan(plan.id)}
                          >
                            Удалить
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        Нет рационов
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Paper>
          </TabPanel>

          {/* Заболевания */}
          <TabPanel value={tabValue} index={2}>
            <Paper sx={{ p: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Заболевания</Typography>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<Plus size={18} />}
                  onClick={() => setDiseaseDialog({ 
                    open: true, 
                    mode: 'create', 
                    data: { name: '', description: '' } 
                  })}
                >
                  Создать
                </Button>
              </Box>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Название</TableCell>
                    <TableCell>Описание</TableCell>
                    <TableCell align="right">Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {diseases.length > 0 ? (
                    diseases.map((d) => (
                      <TableRow key={d.id}>
                        <TableCell>{d.id}</TableCell>
                        <TableCell>{d.name}</TableCell>
                        <TableCell>{d.description}</TableCell>
                        <TableCell align="right">
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            sx={{ mr: 1 }}
                            onClick={() => setDiseaseDialog({ 
                              open: true, 
                              mode: 'edit', 
                              data: { id: d.id, name: d.name, description: d.description } 
                            })}
                          >
                            Изменить
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => deleteDisease(d.id)}
                          >
                            Удалить
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        Нет заболеваний
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Paper>
          </TabPanel>
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            borderRadius: '16px',
            boxShadow: snackbar.severity === 'error' 
              ? '0 8px 24px rgba(239, 68, 68, 0.3)' 
              : '0 8px 24px rgba(16, 185, 129, 0.3)',
            background: snackbar.severity === 'error'
              ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
              : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: 'white',
            fontWeight: 600,
            fontSize: '1rem',
            padding: '16px 24px',
            minWidth: '300px'
          }
        }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          variant="filled"
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

      {/* Диалог для пользователей */}
      <Dialog 
        open={userDialog.open} 
        onClose={() => setUserDialog({ open: false, mode: 'create', data: { name: '', email: '', password: '' } })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {userDialog.mode === 'create' ? 'Создать пользователя' : 'Редактировать пользователя'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Имя пользователя"
            fullWidth
            required
            value={userDialog.data.name || ''}
            onChange={(e) => setUserDialog({
              ...userDialog,
              data: { ...userDialog.data, name: e.target.value }
            })}
          />
          <TextField
            margin="normal"
            label="Email"
            type="email"
            fullWidth
            required
            value={userDialog.data.email || ''}
            onChange={(e) => setUserDialog({
              ...userDialog,
              data: { ...userDialog.data, email: e.target.value }
            })}
          />
          {userDialog.mode === 'create' && (
            <TextField
              margin="normal"
              label="Пароль"
              type="password"
              fullWidth
              required
              value={userDialog.data.password || ''}
              onChange={(e) => setUserDialog({
                ...userDialog,
                data: { ...userDialog.data, password: e.target.value }
              })}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDialog({ open: false, mode: 'create', data: { name: '', email: '', password: '' } })}>
            Отмена
          </Button>
          <Button onClick={handleUserSubmit} variant="contained">
            {userDialog.mode === 'create' ? 'Создать' : 'Сохранить'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог для рационов */}
      <Dialog 
        open={planDialog.open} 
        onClose={() => setPlanDialog({ open: false, mode: 'create', data: { name: '', diseaseId: '', calories: '' } })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {planDialog.mode === 'create' ? 'Создать рацион' : 'Редактировать рацион'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Название рациона"
            fullWidth
            required
            value={planDialog.data.name || ''}
            onChange={(e) => setPlanDialog({
              ...planDialog,
              data: { ...planDialog.data, name: e.target.value }
            })}
          />
          <TextField
            margin="normal"
            label="Заболевание"
            select
            fullWidth
            value={planDialog.data.diseaseId || ''}
            onChange={(e) => setPlanDialog({
              ...planDialog,
              data: { ...planDialog.data, diseaseId: e.target.value }
            })}
          >
            <MenuItem value="">Не выбрано</MenuItem>
            {diseases.map((d) => (
              <MenuItem key={d.id} value={d.id}>
                {d.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="normal"
            label="Калории"
            type="number"
            fullWidth
            required
            value={planDialog.data.calories || ''}
            onChange={(e) => setPlanDialog({
              ...planDialog,
              data: { ...planDialog.data, calories: e.target.value }
            })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPlanDialog({ open: false, mode: 'create', data: { name: '', diseaseId: '', calories: '' } })}>
            Отмена
          </Button>
          <Button onClick={handlePlanSubmit} variant="contained">
            {planDialog.mode === 'create' ? 'Создать' : 'Сохранить'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог для заболеваний */}
      <Dialog 
        open={diseaseDialog.open} 
        onClose={() => setDiseaseDialog({ open: false, mode: 'create', data: { name: '', description: '' } })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {diseaseDialog.mode === 'create' ? 'Создать заболевание' : 'Редактировать заболевание'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Название"
            fullWidth
            required
            value={diseaseDialog.data.name || ''}
            onChange={(e) => setDiseaseDialog({
              ...diseaseDialog,
              data: { ...diseaseDialog.data, name: e.target.value }
            })}
          />
          <TextField
            margin="normal"
            label="Описание"
            fullWidth
            multiline
            rows={4}
            value={diseaseDialog.data.description || ''}
            onChange={(e) => setDiseaseDialog({
              ...diseaseDialog,
              data: { ...diseaseDialog.data, description: e.target.value }
            })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDiseaseDialog({ open: false, mode: 'create', data: { name: '', description: '' } })}>
            Отмена
          </Button>
          <Button onClick={handleDiseaseSubmit} variant="contained">
            {diseaseDialog.mode === 'create' ? 'Создать' : 'Сохранить'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPage;