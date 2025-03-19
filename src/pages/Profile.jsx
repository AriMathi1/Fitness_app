import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProfile, updateProfile, resetUpdateStatus } from '../features/profile/profileSlice';
import Spinner from '../components/common/Spinner';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { profile, isLoading, isUpdating, updateSuccess, isError, message } = useSelector(
    (state) => state.profile
  );

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    fitnessPreferences: [],
    fitnessGoals: '',
    availabilityPreferences: [],
    qualifications: '',
    specialties: [],
    teachingStyle: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalData, setOriginalData] = useState({});

  const fitnessOptions = [
    'Yoga', 'Pilates', 'HIIT', 'Strength Training', 
    'Cardio', 'Dance', 'Cycling', 'Running', 
    'Swimming', 'Martial Arts', 'CrossFit', 'Boxing'
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = ['Morning', 'Afternoon', 'Evening'];

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile && user) {
      const formattedData = {
        name: user?.name || '',
        email: user?.email || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        fitnessPreferences: profile.fitnessPreferences || [],
        fitnessGoals: profile.fitnessGoals || '',
        availabilityPreferences: profile.availabilityPreferences || [],
        qualifications: profile.qualifications || '',
        specialties: profile.specialties || [],
        teachingStyle: profile.teachingStyle || ''
      };
      
      setFormData(formattedData);
      setOriginalData(formattedData);
    }
  }, [profile, user]);

  useEffect(() => {
    if (updateSuccess) {
      setSuccessMessage('Profile updated successfully!');
      setHasUnsavedChanges(false);
      
      const timer = setTimeout(() => {
        setSuccessMessage('');
        dispatch(resetUpdateStatus());
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [updateSuccess, dispatch]);

  useEffect(() => {
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);
    setHasUnsavedChanges(hasChanges);
  }, [formData, originalData]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    
    setFormData((prevState) => {
      if (checked) {
        return {
          ...prevState,
          [field]: [...prevState[field], value]
        };
      } else {
        return {
          ...prevState,
          [field]: prevState[field].filter(item => item !== value)
        };
      }
    });
  };

  const validateForm = () => {
    const errors = {};
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    if (user?.userType === 'client') {
      if (formData.fitnessPreferences.length === 0) {
        errors.fitnessPreferences = 'Please select at least one fitness preference';
      }
    }
    
    if (user?.userType === 'trainer') {
      if (!formData.qualifications.trim()) {
        errors.qualifications = 'Please enter your qualifications';
      }
      
      if (formData.specialties.length === 0) {
        errors.specialties = 'Please select at least one specialty';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const firstError = document.querySelector('.text-red-600');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    dispatch(updateProfile(formData));
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to discard your changes?')) {
      setFormData(originalData);
      setFormErrors({});
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
          
          <button 
            onClick={() => navigate('/dashboard')} 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            Back to Dashboard
          </button>
        </div>
        
        <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            {isError && (
              <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
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
            
            {successMessage && (
              <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p>{successMessage}</p>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={onSubmit}>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h3>
                  <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={onChange}
                          className={`block w-full px-3 py-2 border ${
                            formErrors.name ? 'border-red-300' : 'border-gray-300'
                          } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        />
                        {formErrors.name && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          disabled
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 sm:text-sm"
                        />
                        <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <div className="mt-1">
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={onChange}
                          placeholder="(123) 456-7890"
                          className={`block w-full px-3 py-2 border ${
                            formErrors.phone ? 'border-red-300' : 'border-gray-300'
                          } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        />
                        {formErrors.phone && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">About You</h3>
                  <div className="mt-4">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="bio"
                        name="bio"
                        rows="4"
                        value={formData.bio}
                        onChange={onChange}
                        placeholder="Tell us about yourself..."
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      ></textarea>
                    </div>
                  </div>
                </div>
                
                {user?.userType === 'client' && (
                  <>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Fitness Preferences</h3>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select your preferred fitness activities
                        </label>
                        <div className={`mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 ${
                          formErrors.fitnessPreferences ? 'border border-red-300 rounded-md p-3' : ''
                        }`}>
                          {fitnessOptions.map((option) => (
                            <div key={option} className="flex items-center">
                              <input
                                id={`fitness-${option}`}
                                name={`fitness-${option}`}
                                type="checkbox"
                                value={option}
                                checked={formData.fitnessPreferences.includes(option)}
                                onChange={(e) => handleCheckboxChange(e, 'fitnessPreferences')}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label htmlFor={`fitness-${option}`} className="ml-2 block text-sm text-gray-900">
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                        {formErrors.fitnessPreferences && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.fitnessPreferences}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Fitness Goals</h3>
                      <div className="mt-4">
                        <label htmlFor="fitnessGoals" className="block text-sm font-medium text-gray-700">
                          What are your fitness goals?
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="fitnessGoals"
                            name="fitnessGoals"
                            rows="3"
                            value={formData.fitnessGoals}
                            onChange={onChange}
                            placeholder="Be specific about what you'd like to achieve..."
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Availability</h3>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          When are you typically available for classes?
                        </label>
                        <div className="mt-2 grid grid-cols-1 gap-y-4">
                          {days.map((day) => (
                            <div key={day} className="bg-gray-50 p-3 rounded-lg">
                              <p className="font-medium text-gray-700">{day}</p>
                              <div className="mt-2 grid grid-cols-3 gap-3">
                                {timeSlots.map((timeSlot) => {
                                  const value = `${day} ${timeSlot}`;
                                  return (
                                    <div key={value} className="flex items-center">
                                      <input
                                        id={`availability-${value}`}
                                        name={`availability-${value}`}
                                        type="checkbox"
                                        value={value}
                                        checked={formData.availabilityPreferences.includes(value)}
                                        onChange={(e) => handleCheckboxChange(e, 'availabilityPreferences')}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                      />
                                      <label htmlFor={`availability-${value}`} className="ml-2 block text-sm text-gray-900">
                                        {timeSlot}
                                      </label>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                {user?.userType === 'trainer' && (
                  <>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Professional Information</h3>
                      <div className="mt-4">
                        <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700">
                          Qualifications & Certifications
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="qualifications"
                            name="qualifications"
                            rows="3"
                            value={formData.qualifications}
                            onChange={onChange}
                            placeholder="List your certifications, education, and relevant experience..."
                            className={`block w-full px-3 py-2 border ${
                              formErrors.qualifications ? 'border-red-300' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                          ></textarea>
                          {formErrors.qualifications && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.qualifications}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Specialties</h3>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select the fitness areas you specialize in
                        </label>
                        <div className={`mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 ${
                          formErrors.specialties ? 'border border-red-300 rounded-md p-3' : ''
                        }`}>
                          {fitnessOptions.map((option) => (
                            <div key={option} className="flex items-center">
                              <input
                                id={`specialty-${option}`}
                                name={`specialty-${option}`}
                                type="checkbox"
                                value={option}
                                checked={formData.specialties.includes(option)}
                                onChange={(e) => handleCheckboxChange(e, 'specialties')}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label htmlFor={`specialty-${option}`} className="ml-2 block text-sm text-gray-900">
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                        {formErrors.specialties && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.specialties}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Teaching Approach</h3>
                      <div className="mt-4">
                        <label htmlFor="teachingStyle" className="block text-sm font-medium text-gray-700">
                          Describe your teaching style
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="teachingStyle"
                            name="teachingStyle"
                            rows="3"
                            value={formData.teachingStyle}
                            onChange={onChange}
                            placeholder="Describe your teaching approach and what clients can expect in your classes..."
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                <div className="flex justify-end space-x-3">
                  {hasUnsavedChanges && (
                    <button 
                      type="button" 
                      onClick={handleReset}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Discard Changes
                    </button>
                  )}
                  
                  <button 
                    type="submit" 
                    disabled={isUpdating || !hasUnsavedChanges}
                    className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      isUpdating || !hasUnsavedChanges
                        ? 'bg-indigo-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;