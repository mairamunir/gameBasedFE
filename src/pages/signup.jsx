import React, { useEffect } from 'react';
import SignupForm from '@/components/auth/SignupForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect to appropriate dashboard based on role
      if (user.role === 'candidate') {
        navigate('/candidate-dashboard');
      } else if (user.role === 'recruiter') {
        navigate('/recruiter-dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin-dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-r from-candidate-primary to-candidate-secondary"></div>
          <h1 className="mt-4 text-3xl font-bold">Game-On Assessment</h1>
          <p className="mt-2 text-gray-600">
            Create an account to get started
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
};

export default Signup;
