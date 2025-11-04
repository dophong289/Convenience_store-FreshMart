import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL } from './config';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data; // Return only data
  },
  (error) => {
    // Handle errors
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data);
      throw error.response.data;
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
      throw { message: 'Không thể kết nối với server' };
    } else {
      // Something else happened
      console.error('Error:', error.message);
      throw { message: error.message };
    }
  }
);

export default apiClient;

