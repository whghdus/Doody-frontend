import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authStorage } from '../utils/authStorage';

// In React Native emulation:
// - Android emulator uses 10.0.2.2 to access the host's localhost
// - iOS simulator can use localhost
const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  // Default base URL for Doody backend API
  const host = Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';
  return `${host}/api`;
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Auth Token securely if exists
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await authStorage.getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error fetching token from SecureStore', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Common Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Standard centralized error logging/handling
    console.error('API Error Response:', error.response?.data || error.message);
    
    // Handle 401 Unauthorized (token expiration, logout user)
    if (error.response?.status === 401) {
      try {
        await authStorage.deleteToken();
        await AsyncStorage.removeItem('userEmail');
        await AsyncStorage.removeItem('userNickname');
      } catch (storageError) {
        console.error('Error clearing secure storage on 401', storageError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
