// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import api from '@/lib/api';

const AuthContext = createContext(undefined);

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

  //LOGIN
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await api.post('/api/auth/login', { email, password });

      const token = response.data.token;
      const payload = JSON.parse(atob(token.split('.')[1])); // decode JWT

      const user = {
        id: payload.id,
        name: payload.name,
        email: payload.email,
        role: payload.role,
        token,
      };

      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'candidate') navigate('/candidate-dashboard');
      else if (user.role === 'recruiter') navigate('/recruiter-dashboard');
      else if (user.role === 'admin') navigate('/admin-dashboard');

      toast({
        title: 'Success',
        description: 'You have successfully logged in',
      });
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: error.response?.data?.message || 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
//REGISTER
  const signup = async (name, email, password, role) => {
    try {
      setIsLoading(true);
      await api.post('/api/auth/register', { name, email, password, role });

      // Immediately login after successful registration
      await login(email, password);

      toast({
        title: 'Account Created',
        description: 'Your account has been successfully created',
      });
    } catch (error) {
      toast({
        title: 'Signup Failed',
        description: error.response?.data?.message || 'An unknown error occurred',
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
