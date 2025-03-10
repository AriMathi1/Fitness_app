import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../api/axiosConfig';

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  const [popularClasses, setPopularClasses] = useState([]);
  const [topTrainers, setTopTrainers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
    // const fetchHomeData = async () => {
    //   setIsLoading(true);
    //   try {
    //     // Get popular classes
    //     const classesResponse = await axiosInstance.get('/classes?limit=3');
    //     setPopularClasses(classesResponse.data.slice(0, 3));

    //     // Get top trainers
    //     const trainersResponse = await axiosInstance.get('/trainers?limit=4');
    //     setTopTrainers(trainersResponse.data.slice(0, 4));
    //   } catch (error) {
    //     console.error('Error fetching home data:', error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };

    // fetchHomeData();
  // }, []);

  // Format trainer rating stars
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`full-${i}`} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="halfGradient">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#D1D5DB" />
            </linearGradient>
          </defs>
          <path fill="url(#halfGradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    // Add empty stars
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return stars;
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative">
        {/* Hero Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-800 opacity-90">
          <img
            className="w-full h-full object-cover mix-blend-overlay"
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
            alt="People exercising"
          />
        </div>
        
        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find Your Perfect Fitness Match
            </h1>
            <p className="mt-6 text-xl text-indigo-100 max-w-3xl">
              Connect with top fitness trainers, book personalized classes, and achieve your fitness goals with FitnessConnect.
            </p>
            <div className="mt-10 max-w-sm sm:flex sm:max-w-none">
              {user ? (
                <Link
                  to="/dashboard"
                  className="btn-primary text-center block sm:inline-block sm:mr-4 px-8 py-3 text-base font-medium"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn-primary text-center block sm:inline-block sm:mr-4 px-8 py-3 text-base font-medium"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="mt-3 sm:mt-0 bg-white text-primary-700 hover:bg-gray-100 text-center block sm:inline-block px-8 py-3 border border-transparent rounded-md shadow-sm text-base font-medium"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">How It Works</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Your fitness journey made simple
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Connecting with fitness professionals has never been easier. Here's how FitnessConnect works:
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-800 text-2xl font-bold mx-auto">
                  1
                </div>
                <h3 className="mt-6 text-xl font-medium text-gray-900">Browse & Choose</h3>
                <p className="mt-2 text-base text-gray-500">
                  Explore available classes and trainers based on your preferences, schedule, and fitness goals.
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-800 text-2xl font-bold mx-auto">
                  2
                </div>
                <h3 className="mt-6 text-xl font-medium text-gray-900">Book & Pay</h3>
                <p className="mt-2 text-base text-gray-500">
                  Secure your spot in your preferred classes with our simple booking and payment system.
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-800 text-2xl font-bold mx-auto">
                  3
                </div>
                <h3 className="mt-6 text-xl font-medium text-gray-900">Train & Grow</h3>
                <p className="mt-2 text-base text-gray-500">
                  Attend your classes, track your progress, and provide feedback to continually improve your experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Classes Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Featured Classes</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Popular fitness experiences
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Discover trending classes that our community loves
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <div className="col-span-3 py-12 text-center">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading featured classes...</p>
              </div>
            ) : popularClasses.length === 0 ? (
              <div className="col-span-3 py-12 text-center">
                <p className="text-gray-500">No classes available at the moment.</p>
              </div>
            ) : (
              popularClasses.map((classItem) => (
                <div key={classItem._id} className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
                  <div className="h-48 bg-gray-200 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary-900 opacity-60"></div>
                    <div className="absolute bottom-0 left-0 p-4 text-white">
                      <h3 className="text-xl font-bold">{classItem.title}</h3>
                      <p className="text-sm opacity-90">{classItem.type}</p>
                    </div>
                    <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-xs font-medium text-primary-700">
                      ${classItem.price}
                    </div>
                  </div>
                  <div className="p-4 flex-grow">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-500 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {classItem.duration} mins
                      </span>
                      <span className="text-gray-500 text-sm">{classItem.location}</span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {classItem.description}
                    </p>
                  </div>
                  <div className="px-4 pb-4 mt-auto">
                    <Link
                      to={`/classes/${classItem._id}`}
                      className="w-full btn-primary text-center block py-2"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/classes" className="btn-primary px-8 py-3 text-base font-medium">
              Explore All Classes
            </Link>
          </div>
        </div>
      </div>

      {/* Top Trainers Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Expert Trainers</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Meet our fitness professionals
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Learn from the best trainers in the industry
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {isLoading ? (
              <div className="col-span-4 py-12 text-center">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading trainers...</p>
              </div>
            ) : topTrainers.length === 0 ? (
              <div className="col-span-4 py-12 text-center">
                <p className="text-gray-500">No trainers available at the moment.</p>
              </div>
            ) : (
              topTrainers.map((trainer) => (
                <div key={trainer._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-3xl font-bold text-primary-700">
                      {trainer.name ? trainer.name.charAt(0) : 'T'}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-900">{trainer.name}</h3>
                    <div className="flex items-center mt-1">
                      <div className="flex">
                        {renderStars(trainer.profile?.rating || 0)}
                      </div>
                      <span className="ml-1 text-sm text-gray-500">
                        ({trainer.profile?.reviewCount || 0} reviews)
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {trainer.profile?.bio || 'Fitness professional with a passion for helping clients achieve their goals.'}
                      </p>
                    </div>
                    <div className="mt-3">
                      {trainer.profile?.specialties?.slice(0, 3).map((specialty, index) => (
                        <span 
                          key={index}
                          className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-medium text-gray-700 mr-2 mb-2"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4">
                      <Link
                        to={`/trainers/${trainer._id}`}
                        className="w-full btn-outline text-center block py-2"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/trainers" className="btn-primary px-8 py-3 text-base font-medium">
              Explore All Trainers
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Testimonials</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              What our users are saying
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-xl font-bold text-primary-700 mr-4">
                  S
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Sarah K.</h3>
                  <div className="flex mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "FitnessConnect has transformed my workout routine. The ability to find classes that fit my schedule
                and preferences has made it so much easier to stay consistent with my fitness goals."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-xl font-bold text-primary-700 mr-4">
                  M
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Michael T.</h3>
                  <div className="flex mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "As a trainer, this platform has helped me connect with clients I wouldn't have reached otherwise.
                The booking system is seamless, and I love being able to focus on training rather than administration."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-xl font-bold text-primary-700 mr-4">
                  J
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Jessica M.</h3>
                  <div className="flex mt-1">
                    {[1, 2, 3, 4, 5].map((star, i) => (
                      <svg key={star} className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The variety of classes available is amazing. I've tried everything from yoga to HIIT, and being able
                to read reviews before booking has helped me find instructors whose teaching styles work for me."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to transform your fitness journey?</span>
            <span className="block text-primary-200">Join FitnessConnect today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-gray-50"
              >
                Get Started
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/classes"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-500"
              >
                Browse Classes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;