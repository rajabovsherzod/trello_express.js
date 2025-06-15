import { Outlet } from 'react-router-dom';
import Navbar from '@/components/shared/Navbar';
import { ThemeProvider } from '@/components/providers/theme-provider';

function App() {
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