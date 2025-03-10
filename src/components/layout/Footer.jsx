import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">FitnessConnect</h3>
            <p className="text-gray-300 text-sm">
              Connect with fitness professionals and find classes that match your preferences.
            </p>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/classes" className="text-gray-300 hover:text-white text-sm">
                  Classes
                </Link>
              </li>
              <li>
                <Link to="/trainers" className="text-gray-300 hover:text-white text-sm">
                  Trainers
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white text-sm">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white text-sm">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-300 hover:text-white text-sm">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <address className="not-italic text-gray-300 text-sm">
              <p>Email: support@fitnessconnect.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-300 text-sm">
          <p>&copy; {currentYear} FitnessConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;