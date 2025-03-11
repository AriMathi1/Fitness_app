import { Link } from 'react-router-dom';

const ClassCard = ({ classItem }) => {
  if (!classItem) return null;
  
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };
  
  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-lg transition-all hover:shadow-md">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 truncate">{classItem.title}</h3>
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
              {classItem.type}
            </span>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-indigo-600">{formatPrice(classItem.price)}</p>
            <p className="text-xs text-gray-500">{classItem.duration} min</p>
          </div>
        </div>
        
        <div className="mt-3">
          <p className="text-sm text-gray-500 line-clamp-2">{classItem.description}</p>
        </div>
        
        <div className="mt-4 flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="font-medium text-indigo-800">
                {classItem.trainer?.name ? classItem.trainer.name.charAt(0).toUpperCase() : 'T'}
              </span>
            </div>
          </div>
          <div className="ml-2 overflow-hidden">
            <p className="text-sm font-medium text-gray-900 truncate">
              {classItem.trainer?.name || 'Unknown Trainer'}
            </p>
            {classItem.trainer?.profile?.rating && (
              <div className="flex items-center">
                <svg className="h-4 w-4 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="ml-1 text-xs text-gray-500">
                  {classItem.trainer.profile.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
          
          <div className="ml-auto">
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
              {classItem.location}
            </span>
          </div>
        </div>
        
        <div className="mt-4">
          <Link
            to={`/classes/${classItem._id}`}
            className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClassCard;