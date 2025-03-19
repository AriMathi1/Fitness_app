import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentUser } from './features/auth/authSlice';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Classes from './pages/Classes';
import ClassDetails from './pages/ClassDetails';
import Trainers from './pages/Trainers';
import TrainerDetails from './pages/TrainerDetails';
import NotFound from './pages/NotFound';

import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Bookings from './pages/Bookings';
import BookingDetails from './pages/BookingDetails';
import PaymentHistory from './pages/PaymentHistory';
import PaymentDetails from './pages/PaymentDetails';
import TrainerClassesManage from './pages/TrainerClassesManage';
import ClassCreatePage from './pages/ClassCreatePage';
import ClassEditPage from './pages/ClassEditPage';

import PrivateRoute from './components/common/PrivateRoute';
import TrainerRoute from './components/common/TrainerRoute';

const AuthenticatedLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
    <Footer />
  </div>
);

function App() {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (localStorage.getItem('user')) {
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  if (isLoading && !user) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" replace />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

      <Route
        path="/"
        element={
          <AuthenticatedLayout>
            {user ? <Navigate to="/dashboard" replace /> : <Navigate to="/register" replace />}
          </AuthenticatedLayout>
        }
      />
      <Route
        path="/classes"
        element={
          <AuthenticatedLayout>
            <Classes />
          </AuthenticatedLayout>
        }
      />
      <Route
        path="/classes/:id"
        element={
          <AuthenticatedLayout>
            <ClassDetails />
          </AuthenticatedLayout>
        }
      />
      <Route
        path="/trainers"
        element={
          <AuthenticatedLayout>
            <Trainers />
          </AuthenticatedLayout>
        }
      />
      <Route
        path="/trainers/:id"
        element={
          <AuthenticatedLayout>
            <TrainerDetails />
          </AuthenticatedLayout>
        }
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <AuthenticatedLayout>
              <Dashboard />
            </AuthenticatedLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <AuthenticatedLayout>
              <Profile />
            </AuthenticatedLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <PrivateRoute>
            <AuthenticatedLayout>
              <Bookings />
            </AuthenticatedLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/bookings/:id"
        element={
          <PrivateRoute>
            <AuthenticatedLayout>
              <BookingDetails />
            </AuthenticatedLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/payments/history"
        element={
          <PrivateRoute>
            <AuthenticatedLayout>
              <PaymentHistory />
            </AuthenticatedLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/payments/:id"
        element={
          <PrivateRoute>
            <AuthenticatedLayout>
              <PaymentDetails />
            </AuthenticatedLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/classes/manage"
        element={
          <TrainerRoute>
            <AuthenticatedLayout>
              <TrainerClassesManage />
            </AuthenticatedLayout>
          </TrainerRoute>
        }
      />
      <Route
        path="/classes/create"
        element={
          <TrainerRoute>
            <AuthenticatedLayout>
              <ClassCreatePage />
            </AuthenticatedLayout>
          </TrainerRoute>
        }
      />
      <Route
        path="/classes/edit/:id"
        element={
          <TrainerRoute>
            <AuthenticatedLayout>
              <ClassEditPage />
            </AuthenticatedLayout>
          </TrainerRoute>
        }
      />
      <Route
        path="/bookings/trainer"
        element={
          <TrainerRoute>
            <AuthenticatedLayout>
              <div>Trainer Bookings Page</div>
            </AuthenticatedLayout>
          </TrainerRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}