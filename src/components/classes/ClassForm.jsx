import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const ClassForm = ({ initialData, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    duration: 60,
    price: 0,
    location: 'Virtual',
    isActive: true,
    schedule: []
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [scheduleItem, setScheduleItem] = useState({
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:00'
  });
  
  const { classTypes } = useSelector((state) => state.classes);
  
  // Initialize form with data if editing
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };
  
  // Handle schedule item changes
  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setScheduleItem(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  // Add schedule item to schedule
  const addScheduleItem = () => {
    // Validate start time is before end time
    const start = scheduleItem.startTime.split(':');
    const end = scheduleItem.endTime.split(':');
    
    if (parseInt(start[0]) > parseInt(end[0]) || 
        (parseInt(start[0]) === parseInt(end[0]) && parseInt(start[1]) >= parseInt(end[1]))) {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        schedule: 'End time must be after start time'
      }));
      return;
    }
    
    // Check for overlap
    const hasOverlap = formData.schedule.some(item => {
      return item.day === scheduleItem.day && (
        (scheduleItem.startTime >= item.startTime && scheduleItem.startTime < item.endTime) ||
        (scheduleItem.endTime > item.startTime && scheduleItem.endTime <= item.endTime) ||
        (scheduleItem.startTime <= item.startTime && scheduleItem.endTime >= item.endTime)
      );
    });
    
    if (hasOverlap) {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        schedule: 'This time slot overlaps with an existing schedule'
      }));
      return;
    }
    
    // Add to schedule
    setFormData(prevState => ({
      ...prevState,
      schedule: [...prevState.schedule, { ...scheduleItem }]
    }));
    
    // Clear schedule error if any
    if (formErrors.schedule) {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        schedule: ''
      }));
    }
  };
  
  // Remove schedule item
  const removeSchedule = (index) => {
    setFormData(prevState => ({
      ...prevState,
      schedule: prevState.schedule.filter((_, i) => i !== index)
    }));
  };
  
  // Format time for display
  const formatTime = (time24h) => {
    if (!time24h) return '';
    
    const [hour, minute] = time24h.split(':');
    const hourInt = parseInt(hour, 10);
    const period = hourInt >= 12 ? 'PM' : 'AM';
    const hour12 = hourInt % 12 || 12;
    return `${hour12}:${minute} ${period}`;
  };
  
  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!formData.type) {
      errors.type = 'Class type is required';
    }
    
    if (!formData.duration || formData.duration <= 0) {
      errors.duration = 'Duration must be greater than 0';
    }
    
    if (!formData.price && formData.price !== 0) {
      errors.price = 'Price is required';
    }
    
    if (formData.schedule.length === 0) {
      errors.schedule = 'At least one schedule must be added';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    } else {
      // Scroll to first error
      const firstError = document.querySelector('.text-red-600');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Basic Information</h3>
            <p className="mt-1 text-sm text-gray-500">
              This information will be displayed publicly so clients can find your class.
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Class Title *
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${
                    formErrors.title ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {formErrors.title && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                )}
              </div>
              
              <div className="col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${
                    formErrors.description ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Provide a detailed description of your class..."
                ></textarea>
                {formErrors.description && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                )}
              </div>
              
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Class Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`mt-1 block w-full bg-white border ${
                    formErrors.type ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                  <option value="">Select a type</option>
                  {classTypes && classTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
                {formErrors.type && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.type}</p>
                )}
              </div>
              
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location *
                </label>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="Virtual">Virtual</option>
                  <option value="In-Person">In-Person</option>
                </select>
              </div>
              
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  name="duration"
                  id="duration"
                  min="5"
                  step="5"
                  value={formData.duration}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${
                    formErrors.duration ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {formErrors.duration && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.duration}</p>
                )}
              </div>
              
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${
                    formErrors.price ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {formErrors.price && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
                )}
              </div>
              
              <div className="col-span-6">
                <div className="flex items-center">
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Active and available for booking
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Inactive classes won't appear in search results and can't be booked.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Schedule</h3>
            <p className="mt-1 text-sm text-gray-500">
              Define when this class is offered. You must add at least one schedule.
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-3">Current Schedule</h4>
              
              {formData.schedule.length === 0 ? (
                <div className="text-sm text-gray-500 italic mb-4">
                  No schedule added yet. Add a schedule below.
                </div>
              ) : (
                <div className="mb-4 bg-gray-50 rounded-md overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {formData.schedule.map((item, index) => (
                      <li key={index} className="px-4 py-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.day}</p>
                          <p className="text-sm text-gray-500">
                            {formatTime(item.startTime)} - {formatTime(item.endTime)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSchedule(index)}
                          className="text-sm text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {formErrors.schedule && (
                <div className="mb-4 p-2 bg-red-50 text-red-600 text-sm rounded">
                  {formErrors.schedule}
                </div>
              )}
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Add Schedule</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label htmlFor="day" className="block text-sm text-gray-700">
                      Day
                    </label>
                    <select
                      id="day"
                      name="day"
                      value={scheduleItem.day}
                      onChange={handleScheduleChange}
                      className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="startTime" className="block text-sm text-gray-700">
                      Start Time
                    </label>
                    <input
                      type="time"
                      id="startTime"
                      name="startTime"
                      value={scheduleItem.startTime}
                      onChange={handleScheduleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="endTime" className="block text-sm text-gray-700">
                      End Time
                    </label>
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      value={scheduleItem.endTime}
                      onChange={handleScheduleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={addScheduleItem}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add to Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Class' : 'Create Class'}
        </button>
      </div>
    </form>
  );
};

export default ClassForm;