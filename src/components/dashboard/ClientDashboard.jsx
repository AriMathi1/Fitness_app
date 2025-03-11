// components/dashboard/ClientDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import Spinner from '../common/Spinner';

const ClientDashboard = () => {
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [bookingsError, setBookingsError] = useState(null);
  const [recommendedClasses, setRecommendedClasses] = useState([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [recommendationsError, setRecommendationsError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoadingBookings(true);
      try {
        const response = await axiosInstance.get('/bookings?upcoming=true');
        console.log('Bookings response:', response.data);
        setUpcomingBookings(response.data || []);
        setBookingsError(null);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setBookingsError('Failed to load bookings. Please try again later.');
      } finally {
        setIsLoadingBookings(false);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoadingRecommendations(true);
      try {
        const response = await axiosInstance.get('/recommendations/classes?limit=4');
        console.log('Recommendations response:', response.data);
        setRecommendedClasses(response.data || []);
        setRecommendationsError(null);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setRecommendationsError('Failed to load recommendations. Please try again later.');
      } finally {
        setIsLoadingRecommendations(false);
      }
    };

    fetchRecommendations();
  }, []);


  // Format date (if needed)
  const formatDate = (dateString) => {
    try {
      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-8">
      {/* Upcoming Bookings Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Upcoming Bookings</h3>
          <Link
            to="/bookings"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View all
          </Link>
        </div>

        {bookingsError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700">{bookingsError}</p>
          </div>
        )}

        {isLoadingBookings ? (
          <div className="py-4 flex justify-center">
            <Spinner />
          </div>
        ) : upcomingBookings.length === 0 ? (
          <div className="text-center bg-gray-50 rounded-lg py-6">
            <p className="text-gray-500">You don't have any upcoming bookings.</p>
            <Link
              to="/classes"
              className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Explore Classes
            </Link>
          </div>
        ) : (
          <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
            {upcomingBookings.slice(0, 3).map((booking) => (
              <div key={booking._id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600 truncate">
                    {booking.class?.title || 'Unknown Class'}
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'Unknown'}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      {booking.trainer?.name || 'Unknown Trainer'}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <p>
                      {booking.date ? formatDate(booking.date) : 'No date'} · {booking.startTime || '??:??'} - {booking.endTime || '??:??'}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <Link
                    to={`/bookings/${booking._id}`}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    View details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Classes Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recommended For You</h3>
          <Link
            to="/classes"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View all
          </Link>
        </div>

        {recommendationsError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700">{recommendationsError}</p>
          </div>
        )}

        {isLoadingRecommendations ? (
          <div className="py-4 flex justify-center">
            <Spinner />
          </div>
        ) : recommendedClasses.length === 0 ? (
          <div className="text-center bg-gray-50 rounded-lg py-6">
            <p className="text-gray-500">No recommended classes available.</p>
            <Link
              to="/classes"
              className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Browse All Classes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recommendedClasses.map((classItem) => (
              <div key={classItem._id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h4 className="text-base font-semibold text-gray-900 truncate">
                    {classItem.title || 'Unknown Class'}
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    {classItem.type || 'Unknown type'} · {classItem.duration || '??'} min
                  </p>
                  <div className="mt-2 flex items-center">
                    <svg className="text-yellow-400 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-sm text-gray-500">
                      {classItem.trainer?.profile?.rating || '?.?'} · {classItem.trainer?.name || 'Unknown trainer'}
                    </span>
                  </div>
                  <div className="mt-3">
                    <Link
                      to={`/classes/${classItem._id}`}
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      View Class
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

export default ClientDashboard;