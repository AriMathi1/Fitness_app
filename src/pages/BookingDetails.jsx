import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getBooking, cancelBooking, updateBookingStatus, reset } from '../features/bookings/bookingsSlice';
import Spinner from '../components/common/Spinner';
import { format, isAfter } from 'date-fns';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { currentBooking, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.bookings
  );
  
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showStatusUpdateConfirm, setShowStatusUpdateConfirm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const isTrainer = user?.userType === 'trainer';
  
  useEffect(() => {
    dispatch(getBooking(id));
    
    return () => {
      dispatch(reset());
    };
  }, [dispatch, id]);
  
  useEffect(() => {
    if (isSuccess && (showCancelConfirm || showStatusUpdateConfirm)) {
      if (showCancelConfirm) {
        setSuccessMessage('Booking has been successfully cancelled');
        setShowCancelConfirm(false);
      } else if (showStatusUpdateConfirm) {
        setSuccessMessage(`Booking status has been updated to ${selectedStatus}`);
        setShowStatusUpdateConfirm(false);
      }
      
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isSuccess, showCancelConfirm, showStatusUpdateConfirm, selectedStatus]);
  
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'EEEE, MMMM d, yyyy');
    } catch {
      return dateString;
    }
  };
  
  const formatTime = (time24h) => {
    if (!time24h) return '';
    
    const [hour, minute] = time24h.split(':');
    const hourInt = parseInt(hour, 10);
    const period = hourInt >= 12 ? 'PM' : 'AM';
    const hour12 = hourInt % 12 || 12;
    return `${hour12}:${minute} ${period}`;
  };
  
  const canCancel = () => {
    if (!currentBooking) return false;
    if (currentBooking.status === 'cancelled') return false;
    
    const bookingDate = new Date(currentBooking.date);
    const today = new Date();
    
    if (isAfter(bookingDate, today)) {
      return true;
    }
    
    return false;
  };
  
  const canUpdateStatus = () => {
    if (!currentBooking || !isTrainer) return false;
    if (currentBooking.status === 'cancelled') return false;
    
    return true;
  };
  
const handleCancelBooking = () => {
  console.log('Cancelling booking with id:', id);
  
  dispatch(cancelBooking(id))
    .unwrap()
    .then(() => {
      setSuccessMessage('Booking has been successfully cancelled');
      setShowCancelConfirm(false);

      dispatch(getBooking(id));
      
      dispatch(getBookings(filterParams));
      
      setTimeout(() => {
        navigate('/bookings', { state: { activeFilter: 'cancelled' } });
      }, 2000);
    })
    .catch((error) => {
      console.error('Error cancelling booking:', error);
      setError(error.message || 'Failed to cancel booking');
    });
};
  
  const handleStatusUpdate = () => {
    if (!selectedStatus) return;
    
    dispatch(updateBookingStatus({ id, status: selectedStatus }));
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        </div>
      </div>
    );
  }
  
  if (isError || !currentBooking) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="mb-6">
            <Link to="/bookings" className="text-indigo-600 hover:text-indigo-800 flex items-center">
              <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Back to Bookings
            </Link>
          </nav>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="mt-4 text-lg font-medium text-gray-900">Booking Not Found</h2>
            <p className="mt-2 text-gray-500">
              The booking you're looking for doesn't exist or has been removed.
            </p>
            <div className="mt-6">
              <Link
                to="/bookings"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Go back to Bookings
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const { class: classDetails, date, startTime, endTime, status, notes, paymentStatus, user: bookingUser, trainer: bookingTrainer } = currentBooking;
  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-6">
          <Link to="/bookings" className="text-indigo-600 hover:text-indigo-800 flex items-center">
            <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to Bookings
          </Link>
        </nav>
        
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p>{successMessage}</p>
              </div>
            </div>
          </div>
        )}
        
        {isError && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
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
        
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-gray-50">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {isTrainer ? 'Client session information' : 'Your class booking information'}
              </p>
            </div>
            
            <div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(status)}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Class</dt>
                <dd className="mt-1 text-lg font-medium text-gray-900">
                  {classDetails?.title || 'Unknown Class'}
                </dd>
                {classDetails?.type && (
                  <dd className="mt-1 text-sm text-gray-500">
                    {classDetails.type} • {classDetails.duration} minutes
                  </dd>
                )}
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Date</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(date)}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Time</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatTime(startTime)} - {formatTime(endTime)}</dd>
              </div>
              
              {isTrainer ? (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Client</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {bookingUser?.name || 'Unknown'} ({bookingUser?.email})
                  </dd>
                </div>
              ) : (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Trainer</dt>
                  <dd className="mt-1 text-sm text-gray-900">{bookingTrainer?.name || 'Unknown Trainer'}</dd>
                </div>
              )}
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Payment Status</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    paymentStatus === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : paymentStatus === 'refunded'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {paymentStatus}
                  </span>
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Booking Status</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{status}</dd>
              </div>
              
              {notes && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Notes</dt>
                  <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">{notes}</dd>
                </div>
              )}
            </dl>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
              {!isTrainer && canCancel() && (
                <div>
                  {showCancelConfirm ? (
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-700">Are you sure?</span>
                      <button
                        onClick={handleCancelBooking}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Yes, Cancel
                      </button>
                      <button
                        onClick={() => setShowCancelConfirm(false)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowCancelConfirm(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              )}
              
              {isTrainer && canUpdateStatus() && (
                <div>
                  {showStatusUpdateConfirm ? (
                    <div className="flex items-center space-x-3">
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="block w-32 pl-3 pr-10 py-2 text-xs border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                      >
                        <option value="">Select</option>
                        <option value="confirmed">Confirm</option>
                        <option value="completed">Complete</option>
                        <option value="cancelled">Cancel</option>
                      </select>
                      <button
                        onClick={handleStatusUpdate}
                        disabled={!selectedStatus}
                        className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                          selectedStatus ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-300 cursor-not-allowed'
                        }`}
                      >
                        Update
                      </button>
                      <button
                        onClick={() => setShowStatusUpdateConfirm(false)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowStatusUpdateConfirm(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Update Status
                    </button>
                  )}
                </div>
              )}
              
              <Link
                to={classDetails ? `/classes/${classDetails._id}` : '/classes'}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {classDetails ? 'View Class Details' : 'Browse Classes'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;