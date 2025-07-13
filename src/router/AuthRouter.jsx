import { Route, Routes } from 'react-router';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
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