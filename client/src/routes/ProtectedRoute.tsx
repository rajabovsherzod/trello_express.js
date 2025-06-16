import { userAuthStore } from '@/store/auth.store';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { isAuthenticated } = userAuthStore();

  // Agar foydalanuvchi tizimga kirmagan bo'lsa, uni /auth sahifasiga yo'naltiramiz.
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Agar tizimga kirgan bo'lsa, himoyalangan sahifalarni (masalan, Dashboard) ko'rsatamiz.
  return <Outlet />;
};

export default ProtectedRoute;
