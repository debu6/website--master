"use client";

import { useEffect, useState } from 'react';
import { getAuthToken, isAuthenticated } from '@/app/utils/cookies';

export const useAuth = () => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      try {
        const token = getAuthToken();
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
          setIsAuth(true);
          setUser(JSON.parse(userStr));
        } else {
          setIsAuth(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuth(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    // Note: Cookies are httpOnly on backend, so they auto-clear with session
    setIsAuth(false);
    setUser(null);
  };

  return {
    isAuth,
    user,
    isLoading,
    logout,
  };
};
