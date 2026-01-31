"use client";

import React, { ReactNode } from 'react';
import { getAuthToken } from '@/app/utils/cookies';

interface ProtectedContentProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component to show content only if user is authenticated
 * Verifies cookie on client side
 */
export const ProtectedContent: React.FC<ProtectedContentProps> = ({ 
  children, 
  fallback = <p className="text-gray-400">Please log in to view this content</p> 
}) => {
  const isAuthenticated = getAuthToken() !== null;

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

/**
 * Hook-based version for more control
 */
export const useAuthVerification = () => {
  const isAuthenticated = () => {
    if (typeof window === 'undefined') return false;
    return getAuthToken() !== null;
  };

  const requireAuth = (callback: () => void) => {
    if (isAuthenticated()) {
      callback();
    } else {
      console.warn('User is not authenticated');
    }
  };

  return {
    isAuthenticated,
    requireAuth,
  };
};
