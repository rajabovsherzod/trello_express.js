import { createBrowserRouter } from 'react-router-dom';
import App from '@/App';
import HomePage from '@/pages/HomePage';
import AuthPage from '@/pages/AuthPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    // Bu yerda xatolik sahifasini ham qo'shsak bo'ladi
    children: [
      {
        index: true, // Bu asosiy (bosh) sahifa ekanligini bildiradi
        element: <HomePage />,
      },
      {
        path: 'auth',
        element: <AuthPage />,
      },
    ],
  },
]);