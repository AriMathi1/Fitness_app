import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from './Spinner';

const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useSelector((state) => state.auth);
  
  if (isLoading) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;