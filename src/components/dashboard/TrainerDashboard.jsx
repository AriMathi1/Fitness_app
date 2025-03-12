import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../api/axiosConfig';

const ErrorAlert = ({ message }) => (
  <div className="bg-red-50 p-4 rounded mb-4">
    <p className="text-red-600">{message}</p>
  </div>
);

const LoadingSkeleton = ({ type }) => {
  if (type === 'table') {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded mb-4"></div>
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-gray-200 rounded mb-2"></div>
        ))}
      </div>
    );
  }
  if (type === 'card') {
    return (
      <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 bg-gray-200 rounded"></div>
        ))}
      </div>
    );
  }
  return <div className="animate-pulse h-10 bg-gray-200 rounded"></div>;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString;
  }
};

const isFutureDate = (dateString, timeString) => {
  if (!dateString || !timeString) return false;
  
  try {
    const [hours, minutes] = timeString.split(':').map(Number);
    const bookingDate = new Date(dateString);
    bookingDate.setHours(hours, minutes);
    return bookingDate > new Date();
  } catch (error) {
    console.error('Date comparison error:', error);
    return false;
  }
};

const TrainerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState({
    classes: true,
    bookings: true,
    profile: true
  });
  
  const [error, setError] = useState({
    classes: null,
    bookings: null,
    profile: null
  });
  
  const [classes, setClasses] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [profile, setProfile] = useState({
    rating: 0,
    totalReviews: 0
  });

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('/classes', {
          params: { trainerId: user._id }
        });
        setClasses(response.data);
        setError((prev) => ({ ...prev, classes: null }));
      } catch (err) {
        console.error('Error fetching classes:', err);
        setError((prev) => ({ 
          ...prev, 
          classes: err.response?.data?.msg || 'Failed to load classes' 
        }));
      } finally {
        setLoading((prev) => ({ ...prev, classes: false }));
      }
    };

    if (user?._id) {
      fetchClasses();
    }
  }, [user]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/bookings/trainer');
        const sortedBookings = response.data.sort((a, b) => 
          new Date(a.date) - new Date(b.date)
        );
        setUpcomingBookings(sortedBookings);
        setError((prev) => ({ ...prev, bookings: null }));
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError((prev) => ({ 
          ...prev, 
          bookings: err.response?.data?.msg || 'Failed to load bookings' 
        }));
      } finally {
        setLoading((prev) => ({ ...prev, bookings: false }));
      }
    };

    if (user?._id) {
      fetchBookings();
    }
  }, [user]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/profile');
        setProfile({
          rating: response.data.profile?.rating || 0,
          totalReviews: response.data.profile?.totalReviews || 0
        });
        setError((prev) => ({ ...prev, profile: null }));
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError((prev) => ({ 
          ...prev, 
          profile: err.response?.data?.msg || 'Failed to load profile' 
        }));
      } finally {
        setLoading((prev) => ({ ...prev, profile: false }));
      }
    };

    if (user?._id) {
      fetchProfile();
    }
  }, [user]);

  const navigateToCreateClass = () => {
    navigate('/classes/new');
  };

  const filteredUpcomingBookings = upcomingBookings.filter(booking => 
    isFutureDate(booking.date, booking.startTime)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Trainer Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Active Classes</h3>
          {loading.classes ? (
            <LoadingSkeleton />
          ) : error.classes ? (
            <p className="text-red-500 text-sm">{error.classes}</p>
          ) : (
            <p className="text-3xl font-bold text-blue-600">
              {classes.filter(c => c.isActive).length}
            </p>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Upcoming Bookings</h3>
          {loading.bookings ? (
            <LoadingSkeleton />
          ) : error.bookings ? (
            <p className="text-red-500 text-sm">{error.bookings}</p>
          ) : (
            <p className="text-3xl font-bold text-green-600">
              {filteredUpcomingBookings.length}
            </p>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Rating</h3>
          {loading.profile ? (
            <LoadingSkeleton />
          ) : error.profile ? (
            <p className="text-red-500 text-sm">{error.profile}</p>
          ) : (
            <div>
              <p className="text-3xl font-bold text-yellow-600">
                {profile.rating.toFixed(1)}/5.0
              </p>
              <p className="text-sm text-gray-500">
                {profile.totalReviews} {profile.totalReviews === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Upcoming Sessions</h2>
          <Link to="/bookings" className="text-blue-600 hover:text-blue-800">View All</Link>
        </div>
        
        {loading.bookings ? (
          <LoadingSkeleton type="table" />
        ) : error.bookings ? (
          <ErrorAlert message={error.bookings} />
        ) : filteredUpcomingBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUpcomingBookings.slice(0, 5).map(booking => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.class?.title || 'Unknown Class'}
                      </div>
                      {booking.class?.type && (
                        <div className="text-xs text-gray-500">{booking.class.type}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.client?.name || 'Unknown Client'}
                      </div>
                      {booking.client?.email && (
                        <div className="text-xs text-gray-500">{booking.client.email}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(booking.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {booking.startTime && booking.endTime 
                          ? `${booking.startTime} - ${booking.endTime}`
                          : 'N/A'
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : booking.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : booking.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link to={`/bookings/${booking._id}`} className="text-indigo-600 hover:text-indigo-900 mr-3">
                        View
                      </Link>
                      {booking.status === 'pending' && (
                        <button 
                          className="text-green-600 hover:text-green-900 mr-3"
                          onClick={() => {
                            alert('This would accept the booking - API integration needed');
                          }}
                        >
                          Accept
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUpcomingBookings.length > 5 && (
              <div className="mt-4 text-right">
                <Link to="/bookings" className="text-sm text-blue-600 hover:text-blue-800">
                  View all {filteredUpcomingBookings.length} upcoming bookings
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-gray-500 mb-4">You don't have any upcoming sessions scheduled.</p>
          </div>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <h2 className="text-2xl font-semibold">My Classes</h2>
          <Link 
            to="/classes/create" 
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-center"
            aria-label="Create a new class"
          >
            Create New Class
          </Link>
        </div>
        
        {loading.classes ? (
          <LoadingSkeleton type="card" />
        ) : error.classes ? (
          <ErrorAlert message={error.classes} />
        ) : classes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map(classItem => (
              <div key={classItem._id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{classItem.title}</h3>
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Type:</span> {classItem.type || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Duration:</span> {classItem.duration || 'N/A'} min
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Price:</span> ${classItem.price || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    <span className="font-medium">Schedule:</span>
                    {classItem.schedule && classItem.schedule.length > 0 ? (
                      <ul className="mt-1">
                        {classItem.schedule.map((slot, index) => (
                          <li key={index}>
                            {slot.day} ({slot.startTime} - {slot.endTime})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1">No schedule set</p>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <Link to={`/classes/${classItem._id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                      Edit
                    </Link>
                    <div className={`px-2 py-1 text-xs rounded ${
                      classItem.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {classItem.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-gray-500 mb-4">You haven't created any classes yet.</p>
            <Link
              to="/classes/new"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Create Your First Class
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerDashboard;