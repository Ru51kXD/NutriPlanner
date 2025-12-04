import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip
} from '@mui/material';

const FoodCard = ({
  name,
  description,
  calories,
  protein,
  fat,
  carbs,
  type
}) => {
  const getTypeColor = (mealType) => {
    const colors = {
      'Завтрак': 'primary',
      'Обед': 'secondary',
      'Ужин': 'success',
      'Перекус': 'warning'
    };
    return colors[mealType] || 'default';
  };

  return (
    <Card style={{ height: '100%', transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
      <CardContent>
        <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
          <Typography variant="h6" component="h3" gutterBottom>
            {name}
          </Typography>
          <Chip 
            label={type}
            color={getTypeColor(type)}
            size="small"
          />
        </Box>

        <Typography variant="body2" color="text.secondary" style={{ marginBottom: '16px' }}>
          {description}
        </Typography>

        <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Typography variant="h6" style={{ color: '#2E8B57' }}>
            {calories} ккал
          </Typography>
        </Box>

        <Box style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Chip label={`Б: ${protein}g`} size="small" variant="outlined" />
          <Chip label={`Ж: ${fat}g`} size="small" variant="outlined" />
          <Chip label={`У: ${carbs}g`} size="small" variant="outlined" />
        </Box>
      </CardContent>
    </Card>
  );
};

export default FoodCard;