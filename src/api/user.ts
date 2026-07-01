import apiClient from './apiClient';
import { OnboardingScores, MoodAnswers } from '../store/useOnboardingStore';
import { authStorage } from '../utils/authStorage';

export interface OnboardingRequest {
  selectedCategory: string | null;
  selectedGoal: string;
  selectedDuration: string;
  moodAnswers: MoodAnswers;
  mydataConsent: boolean;
  onboardingScores: OnboardingScores;
}

export interface UserResponse {
  userId: string;
  email: string;
  nickname: string;
  isMydataLinked: boolean;
  hanaMoney: number;
  createdAt: string;
  updatedAt: string;
  onboarding: {
    onboardingResponseId: number;
    gapAxis: string;
    goalChoice: string;
    recommendedPeriod: string;
    rhythmChoice: number;
    autonomyChoice: number;
    connectionChoice: number;
    createdAt: string;
  } | null;
}

export interface BackendUserLookupResponse {
  status: number;
  isSuccess: boolean;
  message: string;
  result: UserResponse;
}

export interface UserProfileResponse {
  email: string;
  nickname: string;
  points: number;
  missionCount: number;
  currentStep: number;
}

export const userApi = {
  saveOnboarding: async (data: OnboardingRequest): Promise<{ success: boolean }> => {
    const response = await apiClient.post<{ success: boolean }>('/v1/users/onboarding', data);
    return response.data;
  },

  getProfile: async (): Promise<UserProfileResponse> => {
    const userId = await authStorage.getToken();
    if (!userId) {
      throw new Error('User ID is not found. Please log in.');
    }
    // Backend API is GET /api/users/{userId}
    const response = await apiClient.get<BackendUserLookupResponse>(`/users/${userId}`);
    const responseData = response.data.result;

    return {
      email: responseData.email,
      nickname: responseData.nickname,
      points: responseData.hanaMoney ?? 0,
      missionCount: 0, // Fallback since backend does not return missionCount
      currentStep: 0,
    };
  },
};

