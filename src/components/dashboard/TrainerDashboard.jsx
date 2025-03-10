import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../../api/axiosConfig';
import Spinner from '../common/Spinner';

const TrainerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [stats, setStats] = useState({ totalClasses: 0, totalBookings: 0, totalReviews: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // At the beginning of your TrainerDashboard component
console.log("TrainerDashboard is rendering");
return (
  <div>
    <h1>Dashboard is loading...</h1>
    {/* Rest of your component */}
  </div>
);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Debug the user object
        console.log("User object:", user);

        // Extract user ID - handle both possible user object structures
        let userId;

        if (user._id) {
          // Case 1: We have the full user object with _id
          userId = user._id;
        }
        else if (user.token) {
          // Case 2: We only have the token - extract ID from JWT
          try {
            const tokenPayload = user.token.split('.')[1];
            const decodedPayload = JSON.parse(atob(tokenPayload));
            userId = decodedPayload.user.id;
            console.log("Extracted user ID from token:", userId);
          } catch (err) {
            console.error("Error extracting ID from token:", err);
          }
        }

        if (!userId) {
          console.error("No user ID available in user object:", user);
          setError('User information is missing. Please log out and log in again.');
          setIsLoading(false);
          return;
        }

        console.log("Using user ID:", userId);

        // Now use the userId for API calls
        console.log("Full URL for bookings:", axiosInstance.defaults.baseURL + "/bookings/trainer");
        console.log("Requesting bookings from:", `/bookings/trainer`);

        // Fetch bookings and classes
        // Update the catch block in your fetchDashboardData function
        try {
          const bookingsResponse = await axiosInstance.get(`/bookings/trainer`);
          const classesResponse = await axiosInstance.get(`/classes/trainer/${userId}`);

          console.log("Bookings response:", bookingsResponse.data);
          console.log("Classes response:", classesResponse.data);

          // Set data (even if empty arrays)
          setUpcomingSessions(bookingsResponse.data || []);
          setClasses(classesResponse.data || []);

          // Set stats
          setStats({
            totalClasses: classesResponse.data ? classesResponse.data.length : 0,
            totalBookings: bookingsResponse.data ? bookingsResponse.data.length : 0,
            totalReviews: user.profile?.reviewCount || 0
          });
        } catch (error) {
          // Handle actual errors
          console.error('Error fetching dashboard data:', error);
          console.log("Error response data:", error.response?.data);
          console.log("Error status:", error.response?.status);
          setError('Failed to load dashboard data. Please try again later.');
        }
      } catch (error) {
        console.error('Error in fetchDashboardData:', error);
        setError('An unexpected error occurred. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    } else {
      setIsLoading(false);
      setError('User information is missing. Please log out and log in again.');
    }
  }, [user]);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-8">
      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Classes</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalClasses}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Upcoming Bookings</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalBookings}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Reviews</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalReviews}</dd>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            to="/classes/create"
            className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create New Class
          </Link>
          <Link
            to="/classes/manage"
            className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Manage Classes
          </Link>
          <Link
            to="/bookings/trainer"
            className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            View All Bookings
          </Link>
        </div>
      </div>

      {/* Upcoming Sessions Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Today's Sessions</h3>
          <Link
            to="/bookings/trainer"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View all
          </Link>
        </div>

        {upcomingSessions.length === 0 ? (
          <div className="text-center bg-gray-50 rounded-lg py-6">
            <p className="text-gray-500">You don't have any upcoming sessions today.</p>
          </div>
        ) : (
          <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
            {upcomingSessions.slice(0, 3).map((session) => (
              <div key={session._id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600 truncate">
                    {session.class?.title || 'Class Title Unavailable'}
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Confirmed
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      {session.user?.name || 'User Name Unavailable'}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <p>
                      {formatDate(session.date)} · {session.startTime} - {session.endTime}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Your Classes Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Your Classes</h3>
          <Link
            to="/classes/manage"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Manage all
          </Link>
        </div>

        {classes.length === 0 ? (
          <div className="text-center bg-gray-50 rounded-lg py-6">
            <p className="text-gray-500">You haven't created any classes yet.</p>
            <Link
              to="/classes/create"
              className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create Class
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {classes.slice(0, 3).map((classItem) => (
              <div key={classItem._id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between">
                    <h4 className="text-base font-semibold text-gray-900 truncate">
                      {classItem.title}
                    </h4>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${classItem.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                      }`}>
                      {classItem.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {classItem.type} · {classItem.duration} min · ${classItem.price}
                  </p>
                  <div className="mt-4 flex space-x-2">
                    <Link
                      to={`/classes/edit/${classItem._id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/classes/${classItem._id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerDashboard;