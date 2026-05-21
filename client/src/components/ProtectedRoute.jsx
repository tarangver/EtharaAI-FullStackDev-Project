import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from './Loader';

export default function ProtectedRoute({ children, roles }) {
  const { token, user, getDefaultRoute, loading } = useContext(AuthContext);

  if (loading) {
    return <Loader message="Loading your workspace..." />;
  }

  // Safe hydration check: if token is present but user profile is not resolved yet
  if (token && !user) {
    return <Loader message="Authenticating session..." />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to={getDefaultRoute(user)} replace />;
  }

  return children;
}
