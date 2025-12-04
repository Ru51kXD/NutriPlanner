import React from 'react';
import { Navigate } from 'react-router-dom';

export const AuthGuard = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export const GuestGuard = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};