import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPaymentIntent, confirmPayment, reset } from '../../features/payments/paymentsSlice';
import Spinner from '../common/Spinner';

// Note: To use this component, you need to install Stripe libraries:
// npm install @stripe/stripe-js @stripe/react-stripe-js

import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Load Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Card Element styling
const cardElementOptions = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  }
};

// Individual Payment Form (inside Stripe Elements)
const PaymentForm = ({ bookingId, amount, onSuccess }) => {
  const [cardError, setCardError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  
  const { paymentIntent, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.payments
  );
  
  // Create payment intent when component mounts
  useEffect(() => {
    dispatch(createPaymentIntent({
      bookingId,
      paymentMethod: 'card'
    }));
    
    return () => {
      dispatch(reset());
    };
  }, [dispatch, bookingId]);
  
  // Handle payment confirmation success
  useEffect(() => {
    if (isSuccess && !paymentIntent && !processing) {
      setPaymentSuccess(true);
      
      // Call the onSuccess callback after a short delay
      const timer = setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isSuccess, paymentIntent, processing, onSuccess]);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements || !paymentIntent) {
      return;
    }
    
    setProcessing(true);
    setCardError('');
    
    // Confirm card payment
    const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)
      }
    });
    
    if (result.error) {
      setCardError(result.error.message);
      setProcessing(false);
    } else if (result.paymentIntent.status === 'succeeded') {
      // Payment succeeded, confirm on the backend
      dispatch(confirmPayment(result.paymentIntent.id));
    }
  };
  
  if (isLoading && !paymentIntent) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
        <div className="flex justify-center py-6">
          <Spinner />
        </div>
      </div>
    );
  }
  
  if (paymentSuccess) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Payment Successful!</h3>
          <p className="mt-1 text-sm text-gray-500">
            Your booking has been confirmed. Redirecting to your bookings...
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h3>
      
      {isError && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {message}
        </div>
      )}
      
      {cardError && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {cardError}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Information
          </label>
          <div className="border border-gray-300 rounded-md p-3 bg-white shadow-sm">
            <CardElement options={cardElementOptions} />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Test card: 4242 4242 4242 4242, Any future date, Any 3 digits, Any postal code
          </p>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <div className="text-2xl font-bold text-indigo-600">${amount.toFixed(2)}</div>
        </div>
        
        <button
          type="submit"
          disabled={!stripe || processing}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            !stripe || processing
              ? 'bg-indigo-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {processing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
};

// Wrapper component with Stripe Elements
const PaymentFormWrapper = ({ bookingId, amount, onSuccess }) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm bookingId={bookingId} amount={amount} onSuccess={onSuccess} />
    </Elements>
  );
};

export default PaymentFormWrapper;