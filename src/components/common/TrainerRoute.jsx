import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from './Spinner';

const TrainerRoute = ({ children }) => {
  const { user, isLoading } = useSelector((state) => state.auth);
  
  if (isLoading) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.userType !== 'trainer') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default TrainerRoute;