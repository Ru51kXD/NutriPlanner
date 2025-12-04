import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  MenuItem,
  Typography,
  Grid,
  Alert,
  FormControl,
  InputLabel,
  Select,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Card,
  CardContent
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  LocalHospital
} from '@mui/icons-material';
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
  { value: 'fibromyalgia', label: '💜 Фибромиалгия' }
];

const durations = [
  { value: 'week', label: 'Неделя' },
  { value: 'month', label: 'Месяц' },
  { value: 'half-year', label: 'Полгода' },
  { value: 'year', label: 'Год' }
];

const activityLevels = [
  { value: 'sedentary', label: 'Сидячий образ жизни' },
  { value: 'light', label: 'Легкая активность' },
  { value: 'moderate', label: 'Умеренная активность' },
  { value: 'high', label: 'Высокая активность' },
  { value: 'athlete', label: 'Профессиональный спорт' }
];

const diseasePlans = {
  gastritis: {
    goal: 'снизить раздражение слизистой, нормализовать секрецию',
    bzu: { protein: 90, fat: 70, carbs: 350 },
    calories: 2400,
    meals: {
      breakfast: { name: 'Овсяная каша на воде с молоком', description: 'яйцо всмятку, слабый чай', calories: 400, protein: 18, fat: 12, carbs: 60 },
      snack1: { name: 'Банан', description: 'тёплое молоко', calories: 200, protein: 8, fat: 5, carbs: 30 },
      lunch: { name: 'Суп-пюре из картофеля и моркови', description: 'паровые котлеты, рис, компот', calories: 600, protein: 25, fat: 20, carbs: 80 },
      dinner: { name: 'Манная каша', description: 'творог 5%, ромашковый чай', calories: 400, protein: 20, fat: 10, carbs: 55 }
    },
    vitamins: 'A, E, B2, B6 (восстанавливают слизистую желудка)'
  },
  diabetes: {
    goal: 'стабилизировать уровень глюкозы, снизить инсулинорезистентность',
    bzu: { protein: 100, fat: 80, carbs: 200 },
    calories: 2000,
    meals: {
      breakfast: { name: 'Гречка с отварной курицей', description: 'кофе без сахара', calories: 450, protein: 35, fat: 15, carbs: 45 },
      snack1: { name: 'Яблоко', description: 'горсть орехов', calories: 200, protein: 5, fat: 12, carbs: 20 },
      lunch: { name: 'Овощной суп', description: 'рыба на пару, тушёные овощи', calories: 550, protein: 30, fat: 20, carbs: 50 },
      dinner: { name: 'Творог с корицей', description: 'отрубной хлебец', calories: 300, protein: 25, fat: 10, carbs: 25 }
    },
    vitamins: 'хром, магний, витамин D, омега-3, B1, B6'
  },
  obesity: {
    goal: 'снижение калорийности и аппетита, сохранение мышц',
    bzu: { protein: 120, fat: 60, carbs: 150 },
    calories: 1700,
    meals: {
      breakfast: { name: 'Омлет из 2 яиц с овощами', description: 'зелёный чай', calories: 350, protein: 25, fat: 20, carbs: 15 },
      snack1: { name: 'Кефир 1%', description: 'яблоко', calories: 150, protein: 8, fat: 3, carbs: 20 },
      lunch: { name: 'Куриная грудка', description: 'гречка, салат с оливковым маслом', calories: 500, protein: 45, fat: 15, carbs: 40 },
      dinner: { name: 'Запечённая рыба', description: 'тушёные кабачки', calories: 400, protein: 35, fat: 12, carbs: 25 }
    },
    vitamins: 'D, C, цинк, L-карнитин, комплекс B-группы'
  },
  anemia: {
    goal: 'повысить уровень железа и гемоглобина',
    bzu: { protein: 100, fat: 80, carbs: 300 },
    calories: 2300,
    meals: {
      breakfast: { name: 'Овсянка с яблоком', description: 'чай с шиповником', calories: 400, protein: 15, fat: 10, carbs: 70 },
      snack1: { name: 'Гранатовый сок', description: 'орехи', calories: 250, protein: 8, fat: 15, carbs: 25 },
      lunch: { name: 'Гречка с говядиной', description: 'салат из свёклы, чёрный хлеб', calories: 600, protein: 40, fat: 25, carbs: 65 },
      dinner: { name: 'Запеканка из творога с изюмом', description: '', calories: 350, protein: 25, fat: 12, carbs: 40 }
    },
    vitamins: 'железо, витамин C, фолиевая кислота, B12'
  },
  hypertension: {
    goal: 'снизить давление, улучшить сосудистый тонус',
    bzu: { protein: 90, fat: 65, carbs: 300 },
    calories: 2200,
    meals: {
      breakfast: { name: 'Овсянка с бананом', description: 'травяной чай', calories: 400, protein: 15, fat: 10, carbs: 70 },
      snack1: { name: 'Йогурт без сахара', description: '', calories: 150, protein: 8, fat: 5, carbs: 15 },
      lunch: { name: 'Тушёная рыба', description: 'овощное рагу, компот без сахара', calories: 550, protein: 35, fat: 20, carbs: 50 },
      dinner: { name: 'Куриное филе', description: 'салат из огурцов, ряженка', calories: 400, protein: 30, fat: 15, carbs: 35 }
    },
    vitamins: 'магний, калий, коэнзим Q10, витамин C, омега-3'
  },
  // Добавляем базовые планы для остальных болезней
  hypothyroidism: { goal: 'нормализовать обмен веществ', bzu: { protein: 95, fat: 70, carbs: 280 }, calories: 2100, meals: { breakfast: { name: 'Гречка с яйцом', description: 'чай с лимоном', calories: 420, protein: 20, fat: 14, carbs: 55 }, snack1: { name: 'Орехи', description: 'яблоко', calories: 200, protein: 8, fat: 12, carbs: 25 }, lunch: { name: 'Рыба на пару', description: 'рис, овощи', calories: 580, protein: 32, fat: 18, carbs: 70 }, dinner: { name: 'Творог', description: 'кефир', calories: 380, protein: 28, fat: 12, carbs: 40 } }, vitamins: 'йод, селен, цинк, витамин D, B12' },
  hyperthyroidism: { goal: 'снизить метаболизм, успокоить щитовидную железу', bzu: { protein: 110, fat: 85, carbs: 350 }, calories: 2800, meals: { breakfast: { name: 'Овсянка с орехами', description: 'молоко', calories: 500, protein: 22, fat: 18, carbs: 70 }, snack1: { name: 'Йогурт', description: 'банан', calories: 250, protein: 10, fat: 8, carbs: 35 }, lunch: { name: 'Куриная грудка', description: 'макароны, овощи', calories: 700, protein: 45, fat: 25, carbs: 85 }, dinner: { name: 'Рыба', description: 'картофель, салат', calories: 550, protein: 35, fat: 20, carbs: 60 } }, vitamins: 'кальций, магний, витамин D, омега-3' },
  cholecystitis: { goal: 'уменьшить нагрузку на желчный пузырь', bzu: { protein: 85, fat: 60, carbs: 320 }, calories: 2300, meals: { breakfast: { name: 'Овсянка на воде', description: 'чай', calories: 380, protein: 16, fat: 10, carbs: 65 }, snack1: { name: 'Яблоко', description: 'кефир', calories: 180, protein: 7, fat: 4, carbs: 28 }, lunch: { name: 'Овощной суп', description: 'курица на пару, рис', calories: 600, protein: 28, fat: 18, carbs: 75 }, dinner: { name: 'Творог', description: 'травяной чай', calories: 350, protein: 24, fat: 10, carbs: 45 } }, vitamins: 'A, E, C, магний, омега-3' },
  pancreatitis: { goal: 'щадящее питание для поджелудочной железы', bzu: { protein: 80, fat: 55, carbs: 300 }, calories: 2200, meals: { breakfast: { name: 'Манная каша', description: 'чай', calories: 350, protein: 15, fat: 8, carbs: 60 }, snack1: { name: 'Творог', description: 'компот', calories: 200, protein: 18, fat: 6, carbs: 25 }, lunch: { name: 'Суп-пюре', description: 'котлеты на пару, картофель', calories: 580, protein: 25, fat: 15, carbs: 70 }, dinner: { name: 'Омлет', description: 'кефир', calories: 320, protein: 20, fat: 12, carbs: 35 } }, vitamins: 'A, E, C, витамины группы B' },
  colitis: { goal: 'уменьшить воспаление кишечника', bzu: { protein: 90, fat: 65, carbs: 280 }, calories: 2100, meals: { breakfast: { name: 'Рисовая каша', description: 'чай', calories: 380, protein: 14, fat: 9, carbs: 68 }, snack1: { name: 'Печёное яблоко', description: '', calories: 150, protein: 5, fat: 3, carbs: 30 }, lunch: { name: 'Куриный бульон', description: 'котлеты, рис', calories: 570, protein: 30, fat: 16, carbs: 65 }, dinner: { name: 'Творожная запеканка', description: 'чай', calories: 380, protein: 22, fat: 12, carbs: 48 } }, vitamins: 'A, E, C, цинк, пробиотики' },
  gout: { goal: 'снизить уровень мочевой кислоты', bzu: { protein: 70, fat: 60, carbs: 320 }, calories: 2000, meals: { breakfast: { name: 'Овсянка', description: 'чай', calories: 350, protein: 12, fat: 8, carbs: 65 }, snack1: { name: 'Ягоды', description: 'кефир', calories: 180, protein: 6, fat: 4, carbs: 30 }, lunch: { name: 'Овощной суп', description: 'рыба, рис', calories: 550, protein: 25, fat: 15, carbs: 70 }, dinner: { name: 'Творог', description: 'овощи', calories: 400, protein: 20, fat: 12, carbs: 50 } }, vitamins: 'C, фолиевая кислота, магний' },
  osteoporosis: { goal: 'укрепить костную ткань', bzu: { protein: 100, fat: 75, carbs: 300 }, calories: 2400, meals: { breakfast: { name: 'Творог с ягодами', description: 'молоко', calories: 450, protein: 28, fat: 15, carbs: 55 }, snack1: { name: 'Йогурт', description: 'орехи', calories: 250, protein: 12, fat: 14, carbs: 25 }, lunch: { name: 'Рыба', description: 'овощи, сыр', calories: 650, protein: 38, fat: 22, carbs: 70 }, dinner: { name: 'Кефир', description: 'творог', calories: 400, protein: 25, fat: 14, carbs: 45 } }, vitamins: 'кальций, витамин D, магний, фосфор' },
  arthritis: { goal: 'снизить воспаление суставов', bzu: { protein: 95, fat: 70, carbs: 310 }, calories: 2300, meals: { breakfast: { name: 'Овсянка с орехами', description: 'чай', calories: 420, protein: 18, fat: 16, carbs: 60 }, snack1: { name: 'Ягоды', description: 'йогурт', calories: 200, protein: 8, fat: 6, carbs: 30 }, lunch: { name: 'Рыба', description: 'овощи, оливковое масло', calories: 600, protein: 32, fat: 20, carbs: 65 }, dinner: { name: 'Куриное филе', description: 'салат, кефир', calories: 480, protein: 30, fat: 18, carbs: 50 } }, vitamins: 'омега-3, витамин D, C, E, куркумин' },
  celiac: { goal: 'безглютеновое питание', bzu: { protein: 95, fat: 75, carbs: 280 }, calories: 2200, meals: { breakfast: { name: 'Гречневая каша', description: 'яйцо, чай', calories: 400, protein: 20, fat: 14, carbs: 55 }, snack1: { name: 'Орехи', description: 'фрукты', calories: 220, protein: 9, fat: 13, carbs: 22 }, lunch: { name: 'Рис с курицей', description: 'овощи', calories: 600, protein: 35, fat: 20, carbs: 65 }, dinner: { name: 'Рыба', description: 'картофель, салат', calories: 480, protein: 28, fat: 18, carbs: 50 } }, vitamins: 'железо, фолиевая кислота, B12, D' },
  lactose_intolerance: { goal: 'исключить лактозу', bzu: { protein: 90, fat: 70, carbs: 300 }, calories: 2200, meals: { breakfast: { name: 'Овсянка на воде', description: 'яйцо, чай', calories: 400, protein: 18, fat: 12, carbs: 60 }, snack1: { name: 'Орехи', description: 'фрукты', calories: 200, protein: 8, fat: 12, carbs: 25 }, lunch: { name: 'Куриная грудка', description: 'рис, овощи', calories: 600, protein: 35, fat: 18, carbs: 70 }, dinner: { name: 'Рыба', description: 'картофель, салат', calories: 500, protein: 30, fat: 16, carbs: 55 } }, vitamins: 'кальций, витамин D, B12' },
  ibs: { goal: 'уменьшить симптомы СРК', bzu: { protein: 85, fat: 65, carbs: 290 }, calories: 2100, meals: { breakfast: { name: 'Рисовая каша', description: 'чай', calories: 380, protein: 14, fat: 9, carbs: 65 }, snack1: { name: 'Банан', description: '', calories: 150, protein: 5, fat: 3, carbs: 28 }, lunch: { name: 'Куриный бульон', description: 'котлеты, рис', calories: 570, protein: 28, fat: 16, carbs: 65 }, dinner: { name: 'Рыба на пару', description: 'овощи, чай', calories: 400, protein: 25, fat: 12, carbs: 45 } }, vitamins: 'пробиотики, клетчатка, магний' },
  crohns: { goal: 'щадящее питание при болезни Крона', bzu: { protein: 90, fat: 70, carbs: 300 }, calories: 2200, meals: { breakfast: { name: 'Манная каша', description: 'чай', calories: 350, protein: 15, fat: 8, carbs: 60 }, snack1: { name: 'Печёное яблоко', description: '', calories: 150, protein: 5, fat: 3, carbs: 30 }, lunch: { name: 'Суп-пюре', description: 'котлеты, рис', calories: 580, protein: 28, fat: 18, carbs: 70 }, dinner: { name: 'Творог', description: 'компот', calories: 400, protein: 22, fat: 12, carbs: 50 } }, vitamins: 'B12, D, железо, фолиевая кислота' },
  ulcer: { goal: 'заживление язвы, защита слизистой', bzu: { protein: 85, fat: 65, carbs: 310 }, calories: 2200, meals: { breakfast: { name: 'Овсянка на молоке', description: 'яйцо всмятку, чай', calories: 400, protein: 18, fat: 12, carbs: 60 }, snack1: { name: 'Молоко', description: 'печенье', calories: 200, protein: 8, fat: 5, carbs: 30 }, lunch: { name: 'Суп-пюре', description: 'котлеты на пару, рис', calories: 600, protein: 28, fat: 18, carbs: 75 }, dinner: { name: 'Манная каша', description: 'творог, чай', calories: 400, protein: 20, fat: 10, carbs: 55 } }, vitamins: 'A, E, C, цинк, B12' },
  kidney_disease: { goal: 'снизить нагрузку на почки', bzu: { protein: 60, fat: 70, carbs: 350 }, calories: 2200, meals: { breakfast: { name: 'Каша', description: 'чай', calories: 400, protein: 12, fat: 10, carbs: 70 }, snack1: { name: 'Фрукты', description: '', calories: 180, protein: 4, fat: 3, carbs: 35 }, lunch: { name: 'Овощной суп', description: 'рыба, рис', calories: 580, protein: 20, fat: 18, carbs: 75 }, dinner: { name: 'Овощи', description: 'чай', calories: 440, protein: 15, fat: 12, carbs: 70 } }, vitamins: 'витамин D, кальций, фосфор (ограниченно)' },
  heart_disease: { goal: 'поддержка сердечно-сосудистой системы', bzu: { protein: 90, fat: 65, carbs: 300 }, calories: 2200, meals: { breakfast: { name: 'Овсянка', description: 'ягоды, чай', calories: 400, protein: 16, fat: 10, carbs: 65 }, snack1: { name: 'Орехи', description: 'фрукты', calories: 200, protein: 8, fat: 12, carbs: 25 }, lunch: { name: 'Рыба', description: 'овощи, оливковое масло', calories: 600, protein: 32, fat: 20, carbs: 65 }, dinner: { name: 'Куриное филе', description: 'салат, кефир', calories: 500, protein: 30, fat: 15, carbs: 55 } }, vitamins: 'омега-3, магний, калий, коэнзим Q10' },
  liver_disease: { goal: 'щадящее питание для печени', bzu: { protein: 85, fat: 60, carbs: 320 }, calories: 2200, meals: { breakfast: { name: 'Овсянка', description: 'чай', calories: 380, protein: 14, fat: 9, carbs: 65 }, snack1: { name: 'Творог', description: 'фрукты', calories: 200, protein: 18, fat: 6, carbs: 25 }, lunch: { name: 'Овощной суп', description: 'курица на пару, рис', calories: 580, protein: 28, fat: 16, carbs: 70 }, dinner: { name: 'Рыба', description: 'овощи, чай', calories: 440, protein: 25, fat: 12, carbs: 60 } }, vitamins: 'B-комплекс, витамин E, цинк' },
  asthma: { goal: 'уменьшить воспаление дыхательных путей', bzu: { protein: 90, fat: 70, carbs: 300 }, calories: 2200, meals: { breakfast: { name: 'Овсянка с орехами', description: 'чай', calories: 420, protein: 18, fat: 14, carbs: 60 }, snack1: { name: 'Ягоды', description: 'йогурт', calories: 200, protein: 8, fat: 6, carbs: 30 }, lunch: { name: 'Рыба', description: 'овощи, оливковое масло', calories: 600, protein: 32, fat: 20, carbs: 65 }, dinner: { name: 'Куриное филе', description: 'салат, кефир', calories: 480, protein: 30, fat: 18, carbs: 50 } }, vitamins: 'омега-3, витамин D, C, E, магний' },
  copd: { goal: 'поддержка дыхательной системы', bzu: { protein: 95, fat: 75, carbs: 310 }, calories: 2300, meals: { breakfast: { name: 'Овсянка', description: 'яйцо, чай', calories: 420, protein: 20, fat: 14, carbs: 60 }, snack1: { name: 'Орехи', description: 'фрукты', calories: 220, protein: 9, fat: 13, carbs: 25 }, lunch: { name: 'Куриная грудка', description: 'овощи, оливковое масло', calories: 630, protein: 38, fat: 22, carbs: 70 }, dinner: { name: 'Рыба', description: 'салат, кефир', calories: 480, protein: 28, fat: 18, carbs: 55 } }, vitamins: 'антиоксиданты, витамин D, омега-3' },
  migraine: { goal: 'предотвратить приступы мигрени', bzu: { protein: 90, fat: 70, carbs: 300 }, calories: 2200, meals: { breakfast: { name: 'Овсянка', description: 'чай', calories: 400, protein: 16, fat: 10, carbs: 65 }, snack1: { name: 'Орехи', description: 'фрукты', calories: 200, protein: 8, fat: 12, carbs: 25 }, lunch: { name: 'Рыба', description: 'овощи', calories: 600, protein: 32, fat: 20, carbs: 65 }, dinner: { name: 'Куриное филе', description: 'салат, кефир', calories: 500, protein: 30, fat: 18, carbs: 55 } }, vitamins: 'магний, рибофлавин, коэнзим Q10' },
  epilepsy: { goal: 'кетогенная диета для контроля приступов', bzu: { protein: 100, fat: 120, carbs: 50 }, calories: 2000, meals: { breakfast: { name: 'Омлет с беконом', description: 'авокадо', calories: 550, protein: 30, fat: 45, carbs: 8 }, snack1: { name: 'Орехи', description: 'сыр', calories: 300, protein: 12, fat: 25, carbs: 8 }, lunch: { name: 'Рыба', description: 'овощи, оливковое масло', calories: 650, protein: 35, fat: 35, carbs: 12 }, dinner: { name: 'Куриное филе', description: 'салат, масло', calories: 500, protein: 30, fat: 30, carbs: 10 } }, vitamins: 'B-комплекс, магний, витамин D' },
  depression: { goal: 'поддержка настроения через питание', bzu: { protein: 95, fat: 75, carbs: 310 }, calories: 2300, meals: { breakfast: { name: 'Овсянка с орехами', description: 'ягоды, чай', calories: 450, protein: 18, fat: 16, carbs: 65 }, snack1: { name: 'Банан', description: 'орехи', calories: 250, protein: 8, fat: 12, carbs: 35 }, lunch: { name: 'Рыба', description: 'овощи, оливковое масло', calories: 630, protein: 35, fat: 22, carbs: 70 }, dinner: { name: 'Куриное филе', description: 'салат, кефир', calories: 480, protein: 30, fat: 18, carbs: 55 } }, vitamins: 'омега-3, витамин D, B12, фолиевая кислота' },
  anxiety: { goal: 'снизить тревожность', bzu: { protein: 90, fat: 70, carbs: 300 }, calories: 2200, meals: { breakfast: { name: 'Овсянка', description: 'ягоды, чай', calories: 400, protein: 16, fat: 10, carbs: 65 }, snack1: { name: 'Орехи', description: 'фрукты', calories: 200, protein: 8, fat: 12, carbs: 25 }, lunch: { name: 'Рыба', description: 'овощи, оливковое масло', calories: 600, protein: 32, fat: 20, carbs: 65 }, dinner: { name: 'Куриное филе', description: 'салат, кефир', calories: 500, protein: 30, fat: 18, carbs: 55 } }, vitamins: 'магний, омега-3, витамин D, B-комплекс' },
  pcos: { goal: 'нормализация гормонов и инсулина', bzu: { protein: 100, fat: 80, carbs: 200 }, calories: 2000, meals: { breakfast: { name: 'Омлет', description: 'овощи, чай', calories: 450, protein: 30, fat: 20, carbs: 15 }, snack1: { name: 'Орехи', description: 'яблоко', calories: 200, protein: 8, fat: 12, carbs: 20 }, lunch: { name: 'Куриная грудка', description: 'овощи, оливковое масло', calories: 600, protein: 40, fat: 22, carbs: 50 }, dinner: { name: 'Рыба', description: 'салат, кефир', calories: 450, protein: 32, fat: 18, carbs: 40 } }, vitamins: 'инозитол, витамин D, омега-3, хром' },
  endometriosis: { goal: 'снизить воспаление', bzu: { protein: 90, fat: 70, carbs: 300 }, calories: 2200, meals: { breakfast: { name: 'Овсянка', description: 'ягоды, чай', calories: 400, protein: 16, fat: 10, carbs: 65 }, snack1: { name: 'Орехи', description: 'фрукты', calories: 200, protein: 8, fat: 12, carbs: 25 }, lunch: { name: 'Рыба', description: 'овощи, оливковое масло', calories: 600, protein: 32, fat: 20, carbs: 65 }, dinner: { name: 'Куриное филе', description: 'салат, кефир', calories: 500, protein: 30, fat: 18, carbs: 55 } }, vitamins: 'омега-3, витамин D, C, E, магний' },
  pregnancy: { goal: 'питание для беременных', bzu: { protein: 100, fat: 80, carbs: 350 }, calories: 2500, meals: { breakfast: { name: 'Овсянка', description: 'яйцо, молоко', calories: 500, protein: 22, fat: 16, carbs: 75 }, snack1: { name: 'Йогурт', description: 'фрукты, орехи', calories: 300, protein: 12, fat: 14, carbs: 35 }, lunch: { name: 'Рыба', description: 'овощи, хлеб', calories: 700, protein: 38, fat: 24, carbs: 85 }, dinner: { name: 'Куриное филе', description: 'салат, кефир', calories: 500, protein: 32, fat: 18, carbs: 60 } }, vitamins: 'фолиевая кислота, железо, кальций, D, омега-3' },
  menopause: { goal: 'поддержка в период менопаузы', bzu: { protein: 95, fat: 75, carbs: 280 }, calories: 2100, meals: { breakfast: { name: 'Овсянка с орехами', description: 'ягоды, чай', calories: 450, protein: 20, fat: 16, carbs: 60 }, snack1: { name: 'Творог', description: 'фрукты', calories: 250, protein: 18, fat: 10, carbs: 30 }, lunch: { name: 'Рыба', description: 'овощи, оливковое масло', calories: 630, protein: 35, fat: 22, carbs: 70 }, dinner: { name: 'Куриное филе', description: 'салат, кефир', calories: 480, protein: 30, fat: 18, carbs: 50 } }, vitamins: 'кальций, витамин D, магний, изофлавоны' },
  adhd: { goal: 'поддержка концентрации и внимания', bzu: { protein: 100, fat: 80, carbs: 280 }, calories: 2200, meals: { breakfast: { name: 'Омлет', description: 'овощи, чай', calories: 450, protein: 30, fat: 20, carbs: 20 }, snack1: { name: 'Орехи', description: 'яблоко', calories: 220, protein: 9, fat: 13, carbs: 25 }, lunch: { name: 'Куриная грудка', description: 'овощи, оливковое масло', calories: 630, protein: 40, fat: 22, carbs: 65 }, dinner: { name: 'Рыба', description: 'салат, кефир', calories: 500, protein: 32, fat: 18, carbs: 55 } }, vitamins: 'омега-3, магний, цинк, железо, B-комплекс' },
  autism: { goal: 'специализированное питание', bzu: { protein: 90, fat: 70, carbs: 300 }, calories: 2200, meals: { breakfast: { name: 'Овсянка', description: 'яйцо, чай', calories: 400, protein: 18, fat: 12, carbs: 60 }, snack1: { name: 'Орехи', description: 'фрукты', calories: 200, protein: 8, fat: 12, carbs: 25 }, lunch: { name: 'Куриная грудка', description: 'овощи', calories: 600, protein: 35, fat: 18, carbs: 65 }, dinner: { name: 'Рыба', description: 'салат, кефир', calories: 500, protein: 30, fat: 18, carbs: 55 } }, vitamins: 'омега-3, витамин D, магний, пробиотики' },
  fibromyalgia: { goal: 'снизить боль и воспаление', bzu: { protein: 90, fat: 75, carbs: 300 }, calories: 2200, meals: { breakfast: { name: 'Овсянка с орехами', description: 'ягоды, чай', calories: 420, protein: 18, fat: 14, carbs: 60 }, snack1: { name: 'Орехи', description: 'фрукты', calories: 200, protein: 8, fat: 12, carbs: 25 }, lunch: { name: 'Рыба', description: 'овощи, оливковое масло', calories: 600, protein: 32, fat: 20, carbs: 65 }, dinner: { name: 'Куриное филе', description: 'салат, кефир', calories: 500, protein: 30, fat: 18, carbs: 55 } }, vitamins: 'магний, омега-3, витамин D, коэнзим Q10' }
};

// Функция для генерации вариантов блюд для каждого дня недели
const generateMealVariations = (baseMeal, dayIndex) => {
  const variations = {
    breakfast: [
      { name: 'Овсяная каша на воде с молоком', description: 'яйцо всмятку, слабый чай', calories: 400, protein: 18, fat: 12, carbs: 60 },
      { name: 'Гречневая каша с маслом', description: 'омлет, травяной чай', calories: 420, protein: 20, fat: 14, carbs: 58 },
      { name: 'Рисовая каша на молоке', description: 'творог 5%, компот', calories: 410, protein: 19, fat: 13, carbs: 62 },
      { name: 'Манная каша', description: 'яйцо пашот, зелёный чай', calories: 390, protein: 17, fat: 11, carbs: 59 },
      { name: 'Омлет из 2 яиц', description: 'хлеб с маслом, чай', calories: 430, protein: 22, fat: 15, carbs: 45 },
      { name: 'Творожная запеканка', description: 'сметана 10%, чай', calories: 415, protein: 21, fat: 13, carbs: 52 },
      { name: 'Сырники на пару', description: 'мёд, травяной чай', calories: 425, protein: 20, fat: 14, carbs: 55 }
    ],
    snack1: [
      { name: 'Банан', description: 'тёплое молоко', calories: 200, protein: 8, fat: 5, carbs: 30 },
      { name: 'Яблоко', description: 'кефир 1%', calories: 180, protein: 7, fat: 4, carbs: 28 },
      { name: 'Груша', description: 'йогурт натуральный', calories: 190, protein: 8, fat: 5, carbs: 29 },
      { name: 'Творог 5%', description: 'ягоды', calories: 210, protein: 15, fat: 6, carbs: 25 },
      { name: 'Орехи', description: 'сухофрукты', calories: 220, protein: 9, fat: 12, carbs: 22 },
      { name: 'Йогурт', description: 'мюсли', calories: 195, protein: 8, fat: 5, carbs: 30 },
      { name: 'Кефир 1%', description: 'печенье галетное', calories: 185, protein: 7, fat: 4, carbs: 28 }
    ],
    lunch: [
      { name: 'Суп-пюре из картофеля и моркови', description: 'паровые котлеты, рис, компот', calories: 600, protein: 25, fat: 20, carbs: 80 },
      { name: 'Овощной суп', description: 'рыба на пару, гречка, салат', calories: 580, protein: 28, fat: 18, carbs: 75 },
      { name: 'Куриный бульон', description: 'куриная грудка, макароны, овощи', calories: 620, protein: 30, fat: 22, carbs: 82 },
      { name: 'Борщ вегетарианский', description: 'котлеты из индейки, картофель', calories: 590, protein: 27, fat: 19, carbs: 78 },
      { name: 'Суп с фрикадельками', description: 'овощное рагу, хлеб', calories: 610, protein: 29, fat: 21, carbs: 80 },
      { name: 'Уха из судака', description: 'рис, салат из овощей', calories: 595, protein: 26, fat: 20, carbs: 76 },
      { name: 'Суп-лапша', description: 'куриное филе, овощи на пару', calories: 605, protein: 28, fat: 21, carbs: 79 }
    ],
    dinner: [
      { name: 'Манная каша', description: 'творог 5%, ромашковый чай', calories: 400, protein: 20, fat: 10, carbs: 55 },
      { name: 'Запечённая рыба', description: 'тушёные овощи, чай', calories: 420, protein: 32, fat: 12, carbs: 45 },
      { name: 'Куриное филе на пару', description: 'овощной салат, кефир', calories: 410, protein: 35, fat: 11, carbs: 40 },
      { name: 'Творожная запеканка', description: 'сметана 10%, травяной чай', calories: 395, protein: 22, fat: 10, carbs: 50 },
      { name: 'Омлет с овощами', description: 'салат, ряженка', calories: 405, protein: 24, fat: 12, carbs: 42 },
      { name: 'Тушёная индейка', description: 'гречка, овощи, чай', calories: 415, protein: 30, fat: 13, carbs: 48 },
      { name: 'Рыбные котлеты на пару', description: 'рис, салат, кефир', calories: 400, protein: 28, fat: 11, carbs: 46 }
    ]
  };

  const mealType = baseMeal.type || 'breakfast';
  const mealVariations = variations[mealType] || [baseMeal];
  return mealVariations[dayIndex % mealVariations.length];
};

const GeneratorPage = () => {
  const navigate = useNavigate();
  
  // Загружаем данные пользователя из localStorage или профиля
  const getUserProfile = () => {
    const storedAge = localStorage.getItem('userAge');
    const storedWeight = localStorage.getItem('userWeight');
    const storedHeight = localStorage.getItem('userHeight');
    const storedName = localStorage.getItem('userName') || '';
    
    return {
      age: storedAge || '',
      weight: storedWeight || '',
      height: storedHeight || '',
      name: storedName
    };
  };

  const userProfile = getUserProfile();
  
  const [userData, setUserData] = useState({
    name: userProfile.name,
    age: userProfile.age,
    weight: userProfile.weight,
    height: userProfile.height,
    gender: '',
    disease: '',
    allergies: '',
    duration: 'week',
    activityLevel: 'moderate'
  });

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dietPlan, setDietPlan] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const steps = ['Персональные данные', 'Медицинская информация', 'Результат'];

  const calculateCalories = () => {
    const age = parseInt(userData.age) || 30;
    const weight = parseInt(userData.weight) || 70;
    const height = parseInt(userData.height) || 170;
    
    let bmr = userData.gender === 'male' 
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;
    
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      high: 1.725,
      athlete: 1.9
    };
    
    return Math.round(bmr * (multipliers[userData.activityLevel] || 1.55));
  };

  const generateDietPlan = () => {
    const baseCalories = calculateCalories();
    const diseasePlan = diseasePlans[userData.disease] || diseasePlans.gastritis;
    
    const adjustedCalories = Math.round(baseCalories * (diseasePlan.calories / 2000));
    const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
    
    // Генерируем разные блюда для каждого дня недели
    const dailyMeals = days.map((day, dayIndex) => {
      // Базовые блюда из плана болезни
      const baseBreakfast = { type: 'Завтрак', ...diseasePlan.meals.breakfast };
      const baseSnack = { type: 'Перекус', ...diseasePlan.meals.snack1 };
      const baseLunch = { type: 'Обед', ...diseasePlan.meals.lunch };
      const baseDinner = { type: 'Ужин', ...diseasePlan.meals.dinner };
      
      // Генерируем варианты для каждого дня
      const breakfast = generateMealVariations(baseBreakfast, dayIndex);
      const snack = generateMealVariations(baseSnack, dayIndex);
      const lunch = generateMealVariations(baseLunch, dayIndex);
      const dinner = generateMealVariations(baseDinner, dayIndex);
      
      return {
        day,
        meals: [
          { type: 'Завтрак', ...breakfast },
          { type: 'Перекус', ...snack },
          { type: 'Обед', ...lunch },
          { type: 'Ужин', ...dinner }
        ]
      };
    });
    
    return {
      name: `План для ${userData.name} (${diseases.find(d => d.value === userData.disease)?.label || userData.disease})`,
      duration: userData.duration,
      disease: userData.disease,
      totalCalories: adjustedCalories,
      bzu: diseasePlan.bzu,
      recommendations: `Цель: ${diseasePlan.goal}`,
      vitamins: diseasePlan.vitamins,
      createdAt: new Date().toISOString(),
      dailyMeals
    };
  };

const savePlanToDatabase = async (plan) => {
  try {
    // Сохраняем план в localStorage
    const savedPlan = await StorageService.savePlan(plan);
    console.log("План успешно сохранен в localStorage:", savedPlan);
    setSaveSuccess(true);
    return savedPlan;
    
  } catch (error) {
    console.error("Детали ошибки сохранения:", error);
    setError(`Не удалось сохранить план: ${error.message}`);
    return null;
  }
};

  const handleNext = () => {
    if (activeStep === 0) {
      // Проверяем обязательные поля (имя и пол всегда обязательны)
      if (!userData.name || !userData.gender) {
        setError('Пожалуйста, заполните имя и выберите пол');
        return;
      }
      // Если нет данных в профиле, требуем заполнения
      if (!userProfile.age && !userData.age) {
        setError('Пожалуйста, укажите возраст (можно в профиле)');
        return;
      }
      if (!userProfile.weight && !userData.weight) {
        setError('Пожалуйста, укажите вес (можно в профиле)');
        return;
      }
      if (!userProfile.height && !userData.height) {
        setError('Пожалуйста, укажите рост (можно в профиле)');
        return;
      }
      // Используем данные из профиля, если они есть
      if (!userData.age && userProfile.age) {
        setUserData({...userData, age: userProfile.age});
      }
      if (!userData.weight && userProfile.weight) {
        setUserData({...userData, weight: userProfile.weight});
      }
      if (!userData.height && userProfile.height) {
        setUserData({...userData, height: userProfile.height});
      }
    }
    if (activeStep === 1 && !userData.disease) {
      setError('Пожалуйста, выберите заболевание');
      return;
    }
    setError('');
    setActiveStep(prev => prev + 1);
    
    if (activeStep === 1) {
      setLoading(true);
      setTimeout(async () => {
        const plan = generateDietPlan();
        setDietPlan(plan);
        
        // Сохраняем план в базу данных
        await savePlanToDatabase(plan);
        
        setLoading(false);
      }, 2000);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    setError('');
  };

  const handleViewAllPlans = () => {
    navigate('/plans');
  };

  return (
    <Container maxWidth="lg" style={{ padding: '32px 0' }} className="fade-in-up">
      <Paper elevation={0} style={{ 
        padding: '48px', 
        marginBottom: '32px',
        background: 'rgba(255,255,255,0.98)',
        backdropFilter: 'blur(20px)',
        borderRadius: '32px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        border: '1px solid rgba(255,255,255,0.3)',
        animation: 'fadeInUp 0.8s ease-out'
      }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" style={{ 
          background: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: 800,
          marginBottom: '8px'
        }}>
          🍽️ Генератор индивидуального рациона
        </Typography>

        <Stepper activeStep={activeStep} style={{ marginBottom: '32px' }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" style={{ marginBottom: '16px' }}>
            {error}
          </Alert>
        )}

        {saveSuccess && activeStep === 2 && (
          <Alert severity="success" style={{ marginBottom: '16px' }}>
            ✅ План успешно сохранён в базу данных!
          </Alert>
        )}

        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom style={{ color: '#2E8B57' }}>
              📊 Персональные данные
            </Typography>
            {userProfile.name && (
              <Alert severity="info" style={{ marginBottom: '16px' }}>
                Используются данные из вашего профиля. При необходимости вы можете изменить их ниже.
              </Alert>
            )}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Имя"
                  value={userData.name}
                  onChange={(e) => setUserData({...userData, name: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Возраст"
                  type="number"
                  value={userData.age}
                  onChange={(e) => setUserData({...userData, age: e.target.value})}
                  helperText={userProfile.age ? "Из профиля" : ""}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Вес (кг)"
                  type="number"
                  value={userData.weight}
                  onChange={(e) => setUserData({...userData, weight: e.target.value})}
                  helperText={userProfile.weight ? "Из профиля" : ""}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Рост (см)"
                  type="number"
                  value={userData.height}
                  onChange={(e) => setUserData({...userData, height: e.target.value})}
                  helperText={userProfile.height ? "Из профиля" : ""}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Пол</InputLabel>
                  <Select
                    value={userData.gender}
                    label="Пол"
                    onChange={(e) => setUserData({...userData, gender: e.target.value})}
                  >
                    <MenuItem value="male">Мужской</MenuItem>
                    <MenuItem value="female">Женский</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Уровень активности</InputLabel>
                  <Select
                    value={userData.activityLevel}
                    label="Уровень активности"
                    onChange={(e) => setUserData({...userData, activityLevel: e.target.value})}
                  >
                    {activityLevels.map((level) => (
                      <MenuItem key={level.value} value={level.value}>
                        {level.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom style={{ color: '#2E8B57' }}>
              🏥 Медицинская информация
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Заболевание</InputLabel>
                  <Select
                    value={userData.disease}
                    label="Заболевание"
                    onChange={(e) => setUserData({...userData, disease: e.target.value})}
                  >
                    {diseases.map((disease) => (
                      <MenuItem key={disease.value} value={disease.value}>
                        {disease.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Период питания</InputLabel>
                  <Select
                    value={userData.duration}
                    label="Период питания"
                    onChange={(e) => setUserData({...userData, duration: e.target.value})}
                  >
                    {durations.map((duration) => (
                      <MenuItem key={duration.value} value={duration.value}>
                        {duration.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Аллергии и ограничения"
                  multiline
                  rows={3}
                  value={userData.allergies}
                  onChange={(e) => setUserData({...userData, allergies: e.target.value})}
                  placeholder="Укажите аллергии, непереносимости или другие ограничения..."
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {activeStep === 2 && (
          <Box>
            {loading ? (
              <Box textAlign="center" style={{ padding: '32px 0' }}>
                <Typography variant="h6" gutterBottom>
                  🍳 Генерируем ваш индивидуальный рацион...
                </Typography>
                <Typography color="text.secondary">
                  Это займет всего несколько секунд
                </Typography>
              </Box>
            ) : dietPlan && (
              <Box>
                <Typography variant="h5" gutterBottom style={{ color: '#2E8B57' }}>
                  🎉 Ваш индивидуальный рацион готов!
                </Typography>
                
                <Grid container spacing={3} style={{ marginBottom: '32px' }}>
                  <Grid item xs={12} md={3}>
                    <Card style={{ 
                      padding: '24px', 
                      textAlign: 'center', 
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      color: 'white',
                      borderRadius: '20px',
                      boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    sx={{
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.05)',
                        boxShadow: '0 20px 40px rgba(16, 185, 129, 0.4)',
                      }
                    }}>
                      <CardContent>
                        <Typography variant="h6" style={{ fontWeight: 600, marginBottom: '8px' }}>Калории</Typography>
                        <Typography variant="h3" style={{ fontWeight: 800, marginBottom: '4px' }}>{dietPlan.totalCalories}</Typography>
                        <Typography variant="body2" style={{ opacity: 0.9 }}>ккал/день</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card style={{ 
                      padding: '24px', 
                      textAlign: 'center', 
                      background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                      color: 'white',
                      borderRadius: '20px',
                      boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    sx={{
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.05)',
                        boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)',
                      }
                    }}>
                      <CardContent>
                        <Typography variant="h6" style={{ fontWeight: 600, marginBottom: '8px' }}>Белки</Typography>
                        <Typography variant="h3" style={{ fontWeight: 800 }}>{dietPlan.bzu.protein}g</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card style={{ 
                      padding: '24px', 
                      textAlign: 'center', 
                      background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                      color: 'white',
                      borderRadius: '20px',
                      boxShadow: '0 10px 30px rgba(245, 158, 11, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    sx={{
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.05)',
                        boxShadow: '0 20px 40px rgba(245, 158, 11, 0.4)',
                      }
                    }}>
                      <CardContent>
                        <Typography variant="h6" style={{ fontWeight: 600, marginBottom: '8px' }}>Жиры</Typography>
                        <Typography variant="h3" style={{ fontWeight: 800 }}>{dietPlan.bzu.fat}g</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card style={{ 
                      padding: '24px', 
                      textAlign: 'center', 
                      background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                      color: 'white',
                      borderRadius: '20px',
                      boxShadow: '0 10px 30px rgba(239, 68, 68, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    sx={{
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.05)',
                        boxShadow: '0 20px 40px rgba(239, 68, 68, 0.4)',
                      }
                    }}>
                      <CardContent>
                        <Typography variant="h6" style={{ fontWeight: 600, marginBottom: '8px' }}>Углеводы</Typography>
                        <Typography variant="h3" style={{ fontWeight: 800 }}>{dietPlan.bzu.carbs}g</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                <Alert severity="info" style={{ marginBottom: '24px' }}>
                  <Typography variant="subtitle1" gutterBottom>
                    <LocalHospital style={{ marginRight: '8px' }} />
                    Рекомендации:
                  </Typography>
                  <Typography>{dietPlan.recommendations}</Typography>
                  <Typography variant="subtitle2" style={{ marginTop: '8px' }}>
                    💊 Витамины: {dietPlan.vitamins}
                  </Typography>
                </Alert>

                <Typography variant="h6" gutterBottom>
                  📅 План питания на {durations.find(d => d.value === dietPlan.duration)?.label.toLowerCase()}
                </Typography>

                {dietPlan.dailyMeals.map((dayMeals, index) => (
                  <Accordion 
                    key={index} 
                    style={{ 
                      marginBottom: '8px',
                      animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">{dayMeals.day}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        {dayMeals.meals.map((meal, mealIndex) => (
                          <Grid item xs={12} md={6} key={mealIndex}>
                            <Card style={{ 
                              padding: '16px', 
                              borderLeft: '4px solid', 
                              borderColor: '#2E8B57',
                              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                            sx={{
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 12px 24px rgba(46, 139, 87, 0.2)',
                              }
                            }}>
                              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                                <Typography variant="subtitle1" style={{ color: '#2E8B57', fontWeight: 'bold' }}>
                                  {meal.type}
                                </Typography>
                                <Chip 
                                  label={`${meal.calories} ккал`} 
                                  size="small" 
                                  style={{ borderColor: '#2E8B57', color: '#2E8B57' }}
                                  variant="outlined"
                                />
                              </Box>
                              <Typography variant="h6" gutterBottom>
                                {meal.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" style={{ marginBottom: '16px' }}>
                                {meal.description}
                              </Typography>
                              <Box style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <Chip label={`Б: ${meal.protein}g`} size="small" variant="outlined" />
                                <Chip label={`Ж: ${meal.fat}g`} size="small" variant="outlined" />
                                <Chip label={`У: ${meal.carbs}g`} size="small" variant="outlined" />
                              </Box>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            )}
          </Box>
        )}

        <Box style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            Назад
          </Button>
          <Box style={{ display: 'flex', gap: '16px' }}>
            {activeStep === 2 && (
              <Button
                variant="outlined"
                onClick={handleViewAllPlans}
                style={{ borderColor: '#2E8B57', color: '#2E8B57' }}
              >
                Посмотреть все планы
              </Button>
            )}
            {activeStep < steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading}
                style={{ 
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: 'white',
                  fontWeight: 600,
                  padding: '12px 32px',
                  borderRadius: '12px',
                  boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                sx={{
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 30px rgba(16, 185, 129, 0.4)',
                  },
                  '&:disabled': {
                    background: '#9CA3AF',
                  }
                }}
              >
                Далее
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => {
                  setActiveStep(0);
                  setDietPlan(null);
                  setSaveSuccess(false);
                  setUserData({
                    name: '',
                    age: '',
                    weight: '',
                    height: '',
                    gender: '',
                    disease: '',
                    allergies: '',
                    duration: 'week',
                    activityLevel: 'moderate'
                  });
                }}
                style={{ backgroundColor: '#2E8B57' }}
              >
                Создать новый рацион
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default GeneratorPage;