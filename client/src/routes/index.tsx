import { createBrowserRouter } from 'react-router-dom';
import App from '@/App';
import HomePage from '@/pages/HomePage';
import AuthPage from '@/pages/AuthPage';
import DashboardPage from '@/pages/DashboardPage';
import BoardPage from '@/pages/BoardPage';
import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './GuestRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    // Bu yerda xatolik sahifasini ham qo'shsak bo'ladi
    children: [
      // Routes for guests (not authenticated)
      {
        element: <GuestRoute />,
        children: [
          {
            index: true, // Bu asosiy (bosh) sahifa ekanligini bildiradi
            element: <HomePage />,
          },
          {
            path: 'auth',
            element: <AuthPage />,
          },
        ]
      },
      // Routes for authenticated users
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'dashboard',
            element: <DashboardPage />,
          },
          {
            path: 'board/:boardId',
            element: <BoardPage />,
          },
        ],
      },
    ],
  },
]);