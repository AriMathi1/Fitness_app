import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getClasses, getClassTypes, reset } from '../features/classes/classesSlice';
import Spinner from '../components/common/Spinner';
import ClassCard from '../components/classes/ClassCard';
import { Link } from 'react-router-dom';

const Classes = () => {
  const dispatch = useDispatch();
  
  const { classes, classTypes, isLoading, isError, message } = useSelector(
    (state) => state.classes
  );
  
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    search: '',
  });
  
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [sortOption, setSortOption] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    dispatch(getClassTypes());
    
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);
  
  useEffect(() => {
    setIsSearching(true);
    const timerId = setTimeout(() => {
      setDebouncedSearch(filters.search);
      setIsSearching(false);
    }, 500);
    
    return () => {
      clearTimeout(timerId);
    };
  }, [filters.search]);
  
  useEffect(() => {
    const queryFilters = {
      ...filters,
      search: debouncedSearch
    };
    console.log('Fetching classes with filters:', queryFilters);
    dispatch(getClasses(queryFilters));
  }, [dispatch, filters.type, filters.location, debouncedSearch]);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSearchChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      search: e.target.value,
    }));
  };
  
  const clearFilters = () => {
    setFilters({
      type: '',
      location: '',
      search: '',
    });
  };
  
  const sortClasses = (classesToSort) => {
    if (!classesToSort) return [];
    
    const sorted = [...classesToSort];
    
    switch (sortOption) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'duration-short':
        return sorted.sort((a, b) => a.duration - b.duration);
      case 'duration-long':
        return sorted.sort((a, b) => b.duration - a.duration);
      case 'rating':
        return sorted.sort((a, b) => {
          const ratingA = a.trainer?.profile?.rating || 0;
          const ratingB = b.trainer?.profile?.rating || 0;
          return ratingB - ratingA;
        });
      default:
        return sorted;
    }
  };
  
  const sortedClasses = sortClasses(classes);
  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Browse Classes</h1>
          <Link
            to="/dashboard"
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            Back to Dashboard
          </Link>
        </div>
        
        <div className="mt-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            name="search"
            placeholder="Search for classes..."
            value={filters.search}
            onChange={handleSearchChange}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {isSearching && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
        </div>
        
        <div className="md:hidden mt-4">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex justify-between items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <span>Filters & Sorting</span>
            <svg className={`h-5 w-5 text-gray-500 transform ${showFilters ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className={`mt-4 bg-white p-4 rounded-lg shadow-sm ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2 md:mb-0">Filters & Sorting</h2>
            <div className="flex space-x-2">
              <button
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Class Type
              </label>
              <select
                id="type"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">All Types</option>
                {classTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <select
                id="location"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">All Locations</option>
                <option value="Virtual">Virtual</option>
                <option value="In-Person">In-Person</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                id="sort"
                name="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="duration-short">Duration: Shortest First</option>
                <option value="duration-long">Duration: Longest First</option>
                <option value="rating">Trainer Rating</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {isLoading ? 'Loading classes...' : `${sortedClasses.length} classes found`}
          </p>
        </div>
        
        <div className="mt-6">
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <Spinner />
            </div>
          ) : isError ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Error Loading Classes</h3>
              <p className="mt-1 text-sm text-gray-500">{message}</p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => dispatch(getClasses(filters))}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : sortedClasses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No Classes Found</h3>
              <p className="mt-1 text-sm text-gray-500">No classes match your current filters.</p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedClasses.map((classItem) => (
                <ClassCard key={classItem._id} classItem={classItem} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Classes;