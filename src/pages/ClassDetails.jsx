import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getClass, reset as resetClass } from '../features/classes/classesSlice';
import { createBooking, reset as resetBookings } from '../features/bookings/bookingsSlice';
import { reset as resetPayments } from '../features/payments/paymentsSlice';
import Spinner from '../components/common/Spinner';
import PaymentForm from '../components/payments/PaymentForm';

const ClassDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { currentClass, isLoading: classLoading, isError: classError, message: classMessage } = useSelector(
    (state) => state.classes
  );
  const { isLoading: bookingLoading, isSuccess: bookingSuccess, isError: bookingError, message: bookingMessage } = useSelector(
    (state) => state.bookings
  );

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState('');
  const [bookingStatus, setBookingStatus] = useState('initial'); 
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    dispatch(getClass(id));

    return () => {
      dispatch(resetClass());
      dispatch(resetBookings());
      dispatch(resetPayments());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (currentClass && currentClass.schedule && currentClass.schedule.length > 0) {
      setSelectedDate(currentClass.schedule[0].day);
      setSelectedSchedule(currentClass.schedule[0]);
    }
  }, [currentClass]);

  useEffect(() => {
    if (bookingSuccess && bookingStatus === 'initial') {
      setBookingStatus('created');
      setShowPaymentForm(true);
    }
  }, [bookingSuccess, bookingStatus]);

  useEffect(() => {
    if (bookingError && bookingMessage) {
      setErrorMessage(bookingMessage);
    }
  }, [bookingError, bookingMessage]);

  const handleScheduleChange = (e) => {
    const day = e.target.value;
    setSelectedDate(day);

    const schedule = currentClass.schedule.find(s => s.day === day);
    setSelectedSchedule(schedule);
  };

  const handleScheduleClick = (schedule) => {
    setSelectedDate(schedule.day);
    setSelectedSchedule(schedule);
  };

  const getUpcomingDates = (dayName, count = 3) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = days.findIndex(day => day === dayName);

    if (dayIndex === -1) return [];

    const today = new Date();
    const currentDayIndex = today.getDay();
    const dates = [];

    for (let i = 0; i < count; i++) {
      let daysToAdd = dayIndex - currentDayIndex + (7 * i);
      if (daysToAdd <= 0 && i === 0) daysToAdd += 7;

      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + daysToAdd);

      const month = nextDate.toLocaleString('default', { month: 'short' });
      const date = nextDate.getDate();

      dates.push({
        full: nextDate,
        formatted: `${month} ${date}`,
        dayOfWeek: days[nextDate.getDay()],
        isToday: isToday(nextDate)
      });
    }

    return dates;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const handleBookClass = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!selectedSchedule) {
      setErrorMessage('Please select a schedule first');
      return;
    }

    setErrorMessage('');

    try {
      const bookingDate = getUpcomingDates(selectedSchedule.day, 1)[0].full;

      const bookingData = {
        classId: currentClass._id,
        date: bookingDate.toISOString().split('T')[0], 
        startTime: selectedSchedule.startTime,
        endTime: selectedSchedule.endTime
      };

      const response = await dispatch(createBooking(bookingData)).unwrap();

      setBookingId(response._id);
      setBookingStatus('created');
      setShowPaymentForm(true);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create booking');
    }
  };

  const formatTime = (time24h) => {
    const [hour, minute] = time24h.split(':');
    const hourInt = parseInt(hour, 10);
    const period = hourInt >= 12 ? 'PM' : 'AM';
    const hour12 = hourInt % 12 || 12;
    return `${hour12}:${minute} ${period}`;
  };

  const handlePaymentSuccess = () => {
    console.log('Payment success callback triggered');
    setBookingStatus('paid');
    setShowPaymentForm(false);

    setPaymentSuccessMessage('Payment successful! Your booking has been confirmed.');

    window.scrollTo(0, 0);

    setTimeout(() => {
      navigate('/bookings', {
        state: {
          from: 'payment',
          success: true,
          message: 'Your payment was successful and your booking has been confirmed.'
        }
      });
    }, 3000);
  };

  if (classLoading || bookingLoading) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        </div>
      </div>
    );
  }

  if (classError || !currentClass) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="mb-6">
            <Link to="/classes" className="text-indigo-600 hover:text-indigo-800 flex items-center">
              <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Back to Classes
            </Link>
          </nav>

          <div className="text-center bg-white rounded-lg shadow py-12 px-4 sm:px-6">
            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="mt-4 text-xl font-medium text-gray-900">Class Not Found</h2>
            <p className="mt-2 text-base text-gray-500">The class you're looking for doesn't exist or has been removed.</p>
            <div className="mt-6">
              <Link
                to="/classes"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Browse Classes
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-6">
          <Link to="/classes" className="text-indigo-600 hover:text-indigo-800 flex items-center">
            <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to Classes
          </Link>
        </nav>

        {paymentSuccessMessage && (
            <div className="mb-6 bg-green-100 border-l-4 border-green-500 p-4 rounded-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700 font-medium">{paymentSuccessMessage}</p>
                  <p className="text-xs text-green-600 mt-1">Redirecting to your bookings page...</p>
                </div>
              </div>
            </div>
          )}
          
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start">
              <div className="flex-1 pr-0 lg:pr-12">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold text-gray-900">{currentClass.title}</h1>
                  <span className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                    {currentClass.type}
                  </span>
                </div>

                <div className="mt-3 flex items-center text-gray-500 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{currentClass.location}</span>
                </div>

                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-900">Description</h2>
                  <p className="mt-2 text-gray-600">{currentClass.description}</p>
                </div>

                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-900">Class Details</h2>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-500">Duration</p>
                          <p className="font-medium text-gray-900">{currentClass.duration} minutes</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-500">Price</p>
                          <p className="font-medium text-gray-900">${currentClass.price}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-900">Schedule</h2>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentClass.schedule.map((schedule, index) => (
                      <div
                        key={index}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedSchedule && selectedSchedule.day === schedule.day &&
                            selectedSchedule.startTime === schedule.startTime
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                          }`}
                        onClick={() => handleScheduleClick(schedule)}
                      >
                        <div className="flex items-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="font-medium text-gray-900">{schedule.day}s</p>
                        </div>
                        <p className="text-gray-600">
                          {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                        </p>
                        {selectedSchedule && selectedSchedule.day === schedule.day &&
                          selectedSchedule.startTime === schedule.startTime && (
                            <div className="mt-2 text-xs text-indigo-600 font-medium">
                              Selected
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </div>

                {currentClass.trainer && (
                  <div className="mt-8 border-t pt-8">
                    <h2 className="text-xl font-semibold text-gray-900">Trainer</h2>
                    <div className="mt-4 bg-gray-50 p-4 rounded-lg flex items-start">
                      <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-medium text-indigo-700">
                          {currentClass.trainer.name ? currentClass.trainer.name.charAt(0).toUpperCase() : 'T'}
                        </span>
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-lg font-medium text-gray-900">{currentClass.trainer.name}</p>
                        {currentClass.trainer.profile && currentClass.trainer.profile.rating && (
                          <div className="flex items-center mt-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`h-4 w-4 ${i < Math.floor(currentClass.trainer.profile.rating)
                                      ? 'text-yellow-400'
                                      : i < Math.ceil(currentClass.trainer.profile.rating)
                                        ? 'text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="ml-2 text-sm text-gray-600">
                              {currentClass.trainer.profile.rating.toFixed(1)} rating
                            </span>
                          </div>
                        )}
                      </div>
                      <Link
                        to={`/trainers/${currentClass.trainer._id}`}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 lg:mt-0 lg:w-96">
                {!showPaymentForm ? (
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Book this Class</h3>

                    {errorMessage && (
                      <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                        {errorMessage}
                      </div>
                    )}

                    {bookingStatus === 'paid' ? (
                      <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
                        <div className="flex items-start">
                          <svg className="h-5 w-5 text-green-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <p>Booking confirmed! Redirecting to your bookings...</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {selectedSchedule && (
                          <div className="mb-6 bg-gray-50 p-4 rounded-md">
                            <h4 className="font-medium text-gray-900 mb-2">Selected Schedule</h4>
                            <p className="text-gray-700">{selectedSchedule.day}s</p>
                            <p className="text-gray-700">
                              {formatTime(selectedSchedule.startTime)} - {formatTime(selectedSchedule.endTime)}
                            </p>

                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Upcoming Dates</h4>
                              <div className="space-y-2">
                                {getUpcomingDates(selectedSchedule.day, 3).map((date, index) => (
                                  <div key={index} className="flex items-center">
                                    <div className={`w-2 h-2 rounded-full mr-2 ${index === 0 ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
                                    <span className="text-sm">
                                      {date.formatted}
                                      {date.isToday && <span className="ml-1 text-xs font-medium text-indigo-600">(Today)</span>}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="mb-6">
                          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                            Select Schedule
                          </label>
                          <select
                            id="date"
                            value={selectedDate}
                            onChange={handleScheduleChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option value="">Select a day</option>
                            {currentClass.schedule && currentClass.schedule.map((scheduleItem, index) => (
                              <option key={index} value={scheduleItem.day}>
                                {scheduleItem.day}s, {formatTime(scheduleItem.startTime)} - {formatTime(scheduleItem.endTime)}
                              </option>
                            ))}
                          </select>
                          <p className="mt-1 text-xs text-gray-500">
                            Or click on a schedule card above to select it
                          </p>
                        </div>

                        <div className="mb-6">
                          <p className="text-sm text-gray-700 mb-1">Price</p>
                          <p className="text-3xl font-bold text-indigo-600">${currentClass.price}</p>
                        </div>

                        <button
                          onClick={handleBookClass}
                          disabled={!selectedSchedule}
                          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${!selectedSchedule
                              ? 'bg-indigo-300 cursor-not-allowed'
                              : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                        >
                          Book Now
                        </button>

                        {!user && (
                          <p className="mt-3 text-sm text-gray-500 text-center">
                            Please <Link to="/login" className="text-indigo-600 hover:text-indigo-800">sign in</Link> to book this class.
                          </p>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <PaymentForm
                    bookingId={bookingId}
                    amount={currentClass.price}
                    onSuccess={handlePaymentSuccess}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetails;