import { userAuthStore } from '@/store/auth.store';
import { Navigate, Outlet } from 'react-router-dom';

const GuestRoute = () => {
  const { isAuthenticated } = userAuthStore();

  if (isAuthenticated) {
    // If the user is authenticated, redirect them to the dashboard.
    return <Navigate to="/dashboard" replace />;
  }

  // If the user is not authenticated, render the child routes (e.g., HomePage, AuthPage).
  return <Outlet />;
};

export default GuestRoute;
