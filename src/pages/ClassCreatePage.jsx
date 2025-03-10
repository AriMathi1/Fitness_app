import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createClass, getClassTypes, reset } from '../features/classes/classesSlice';
import ClassForm from '../components/classes/ClassForm';
import Spinner from '../components/common/Spinner';

const ClassCreatePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.classes
  );
  
  // Check if user is a trainer
  useEffect(() => {
    if (user && user.userType !== 'trainer') {
      navigate('/dashboard');
    }
    
    // Load class types for the form dropdown
    dispatch(getClassTypes());
    
    // Reset state when component unmounts
    return () => {
      dispatch(reset());
    };
  }, [user, navigate, dispatch]);
  
  // Redirect on successful class creation
  useEffect(() => {
    if (isSuccess) {
      navigate('/classes/manage');
    }
  }, [isSuccess, navigate]);
  
  // Handle form submission
  const handleSubmit = (formData) => {
    dispatch(createClass(formData));
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Create New Class</h1>
          <button
            onClick={() => navigate('/classes/manage')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            Back to Classes
          </button>
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
        
        <div className="mt-6">
          <ClassForm 
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default ClassCreatePage;