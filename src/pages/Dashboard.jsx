import React from 'react';
import { useSelector } from 'react-redux';
import ClientDashboard from '../components/dashboard/ClientDashboard';
import TrainerDashboard from '../components/dashboard/TrainerDashboard'

const Dashboard = () => {
  // Get user from Redux store
  const { user, isLoading } = useSelector((state) => state.auth);
  
  console.log("Dashboard rendering with user:", user);
  console.log("Is loading:", isLoading);

  if (isLoading) {
    return <div style={{padding: "20px"}}>Loading user data...</div>;
  }

  if (!user) {
    return <div style={{padding: "20px"}}>No user data found. Please log in again.</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
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
              <ClientDashboard />
            ) : (
              <TrainerDashboard />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;