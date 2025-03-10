import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaStar, FaRegStar, FaReply } from 'react-icons/fa';
import { format } from 'date-fns';
import { respondToReview } from '../../features/trainers/trainersSlice';

const ReviewItem = ({ review }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [replyText, setReplyText] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Check if the logged-in user is the trainer who received this review
  const isReviewedTrainer = user && user.userType === 'trainer' && 
                            user.id === review.trainerId;
  
  // Format the review date
  const formattedDate = format(new Date(review.createdAt), 'MMM d, yyyy');
  
  // Generate star rating display
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }
    
    // Empty stars
    for (let i = fullStars; i < 5; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);
    }
    
    return stars;
  };
  
  const handleReplySubmit = async (e) => {
    e.preventDefault();
    
    if (replyText.trim() === '') {
      setError('Reply cannot be empty');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await dispatch(respondToReview({ 
        reviewId: review._id, 
        response: replyText 
      })).unwrap();
      
      setShowReplyForm(false);
      setReplyText('');
    } catch (error) {
      setError(error || 'Failed to submit reply. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="border-b border-gray-200 py-4 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="font-medium text-gray-800">{review.clientName}</div>
          <div className="text-sm text-gray-500">{formattedDate}</div>
        </div>
        <div className="flex">
          {renderStars(review.rating)}
        </div>
      </div>
      
      <p className="text-gray-700 my-2">{review.comment}</p>
      
      {/* Trainer's response */}
      {review.trainerResponse && (
        <div className="mt-3 bg-gray-50 p-3 rounded-md border-l-4 border-blue-500">
          <div className="font-medium text-gray-800 mb-1">Trainer Response:</div>
          <p className="text-gray-700">{review.trainerResponse}</p>
        </div>
      )}
      
      {/* Reply option for trainer */}
      {isReviewedTrainer && !review.trainerResponse && (
        <div className="mt-3">
          {!showReplyForm ? (
            <button
              onClick={() => setShowReplyForm(true)}
              className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
            >
              <FaReply className="mr-1" /> Reply to this review
            </button>
          ) : (
            <form onSubmit={handleReplySubmit}>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-2 text-sm">
                  {error}
                </div>
              )}
              
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                rows="3"
                placeholder="Write your response..."
              />
              
              <div className="flex justify-end mt-2 space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyText('');
                    setError('');
                  }}
                  className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Response'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewItem;