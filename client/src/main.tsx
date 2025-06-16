import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes'; // Biz yaratgan marshrutlarni import qilamiz
import { ThemeProvider } from './components/providers/theme-provider';
import { Toaster } from './components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
    <Toaster richColors/>
  </React.StrictMode>
);