import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../features/auth/authSlice';
import ClientDashboard from '../components/dashboard/ClientDashboard';
import TrainerDashboard from '../components/dashboard/TrainerDashboard';
import Spinner from '../components/common/Spinner';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Expired</h2>
          <p className="text-gray-600 mb-6">Your session has expired. Please log in again to continue.</p>
          <Link
            to="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Link
            to="/profile"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Edit Profile
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-indigo-600 px-6 py-4">
            <h2 className="text-white text-lg font-medium">
              Welcome back, {user.name}!
            </h2>
          </div>
          
          <div className="px-6 py-4">
            <p className="text-gray-600 mb-4">
              {user.userType === 'client'
                ? 'Find and book your next fitness class below.'
                : 'Manage your classes and bookings below.'}
            </p>
            
            {user.userType === 'client' ? (
              <ClientDashboard user={user} />
            ) : (
              <TrainerDashboard user={user} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;