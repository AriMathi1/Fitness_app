import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getClass, updateClass, getClassTypes, reset } from '../features/classes/classesSlice';
import ClassForm from '../components/classes/ClassForm';
import Spinner from '../components/common/Spinner';

const ClassEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { currentClass, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.classes
  );
  
  const [initialData, setInitialData] = useState(null);
  
  useEffect(() => {
    if (user && user.userType !== 'trainer') {
      navigate('/dashboard');
      return;
    }
    
    dispatch(getClassTypes());
    dispatch(getClass(id));
    
    return () => {
      dispatch(reset());
    };
  }, [user, id, navigate, dispatch]);
  
  useEffect(() => {
    if (currentClass) {
      if (currentClass.trainer && currentClass.trainer._id !== user?.id) {
        navigate('/classes/manage');
        return;
      }
      
      setInitialData(currentClass);
    }
  }, [currentClass, user, navigate]);
  
  useEffect(() => {
    if (isSuccess && initialData) {
      navigate('/classes/manage');
    }
  }, [isSuccess, initialData, navigate]);
  
  const handleSubmit = (formData) => {
    dispatch(updateClass({
      classId: id,
      classData: formData
    }));
  };
  
  if (isLoading || !initialData) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Edit Class</h1>
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
            initialData={initialData}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default ClassEditPage;