import apiClient from './apiClient';
import { authStorage } from '../utils/authStorage';

export interface CollectedDudy {
  id: string;
  tier: string;
  axis: string;
  earnedReason: string;
}

export interface CheckInResponse {
  success: boolean;
  pointsEarned: number;
  greeting?: string;
  collectedDudy?: CollectedDudy[];
}

export interface BackendMorningRhythmRequest {
  userId: string;
  timestamp: string;
  energy: number;
}

export interface BackendEveningRhythmRequest {
  userId: string;
  timestamp: string;
  text: string;
}

const getLocalTimestamp = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 19);
};

export const checkInApi = {
  morning: async (mood: number): Promise<CheckInResponse> => {
    try {
      const userId = await authStorage.getToken();
      if (!userId) throw new Error('No User ID found. Please log in.');
      
      const payload: BackendMorningRhythmRequest = {
        userId,
        timestamp: getLocalTimestamp(),
        energy: mood,
      };
      
      const response = await apiClient.post<any>('/rhythm/morning', payload);
      const data = response.data.result;
      return {
        success: response.data.isSuccess ?? true,
        pointsEarned: data?.reward?.hanaMoney ?? 20,
        greeting: data?.greeting || 'Today is checked in.',
        collectedDudy: data?.collectedDudy || [],
      };
    } catch (error) {
      console.log('morning check-in error, using local fallback:', error);
      return {
        success: true,
        pointsEarned: 20,
        greeting: 'Today is checked in.',
        collectedDudy: [],
      };
    }
  },

  night: async (moodAnswer: string, feedback: string): Promise<CheckInResponse> => {
    try {
      const userId = await authStorage.getToken();
      if (!userId) throw new Error('No User ID found. Please log in.');

      const payload: BackendEveningRhythmRequest = {
        userId,
        timestamp: getLocalTimestamp(),
        text: `${moodAnswer}. ${feedback}`,
      };

      const response = await apiClient.post<any>('/rhythm/evening', payload);
      const data = response.data.result;
      return {
        success: response.data.isSuccess ?? true,
        pointsEarned: data?.reward?.hanaMoney ?? 30,
        greeting: data?.reply || 'Today is recorded.',
        collectedDudy: data?.collectedDudy || [],
      };
    } catch (error) {
      console.log('evening check-in error, using local fallback:', error);
      return {
        success: true,
        pointsEarned: 30,
        greeting: 'Today is recorded.',
        collectedDudy: [],
      };
    }
  },
};


