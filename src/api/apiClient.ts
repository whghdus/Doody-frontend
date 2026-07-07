import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authStorage } from '../utils/authStorage';

// In React Native emulation:
// - Android emulator uses 10.0.2.2 to access the host's localhost
// - iOS simulator can use localhost
const getBaseUrl = () => {
  // On web, if deployed (or even local), route through '/api' so Vercel proxy handles HTTP backend
  if (Platform.OS === 'web') {
    return '/api';
  }
  
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  // Default base URL for Doody backend API
  const host = Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';
  return `${host}/api`;
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 120000, // Increased to 60 seconds for heavy AI requests (like onboarding init)
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
    // Log detailed network error to Expo terminal
    console.warn('===== API ERROR =====');
    if (error.config) {
      console.warn(`[REQUEST] ${error.config.method?.toUpperCase()} ${error.config.baseURL}${error.config.url}`);
      console.warn(`[PAYLOAD]`, JSON.stringify(error.config.data, null, 2));
    }
    console.warn(`[RESPONSE STATUS]`, error.response?.status);
    console.warn(`[RESPONSE DATA]`, JSON.stringify(error.response?.data, null, 2) || error.message);
    console.warn('=====================');

    // Handle 401 Unauthorized (token expiration, logout user)
    if (error.response?.status === 401) {
      try {
        await authStorage.deleteToken();
        await AsyncStorage.removeItem('userEmail');
        await AsyncStorage.removeItem('userNickname');
        await AsyncStorage.removeItem('doody-collection-storage');
      } catch (storageError) {
        console.error('Error clearing secure storage on 401', storageError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
