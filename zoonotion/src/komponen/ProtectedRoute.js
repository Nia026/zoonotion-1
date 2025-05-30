import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAdmin, children }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    // Kalau user belum login, redirect ke login
    return <Navigate to="/login" replace />;
  }

  if (isAdmin && user.role !== 'admin') {
    // Kalau butuh admin tapi user bukan admin, redirect ke home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
