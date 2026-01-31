import axios from 'axios';
import { getAuthToken } from '@/app/utils/cookies';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

// Add request interceptor to include token from cookies
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const authAPI = {
  // Register user
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    country: string;
  }) => apiClient.post('/auth/register', data),

  // Login user
  login: (data: { email: string; password: string }) =>
    apiClient.post('/auth/login', data),

  // Get profile
  getProfile: () => apiClient.get('/auth/profile'),
};
