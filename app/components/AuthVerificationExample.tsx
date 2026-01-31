"use client";

import React from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { getAuthToken, isAuthenticated } from '@/app/utils/cookies';
import { ProtectedContent, useAuthVerification } from '@/app/components/ProtectedContent';

/**
 * Example component showing different auth verification methods
 */
export const AuthVerificationExample = () => {
  const { isAuth, user, isLoading, logout } = useAuth();
  const { isAuthenticated: checkAuth, requireAuth } = useAuthVerification();

  // Method 1: Using the useAuth hook
  const renderWithHook = () => {
    if (isLoading) return <p>Checking authentication...</p>;
    
    return isAuth ? (
      <div className="bg-green-500/20 border border-green-500 p-4 rounded">
        <p>✓ Authenticated via useAuth hook</p>
        <p>User: {user?.name || user?.email}</p>
      </div>
    ) : (
      <div className="bg-red-500/20 border border-red-500 p-4 rounded">
        <p>✗ Not authenticated</p>
      </div>
    );
  };

  // Method 2: Direct cookie verification
  const renderWithCookie = () => {
    const token = getAuthToken();
    return token ? (
      <div className="bg-blue-500/20 border border-blue-500 p-4 rounded">
        <p>✓ Token found in cookies</p>
        <p>Token: {token.substring(0, 20)}...</p>
      </div>
    ) : (
      <div className="bg-red-500/20 border border-red-500 p-4 rounded">
        <p>✗ No token in cookies</p>
      </div>
    );
  };

  // Method 3: Using the utility function
  const renderWithUtility = () => {
    return isAuthenticated() ? (
      <div className="bg-purple-500/20 border border-purple-500 p-4 rounded">
        <p>✓ Authenticated via isAuthenticated() utility</p>
      </div>
    ) : (
      <div className="bg-red-500/20 border border-red-500 p-4 rounded">
        <p>✗ Not authenticated via isAuthenticated() utility</p>
      </div>
    );
  };

  const handleProtectedAction = () => {
    requireAuth(() => {
      alert('Action allowed - User is authenticated!');
    });
  };

  return (
    <div className="space-y-6 p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white">Authentication Verification Examples</h2>

      {/* Method 1: useAuth Hook */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Method 1: useAuth Hook</h3>
        {renderWithHook()}
      </div>

      {/* Method 2: Direct Cookie */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Method 2: Direct Cookie Verification</h3>
        {renderWithCookie()}
      </div>

      {/* Method 3: Utility Function */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Method 3: isAuthenticated() Utility</h3>
        {renderWithUtility()}
      </div>

      {/* Method 4: Protected Content Component */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Method 4: ProtectedContent Component</h3>
        <ProtectedContent fallback={<p className="text-red-400">Login required to view premium content</p>}>
          <div className="bg-green-500/20 border border-green-500 p-4 rounded">
            <p className="text-green-400">✓ This content is only visible to authenticated users</p>
            <p className="text-green-400">Welcome, {user?.name || 'User'}!</p>
          </div>
        </ProtectedContent>
      </div>

      {/* Protected Action */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Method 5: Protected Actions</h3>
        <button
          onClick={handleProtectedAction}
          className="px-4 py-2 bg-magenta-accent text-white rounded hover:bg-magenta-accent/80"
        >
          Try Protected Action
        </button>
      </div>

      {/* Logout */}
      {isAuth && (
        <div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthVerificationExample;
