import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaRegStar } from 'react-icons/fa';

const TrainerCard = ({ trainer }) => {
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
  
  const specialtySummary = trainer.profile.specialties.slice(0, 3).join(', ');

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {trainer.name}
        </h3>
        
        <div className="flex items-center mb-3">
          <div className="flex mr-2">
            {renderStars(trainer.profile.rating)}
          </div>
          <span className="text-sm text-gray-600">
            ({trainer.profile.reviewCount} reviews)
          </span>
        </div>
        
        {trainer.profile.specialties && trainer.profile.specialties.length > 0 && (
          <p className="text-gray-700 mb-3">
            <span className="font-medium">Specializes in:</span> {specialtySummary}
            {trainer.profile.specialties.length > 3 && '...'}
          </p>
        )}
        
        {trainer.profile.yearsOfExperience > 0 && (
          <p className="text-gray-700 mb-4">
            <span className="font-medium">Experience:</span> {trainer.profile.yearsOfExperience} years
          </p>
        )}
        
        <div className="mt-4">
          <Link 
            to={`/trainers/${trainer._id}`}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrainerCard;