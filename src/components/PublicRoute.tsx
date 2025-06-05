import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface Props {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: Props) => {
  const auth = useContext(AuthContext);

  if (auth?.user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
