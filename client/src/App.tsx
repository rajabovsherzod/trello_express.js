import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '@/components/shared/Navbar';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { refreshToken as refreshTokenApi } from './api/auth';
import { userAuthStore } from './store/auth.store';
import { Footer } from '@/components/shared/Footer';

function App() {
  const { refreshToken, setTokens, logout } = userAuthStore();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      if (!refreshToken) {
        // Agar store'da refresh token bo'lmasa, hech nima qilmaymiz yoki logout qilamiz
        // Bu holatda foydalanuvchi shundoq ham himoyalangan sahifalarga kira olmaydi
        return;
      }

      try {
        const { user, accessToken, refreshToken: newRefreshToken } = await refreshTokenApi(refreshToken);
        setTokens(accessToken, newRefreshToken, user);
      } catch (error) {
        console.error("Failed to refresh token:", error);
        logout(); // Token yaroqsiz bo'lsa, tizimdan chiqarib yuboramiz
      }
    };

    // Har 29 daqiqada tokenni yangilab turish (30 daqiqalik access token uchun)
    const interval = setInterval(() => {
        checkAuth();
    }, 29 * 60 * 1000); 

    // Komponent yo'q qilinganda intervalni tozalash
    return () => clearInterval(interval);

  }, [refreshToken, setTokens, logout]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="trello-theme-final">
      <Toaster />
      <div className="relative flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="flex-1 pt-14">
          <Outlet />
        </main>
        {!location.pathname.startsWith('/auth') && <Footer />}
      </div>
    </ThemeProvider>
  );
}

export default App;