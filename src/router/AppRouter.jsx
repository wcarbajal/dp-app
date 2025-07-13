import { AuthContext } from '@/auth/AuthContext';
import { DashboardPage } from '@/pages/DashboardPage';
import { ErrorPage } from '@/pages/ErrorPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { useContext, useEffect } from 'react';
import { Route, Routes } from 'react-router';
import { PublicRoute } from './PublicRoute';
import { AuthRouter } from './AuthRouter';
import { PrivateRoute } from './PrivateRoute';


export const AppRouter = () => {

  const { auth, verificaToken } = useContext( AuthContext );

  useEffect( () => {
    verificaToken();

  }, [ verificaToken ] );


  if ( auth.checking ) {
    return <h1>Espere por favor ...</h1>;
  }
  return (


    <Routes >
      <Route element={ <PublicRoute isAuthenticated={ !auth.logged } /> } >
        <Route path="auth/*" element={ <AuthRouter /> } />
      </Route>
      <Route element={ <PrivateRoute isAuthenticated={ auth.logged } /> } >
        <Route path="/" element={ <DashboardPage /> } />
      </Route>
      <Route path="*" element={ <ErrorPage /> } />
    </Routes>
  );
};