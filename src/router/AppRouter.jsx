import { DashboardPage } from '@/pages/DashboardPage';
import { ErrorPage } from '@/pages/ErrorPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { Route, Routes } from 'react-router';


export const AppRouter = () => {
  return (
    <Routes>
      <Route index element={ <DashboardPage /> } />
      <Route path="login" element={ <LoginPage /> } />
      <Route path="register" element={ <RegisterPage /> } />
      <Route path="*" element={ <ErrorPage /> } />
    </Routes>
  );
};