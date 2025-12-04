import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthGuard, GuestGuard } from './guards';
import Dashboard from '../views/Dashboard';
import LoginPage from '../views/LoginPage';
import RegisterPage from '../views/RegisterPage';
import ProfilePage from '../views/ProfilePage';
import PlansPage from '../views/PlansPage';
import GeneratorPage from '../views/GeneratorPage';
import ProgressPage from '../views/ProgressPage';
import DiaryPage from '../views/DiaryPage';
import AdminPage from '../views/AdminPage';
import RecipeGeneratorPage from '../views/RecipeGeneratorPage';
import SeasonalMenuPage from '../views/SeasonalMenuPage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      
      <Route path="/login" element={
        <GuestGuard>
          <LoginPage />
        </GuestGuard>
      } />
      <Route path="/register" element={
        <GuestGuard>
          <RegisterPage />
        </GuestGuard>
      } />

      <Route path="/profile" element={
        <AuthGuard>
          <ProfilePage />
        </AuthGuard>
      } />
      <Route path="/plans" element={
        <AuthGuard>
          <PlansPage />
        </AuthGuard>
      } />
      <Route path="/generator" element={
        <AuthGuard>
          <GeneratorPage />
        </AuthGuard>
      } />
      <Route path="/progress" element={
        <AuthGuard>
          <ProgressPage />
        </AuthGuard>
      } />
      <Route path="/diary" element={
        <AuthGuard>
          <DiaryPage />
        </AuthGuard>
      } />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/recipe-generator" element={
        <AuthGuard>
          <RecipeGeneratorPage />
        </AuthGuard>
      } />
      <Route path="/seasonal-menu" element={
        <AuthGuard>
          <SeasonalMenuPage />
        </AuthGuard>
      } />
    </Routes>
  );
};

export default AppRouter;