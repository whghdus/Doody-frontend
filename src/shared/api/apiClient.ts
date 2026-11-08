import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authStorage } from '@/shared/lib/authStorage';

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

// Called after a 401 clears the session (e.g. App resets navigation to Landing).
// Registered from the app layer so shared/ does not depend on navigation.
let unauthorizedHandler: (() => void) | null = null;
let isHandlingUnauthorized = false;

export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  unauthorizedHandler = handler;
};

// Response Interceptor: Common Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Detailed request/response dump for debugging with the backend; dev builds only
    // so payloads (which can contain personal data) never reach production logs.
    if (__DEV__) {
      console.warn('===== API ERROR =====');
      if (error.config) {
        console.warn(`[REQUEST] ${error.config.method?.toUpperCase()} ${error.config.baseURL}${error.config.url}`);
        console.warn(`[PAYLOAD]`, JSON.stringify(error.config.data, null, 2));
      }
      console.warn(`[RESPONSE STATUS]`, error.response?.status);
      console.warn(`[RESPONSE DATA]`, JSON.stringify(error.response?.data, null, 2) || error.message);
      console.warn('=====================');
    }

    // Handle 401 Unauthorized: clear the session, then send the user back to the entry screen.
    // Several requests can fail at once, so only the first one triggers the redirect.
    if (error.response?.status === 401 && !isHandlingUnauthorized) {
      isHandlingUnauthorized = true;
      try {
        await authStorage.deleteToken();
        await AsyncStorage.multiRemove(['userEmail', 'userNickname', 'doody-collection-storage']);
      } catch (storageError) {
        console.error('Error clearing secure storage on 401', storageError);
      } finally {
        unauthorizedHandler?.();
        isHandlingUnauthorized = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
