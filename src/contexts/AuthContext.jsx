import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast'; // Adjust this path if needed

const AuthContext = createContext(undefined);

// Mock API functions (replace with actual API calls)
const mockLogin = async (email, password) => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const mockUsers = {
    'candidate@example.com': {
      id: 'c123',
      name: 'Test Candidate',
      email: 'candidate@example.com',
      role: 'candidate',
    },
    'recruiter@example.com': {
      id: 'r456',
      name: 'Test Recruiter',
      email: 'recruiter@example.com',
      role: 'recruiter',
    },
    'admin@example.com': {
      id: 'a789',
      name: 'Test Admin',
      email: 'admin@example.com',
      role: 'admin',
    },
  };

  if (mockUsers[email] && password === 'password') {
    return mockUsers[email];
  }

  throw new Error('Invalid credentials');
};

const mockSignup = async (name, email, password, role) => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    id: `user_${Math.random().toString(36).substr(2, 9)}`,
    name,
    email,
    role,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const user = await mockLogin(email, password);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'candidate') {
        navigate('/candidate-dashboard');
      } else if (user.role === 'recruiter') {
        navigate('/recruiter-dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin-dashboard');
      }

      toast({
        title: 'Success',
        description: 'You have successfully logged in',
      });
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: 'Login Failed',
        description: error?.message || 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name, email, password, role) => {
    try {
      setIsLoading(true);
      const user = await mockSignup(name, email, password, role);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));

      if (role === 'candidate') {
        navigate('/candidate-dashboard');
      } else if (role === 'recruiter') {
        navigate('/recruiter-dashboard');
      } else if (role === 'admin') {
        navigate('/admin-dashboard');
      }

      toast({
        title: 'Account Created',
        description: 'Your account has been successfully created',
      });
    } catch (error) {
      console.error('Signup failed:', error);
      toast({
        title: 'Signup Failed',
        description: error?.message || 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
