import React from 'react';
import { Navigate, Outlet } from 'react-router';


export const PrivateRoute = ( {
  isAuthenticated
} ) => {

  if ( !isAuthenticated ) {
    return <Navigate to="auth/login" replace />;
  }
  return <Outlet />;
};
