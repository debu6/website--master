/**
 * Utility functions for cookie management
 */

export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  
  const nameEQ = name + '=';
  const cookies = document.cookie.split(';');
  
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(nameEQ)) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }
  
  return null;
};

export const setCookie = (name: string, value: string, days: number = 7): void => {
  if (typeof document === 'undefined') return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
};

export const deleteCookie = (name: string): void => {
  if (typeof document === 'undefined') return;
  
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

export const getAuthToken = (): string | null => {
  return getCookie('authToken');
};

export const setAuthToken = (token: string): void => {
  setCookie('authToken', token, 7); // 7 days
};

export const clearAuthToken = (): void => {
  deleteCookie('authToken');
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return !!token;
};
