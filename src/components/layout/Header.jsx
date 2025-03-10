import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-primary-600">FitnessConnect</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/classes" className="text-gray-600 hover:text-primary-500">
              Classes
            </Link>
            <Link to="/trainers" className="text-gray-600 hover:text-primary-500">
              Trainers
            </Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-primary-500">
                  Dashboard
                </Link>
                <Link to="/bookings" className="text-gray-600 hover:text-primary-500">
                  My Bookings
                </Link>
                <Link to="/payments/history" className="text-gray-600 hover:text-primary-500">
                  Payment History
                </Link>
                <Link to="/profile" className="text-gray-600 hover:text-primary-500">
                  Profile
                </Link>
                <button
                  onClick={onLogout}
                  className="text-gray-600 hover:text-primary-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary-500">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;