import { Route, Routes } from 'react-router';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ErrorPage } from '../pages/ErrorPage';

export const AuthRouter = () => {
  return (
  
          <Routes >
            <Route path="login" element={ <LoginPage /> } />
            <Route path="register" element={ <RegisterPage /> } />
            <Route path="*" element={ <ErrorPage /> } />
            
          </Routes>


  );
};