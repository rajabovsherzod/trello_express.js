import { Outlet } from 'react-router-dom';
import Navbar from '@/components/shared/Navbar';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { refreshToken } from './api/auth';
import { userAuthStore } from './store/auth.store';

function App() {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user, accessToken } = await refreshToken();
        userAuthStore.getState().setUser(user, accessToken);
      } catch (error) {
        console.log('Could not refresh token. User is not logged in.');
      }
    };

    checkAuth();
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="trello-theme-final">
      <div className="relative flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="flex-1 pt-14">
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;