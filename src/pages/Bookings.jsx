import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getBookings, getTrainerBookings, reset } from '../features/bookings/bookingsSlice';
import BookingItem from '../components/bookings/BookingItem';
import Spinner from '../components/common/Spinner';

const Bookings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { bookings, trainerBookings, isLoading, isError, message } = useSelector(
    (state) => state.bookings
  );

  const [activeFilter, setActiveFilter] = useState('upcoming');
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [filterParams, setFilterParams] = useState({ upcoming: 'true' });
  
  const isTrainer = user?.userType === 'trainer';

  useEffect(() => {
    if (isTrainer) {
      dispatch(getTrainerBookings(filterParams));
    } else {
      dispatch(getBookings(filterParams));
    }

    return () => {
      dispatch(reset());
    };
  }, [dispatch, isTrainer, filterParams]);

  useEffect(() => {
    const bookingsToFilter = isTrainer ? trainerBookings : bookings;
    
    if (bookingsToFilter?.length > 0) {
      filterBookings(activeFilter, bookingsToFilter);
    } else {
      setFilteredBookings([]);
    }
  }, [bookings, trainerBookings, activeFilter, isTrainer]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    
    let params = {};
    switch (filter) {
      case 'upcoming':
        params = { upcoming: 'true' };
        break;
      case 'completed':
        params = { status: 'completed' };
        break;
      case 'cancelled':
        params = { status: 'cancelled' };
        break;
      default:
        params = {};
    }
    
    setFilterParams(params);
    
    if (isTrainer) {
      dispatch(getTrainerBookings(params));
    } else {
      dispatch(getBookings(params));
    }
  };

  const filterBookings = (filter, bookingsToFilter) => {
    switch (filter) {
      case 'upcoming':
        setFilteredBookings(
          bookingsToFilter.filter(booking => 
            booking.status !== 'cancelled' && 
            booking.status !== 'completed'
          )
        );
        break;
      case 'completed':
        setFilteredBookings(
          bookingsToFilter.filter(booking => booking.status === 'completed')
        );
        break;
      case 'cancelled':
        setFilteredBookings(
          bookingsToFilter.filter(booking => booking.status === 'cancelled')
        );
        break;
      default:
        setFilteredBookings(bookingsToFilter);
    }
  };

  const handleBookingClick = (bookingId) => {
    navigate(`/bookings/${bookingId}`);
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {isTrainer ? 'Your Sessions' : 'Your Bookings'}
          </h1>
          
          <Link
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            Back to Dashboard
          </Link>
        </div>
        
        {isError && (
          <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p>{message}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors duration-200 ${
                  activeFilter === 'upcoming'
                    ? 'text-indigo-600 border-indigo-500'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => handleFilterChange('upcoming')}
              >
                Upcoming
              </button>
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors duration-200 ${
                  activeFilter === 'completed'
                    ? 'text-indigo-600 border-indigo-500'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => handleFilterChange('completed')}
              >
                Completed
              </button>
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors duration-200 ${
                  activeFilter === 'cancelled'
                    ? 'text-indigo-600 border-indigo-500'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => handleFilterChange('cancelled')}
              >
                Cancelled
              </button>
            </nav>
          </div>
          
          {filteredBookings.length === 0 ? (
            <div className="text-center py-16 px-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No bookings found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeFilter === 'upcoming'
                  ? isTrainer
                    ? "You don't have any upcoming sessions."
                    : "You don't have any upcoming bookings."
                  : activeFilter === 'completed'
                  ? isTrainer
                    ? "You don't have any completed sessions."
                    : "You don't have any completed bookings."
                  : isTrainer
                    ? "You don't have any cancelled sessions."
                    : "You don't have any cancelled bookings."}
              </p>
              {activeFilter === 'upcoming' && !isTrainer && (
                <div className="mt-6">
                  <Link
                    to="/classes"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Browse Classes
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <div 
                  key={booking._id}
                  onClick={() => handleBookingClick(booking._id)}
                  className="cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                >
                  <BookingItem 
                    booking={booking} 
                    isTrainer={isTrainer} 
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookings;