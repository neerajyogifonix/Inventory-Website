import { memo } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import type { RootState } from '../store/store';

const ProtectedRoute = memo(() => {
  const token = useSelector((state: RootState) => state.user.token);
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  
  if (!token || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
});

export default ProtectedRoute;