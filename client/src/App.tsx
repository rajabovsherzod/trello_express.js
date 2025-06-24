import { Outlet, useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/shared/Navbar';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { me } from './api/auth'; // Import nomini soddalashtiramiz
import { userAuthStore } from './store/auth.store';
import { Footer } from '@/components/shared/Footer';
import { cn } from '@/lib/utils';

function App() {
  const { setTokens, logout } = userAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    
    // Agar URL'da token bo'lsa, shu blok ishlaydi
    if (accessToken) {
      console.log("Found accessToken in URL:", accessToken);

      const validateToken = async (token: string) => {
        try {
          // 1. Tokkeni vaqtinchalik store'ga qo'yamiz
          setTokens(token, null); 
          console.log("Token set in store temporarily.");

          // 2. /me so'rovini yuboramiz
          console.log("Calling 'me' API...");
          const userData = await me();
          console.log("User data received:", userData);
          
          // 3. To'liq ma'lumot bilan store'ni yangilaymiz
          setTokens(token, userData);

          // 4. URL'ni tozalaymiz
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.delete('accessToken');
          setSearchParams(newSearchParams, { replace: true });
          
          console.log("Redirecting to dashboard...");
          navigate('/dashboard', { replace: true });
        } catch (error) {
          console.error("Token validation failed:", error);
          logout();
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.delete('accessToken');
          setSearchParams(newSearchParams, { replace: true });
        }
      };

      validateToken(accessToken);
    }
  }, [searchParams, setSearchParams, setTokens, logout, navigate]);


  const isBoardPage = location.pathname.startsWith('/board');
  const isAuthPage = location.pathname.startsWith('/auth') || location.pathname.startsWith('/verify-email');

  return (
    <ThemeProvider defaultTheme="dark" storageKey="trello-theme-final">
      <Toaster />
      <div className="flex min-h-screen flex-col bg-background">
        {!isBoardPage && <Navbar />}
        <main className={cn( "flex-grow", !isBoardPage && "pt-14" )}>
          <Outlet />
        </main>
        {!isAuthPage && !isBoardPage && <Footer />}
      </div>
    </ThemeProvider>
  );
}

export default App;