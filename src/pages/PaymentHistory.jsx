import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getPaymentHistory, reset } from '../features/payments/paymentsSlice';
import Spinner from '../components/common/Spinner';
import { format } from 'date-fns';

const PaymentHistory = () => {
  const dispatch = useDispatch();
  
  const { payments, isLoading, isError, message } = useSelector(
    (state) => state.payments
  );
  
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredPayments, setFilteredPayments] = useState([]);
  
  useEffect(() => {
    dispatch(getPaymentHistory());
    
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);
  
  useEffect(() => {
    if (payments?.length > 0) {
      switch (activeFilter) {
        case 'completed':
          setFilteredPayments(payments.filter(payment => payment.status === 'completed'));
          break;
        case 'refunded':
          setFilteredPayments(payments.filter(payment => payment.status === 'refunded'));
          break;
        case 'pending':
          setFilteredPayments(payments.filter(payment => payment.status === 'pending'));
          break;
        default:
          setFilteredPayments(payments);
      }
    }
  }, [payments, activeFilter]);
  
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };
  
  const formatTime = (dateString) => {
    try {
      return format(new Date(dateString), 'h:mm a');
    } catch {
      return '';
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'refunded':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
          <Link
            to="/dashboard"
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
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
        
        <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors duration-200 ${
                  activeFilter === 'all'
                    ? 'text-indigo-600 border-indigo-500'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveFilter('all')}
              >
                All Payments
              </button>
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors duration-200 ${
                  activeFilter === 'completed'
                    ? 'text-indigo-600 border-indigo-500'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveFilter('completed')}
              >
                Completed
              </button>
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors duration-200 ${
                  activeFilter === 'refunded'
                    ? 'text-indigo-600 border-indigo-500'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveFilter('refunded')}
              >
                Refunded
              </button>
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors duration-200 ${
                  activeFilter === 'pending'
                    ? 'text-indigo-600 border-indigo-500'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveFilter('pending')}
              >
                Pending
              </button>
            </nav>
          </div>
          
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <Spinner />
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeFilter === 'all'
                  ? "You haven't made any payments yet."
                  : `You don't have any ${activeFilter} payments.`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(payment.createdAt)}</div>
                        <div className="text-sm text-gray-500">{formatTime(payment.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.booking?.class?.title || 'Unknown Class'}
                        </div>
                        {payment.booking?.date && (
                          <div className="text-sm text-gray-500">
                            {formatDate(payment.booking.date)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${payment.amount.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.paymentMethod}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/payments/${payment._id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;