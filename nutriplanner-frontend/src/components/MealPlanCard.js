import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  CardActions
} from '@mui/material';
import {
  Restaurant,
  CalendarToday,
  Share
} from '@mui/icons-material';

const MealPlanCard = ({
  title,
  disease,
  duration,
  calories,
  createdAt,
  onView,
  onShare
}) => {
  const getDiseaseColor = (diseaseType) => {
    const colors = {
      'Диабет': 'error',
      'Ожирение': 'warning',
      'Гипертония': 'info',
      'Гастрит': 'success',
      'Анемия': 'secondary'
    };
    return colors[diseaseType] || 'default';
  };

  return (
    <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent style={{ flexGrow: 1 }}>
        <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
          <Typography variant="h6" component="h2" gutterBottom>
            {title}
          </Typography>
          <Chip 
            label={disease}
            color={getDiseaseColor(disease)}
            size="small"
          />
        </Box>

        <Box style={{ marginBottom: '16px' }}>
          <Box style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <CalendarToday style={{ fontSize: 16, marginRight: '8px', color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Период: {duration}
            </Typography>
          </Box>
          <Box style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <Restaurant style={{ fontSize: 16, marginRight: '8px', color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {calories} ккал/день
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Создан: {createdAt}
          </Typography>
        </Box>
      </CardContent>

      <CardActions style={{ justifyContent: 'space-between', padding: '16px' }}>
        <Button variant="outlined" size="small" onClick={onView}>
          Просмотреть
        </Button>
        <Button startIcon={<Share />} size="small" onClick={onShare}>
          Поделиться
        </Button>
      </CardActions>
    </Card>
  );
};

export default MealPlanCard;