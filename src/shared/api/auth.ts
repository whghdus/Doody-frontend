import apiClient from './apiClient';

export interface SignupRequest {
  email: string;
  nickname: string;
  gapAxis: 'RHYTHM' | 'AUTONOMY' | 'CONNECTION' | 'COMPOSITE' | 'UNKNOWN';
  goalChoice: 'AUTONOMY' | 'RHYTHM' | 'CONNECTION';
  recommendedPeriod: 'today' | '1w' | '1m' | '3m';
  rhythmChoice?: number;
  autonomyChoice?: number;
  connectionChoice?: number;
  isMydataLinked?: boolean;
  autonomyGoal: string;
  connectionGoal: string;
  firstStepMission?: string;
}

export interface SignupResponse {
  status: number;
  isSuccess: boolean;
  message: string;
  result: {
    userId: string;
    email: string;
    nickname: string;
    isMydataLinked: boolean;
    onboardingResponseId: number;
    goalId: number;
    firstStepMission: string;
    initial_ari: {
      rhythm: number;
      autonomy: number;
      connection: number;
    };
    goal: {
      rhythm: number;
      autonomy: number;
      connection: number;
    };
    period: string;
    start_axis: string;
    plan_summary: string;
    diagnostics: any;
  };
}

export interface LoginResponse {
  status: number;
  isSuccess: boolean;
  message: string;
  result: {
    userId: string;
    email: string;
    nickname: string;
    isMydataLinked: boolean;
  };
}

export const authApi = {
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    const response = await apiClient.post<SignupResponse>('/signup', data);
    return response.data;
  },

  login: async (email: string, nickname: string): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/login', {
      email,
      nickname,
    });
    return response.data;
  },
};
