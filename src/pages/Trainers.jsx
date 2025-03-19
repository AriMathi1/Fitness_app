import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaFilter, FaStar, FaSearch } from 'react-icons/fa';
import { getTrainers, reset } from '../features/trainers/trainersSlice';
import TrainerCard from '../components/trainers/TrainerCard';
import Spinner from '../components/common/Spinner';

const Trainers = () => {
  const dispatch = useDispatch();
  const { trainers, isLoading, isError, message } = useSelector(
    (state) => state.trainers
  );
  
  const [filters, setFilters] = useState({
    specialty: '',
    rating: '',
    searchTerm: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  const specialties = [...new Set(
    trainers.flatMap(trainer => trainer.profile.specialties || [])
  )].sort();
  
  useEffect(() => {
    dispatch(getTrainers());
    
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  const handleApplyFilters = () => {
    dispatch(getTrainers({
      specialty: filters.specialty,
      rating: filters.rating
    }));
  };
  
  const handleResetFilters = () => {
    setFilters({
      specialty: '',
      rating: '',
      searchTerm: ''
    });
    dispatch(getTrainers());
  };
  
  const filteredTrainers = trainers.filter(trainer => {
    if (!filters.searchTerm) return true;
    
    const searchTerm = filters.searchTerm.toLowerCase();
    
    return (
      trainer.name.toLowerCase().includes(searchTerm) ||
      (trainer.profile.specialties && trainer.profile.specialties.some(s => 
        s.toLowerCase().includes(searchTerm)
      )) ||
      (trainer.profile.bio && trainer.profile.bio.toLowerCase().includes(searchTerm))
    );
  });
  
  if (isLoading) {
    return <Spinner />;
  }
  
  return (
    <div className="max-w-6xl mx-auto mt-8 px-4 pb-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Find a Trainer</h1>
      
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            name="searchTerm"
            value={filters.searchTerm}
            onChange={handleFilterChange}
            placeholder="Search trainers by name, specialty, or bio..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <FaFilter className="mr-2" />
          {showFilters ? 'Hide Filters' : 'Show Advanced Filters'}
        </button>
        
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="specialty" className="block text-gray-700 font-medium mb-1">
                Specialty
              </label>
              <select
                id="specialty"
                name="specialty"
                value={filters.specialty}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Specialties</option>
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="rating" className="block text-gray-700 font-medium mb-1">
                Minimum Rating
              </label>
              <div className="flex items-center">
                <select
                  id="rating"
                  name="rating"
                  value={filters.rating}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Rating</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                  <option value="1">1+ Star</option>
                </select>
                <FaStar className="ml-2 text-yellow-400" />
              </div>
            </div>
          </div>
        )}
        
        {showFilters && (
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        )}
      </div>
      
      {isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          Error: {message}
        </div>
      )}
      
      {filteredTrainers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrainers.map((trainer) => (
            <TrainerCard key={trainer._id} trainer={trainer} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No trainers found</h3>
          <p className="text-gray-600">
            Try adjusting your filters or search criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default Trainers;