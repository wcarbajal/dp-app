import { Navigate, Outlet } from 'react-router';


export const PublicRoute = ( {
  isAuthenticated
} ) => {

  if ( !isAuthenticated ) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};
