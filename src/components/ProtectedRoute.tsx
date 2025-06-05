import { Navigate } from 'react-router-dom';
import { AuthContext, /* useAuth*/ } from '../context/AuthContext';
import { ReactNode, useContext } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // const { isAuthenticated } = useAuth();
  const auth = useContext(AuthContext)

  // if (!isAuthenticated) {
  //   return <Navigate to="/auth" replace />;
  // }
  if (!auth?.user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
