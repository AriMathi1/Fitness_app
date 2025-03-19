import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaStar, FaRegStar, FaUserCircle, FaCalendarAlt, FaCertificate, FaDumbbell } from 'react-icons/fa';
import { format } from 'date-fns';
import {
  getTrainer,
  getTrainerReviews,
  reset,
  clearCurrentTrainer
} from '../features/trainers/trainersSlice';
import ReviewForm from '../components/trainers/ReviewForm';
import ReviewItem from '../components/trainers/ReviewItem';
import Spinner from '../components/common/Spinner';

const TrainerDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const { user } = useSelector((state) => state.auth);
  const { currentTrainer, reviews, isLoading, isError, message } = useSelector(
    (state) => state.trainers
  );
  
  useEffect(() => {
    dispatch(getTrainer(id));
    dispatch(getTrainerReviews(id));
    
    return () => {
      dispatch(reset());
      dispatch(clearCurrentTrainer());
    };
  }, [dispatch, id]);
  
  const canReview = user && user.userType === 'client' && user.id !== id;
  
  if (isLoading || !currentTrainer) {
    return <Spinner />;
  }
  
  if (isError) {
    return (
      <div className="max-w-3xl mx-auto mt-8 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {message}
        </div>
        <Link to="/trainers" className="text-blue-600 hover:underline">
          Back to Trainers
        </Link>
      </div>
    );
  }
  
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }
    
    for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);
    }
    
    return stars;
  };
  
  return (
    <div className="max-w-3xl mx-auto mt-8 px-4 pb-12">
      <Link to="/trainers" className="text-blue-600 hover:underline mb-6 inline-block">
        &larr; Back to Trainers
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {currentTrainer.name}
              </h1>
              
              <div className="flex items-center mb-4">
                <div className="flex mr-2">
                  {renderStars(currentTrainer.profile.rating)}
                </div>
                <span className="text-sm text-gray-600">
                  ({currentTrainer.profile.reviewCount} reviews)
                </span>
              </div>
            </div>
            
            {currentTrainer.profile.yearsOfExperience > 0 && (
              <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-full font-semibold text-sm mt-2 md:mt-0">
                {currentTrainer.profile.yearsOfExperience} years experience
              </div>
            )}
          </div>
          
          {currentTrainer.profile.bio && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                About Me
              </h3>
              <p className="text-gray-700 whitespace-pre-line">
                {currentTrainer.profile.bio}
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentTrainer.profile.specialties && 
             currentTrainer.profile.specialties.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <FaDumbbell className="mr-2 text-blue-600" /> Specialties
                </h3>
                <ul className="space-y-1">
                  {currentTrainer.profile.specialties.map((specialty, index) => (
                    <li key={index} className="text-gray-700">
                      • {specialty}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {currentTrainer.profile.qualifications && 
             currentTrainer.profile.qualifications.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <FaUserCircle className="mr-2 text-blue-600" /> Qualifications
                </h3>
                <ul className="space-y-1">
                  {currentTrainer.profile.qualifications.map((qualification, index) => (
                    <li key={index} className="text-gray-700">
                      • {qualification}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {currentTrainer.profile.certifications && 
           currentTrainer.profile.certifications.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <FaCertificate className="mr-2 text-blue-600" /> Certifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentTrainer.profile.certifications.map((cert, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-3">
                    <h4 className="font-medium text-gray-800">{cert.name}</h4>
                    <p className="text-sm text-gray-600">{cert.issuingOrganization}</p>
                    {cert.issueDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        Issued: {format(new Date(cert.issueDate), 'MMM yyyy')}
                        {cert.expirationDate && 
                          ` • Expires: ${format(new Date(cert.expirationDate), 'MMM yyyy')}`}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {currentTrainer.profile.availability && 
           currentTrainer.profile.availability.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-600" /> Availability
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {currentTrainer.profile.availability.map((slot, index) => (
                  <div key={index} className="bg-gray-50 rounded-md p-2">
                    <span className="font-medium">{slot.day}: </span>
                    <span className="text-gray-700">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Reviews ({reviews.length})
            </h2>
            
            {canReview && (
              <button 
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {showReviewForm ? 'Cancel Review' : 'Write a Review'}
              </button>
            )}
          </div>
          
          {showReviewForm && canReview && (
            <ReviewForm 
              trainerId={id} 
              onReviewSubmitted={() => setShowReviewForm(false)} 
            />
          )}
          
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewItem key={review._id} review={review} />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No reviews yet. Be the first to review this trainer!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerDetails;