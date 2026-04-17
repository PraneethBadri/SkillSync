import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function ProtectedRoute({ allowedRoles }) {
  const { user, openModal } = useAuth();

  // If there is no user at all, redirect to home page and prompt them to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If a specific role is required (e.g. only 'seeker' or only 'recruiter')
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If they are a recruiter trying to access a seeker page, send them away
    return <Navigate to="/dashboard" replace />;
  }

  // If they pass validation, render the child routes!
  return <Outlet />;
}
