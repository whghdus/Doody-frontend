import apiClient from './apiClient';
import { authStorage } from '@/shared/lib/authStorage';

export interface Mission {
  id: string;
  title: string;
  points: number;
  steps: string[];
  reason?: string;
  difficulty?: 'easy' | 'normal' | 'hard';
  nextPath?: string;
  missionState?: string;
  restMessage?: string | null;
  hasFallback?: boolean;
  axis?: string;
  vRhythm?: number;
  completable?: boolean;
}

export interface CompleteMissionResponse {
  success: boolean;
  pointsEarned: number;
  newTotalPoints: number;
  currentStep: number;
}

export interface BackendMission {
  id: string;
  missionId: string;
  axis: string;
  stage: number;
  waypoint: string;
  difficulty: number;
  title: string;
  description: string;
  missionType: string;
  requiredCount: number;
  isSignature: boolean;
  isFallback: boolean;
  fallbackMissionId: string;
  goalTags: string[];
  howTo: string[];
  reason: string;
  reward?: { hanaMoney: number };
  completable?: boolean;
}

export interface BackendTodayMissionResponse {
  mission: BackendMission | null;
  fallback: BackendMission | null;
  missionState: string;
  recommendedAxis: string;
  nextPath: string;
  restMessage: string;
  unlockedContacts: any[];
  vRhythm: number;
  diagnostics: any;
  source: string;
}

export const missionApi = {
  getTodayMission: async (): Promise<Mission> => {
    const userId = await authStorage.getToken();
    if (!userId) {
      throw new Error('User ID is not found. Please log in.');
    }

    // Backend API: GET /api/users/{userId}/missions/today
    const response = await apiClient.get<{ result: BackendTodayMissionResponse }>(`/users/${userId}/missions/today`);
    const data = response.data.result;

    const activeMission = data.mission || data.fallback;
    if (!activeMission) {
      // Backend returned null missions (e.g., when the AI engine is not connected and templates are empty, or when gated)
      return {
        id: 'gated-mission-id',
        title: data.restMessage || '오늘은 일상 루틴 관리에 집중해봐!',
        points: 0,
        steps: [],
        nextPath: data.nextPath || '',
        missionState: data.missionState || 'gated',
        restMessage: data.restMessage || '오늘은 일상 루틴 관리에 집중해봐!',
        hasFallback: data.source === 'FALLBACK',
        vRhythm: data.vRhythm,
      };
    }

    const diffMap: Record<number, 'easy' | 'normal' | 'hard'> = {
      1: 'easy',
      2: 'normal',
      3: 'hard'
    };

    return {
      id: activeMission.id,
      title: activeMission.title,
      points: activeMission.difficulty * 50,
      steps: activeMission.howTo || [],
      reason: activeMission.reason,
      difficulty: diffMap[activeMission.difficulty] || 'normal',
      nextPath: data.nextPath || '',
      missionState: data.missionState || 'active',
      restMessage: data.restMessage,
      hasFallback: data.fallback !== null,
      axis: activeMission.axis,
      vRhythm: data.vRhythm,
      completable: activeMission.completable !== false, // default true unless explicitly false
    };
  },

  swapMission: async (difficulty: 'easy' | 'normal' | 'hard'): Promise<Mission> => {
    try {
      const userId = await authStorage.getToken();
      if (!userId) throw new Error('No User ID');

      const response = await apiClient.post<{ result: BackendMission }>(`/users/${userId}/missions/swap`, { difficulty });
      const activeMission = response.data.result;

      const diffMap: Record<number, 'easy' | 'normal' | 'hard'> = {
        1: 'easy',
        2: 'normal',
        3: 'hard'
      };

      return {
        id: activeMission.id,
        title: activeMission.title,
        points: activeMission.difficulty * 50,
        steps: activeMission.howTo || [],
        reason: activeMission.reason,
        difficulty: diffMap[activeMission.difficulty] || 'normal'
      };
    } catch (error) {
      console.log('swapMission backend endpoint not available, returning simulated swap mission:', error);
      // Fallback simulated swap mission
      const steps = difficulty === 'easy'
        ? ['간단한 잔액 조회', '가계부에 기록']
        : ['이번 달 고정비 정리', '내일 계획 세우기'];
      return {
        id: 'simulated-swap-id',
        title: difficulty === 'easy' ? '오늘 하루 지출 5,000원 이하로 유지하기' : '불필요한 구독 서비스 하나 해지하기',
        points: difficulty === 'easy' ? 50 : 100,
        steps,
        reason: '목표에 맞는 새로운 미션이야.',
        difficulty
      };
    }
  },

  completeMission: async (photoUri?: string): Promise<CompleteMissionResponse> => {
    const formData = new FormData();
    if (photoUri) {
      const filename = photoUri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append('photo', {
        uri: photoUri,
        name: filename,
        type,
      } as any);
    }

    try {
      const userId = await authStorage.getToken();
      if (!userId) throw new Error('No User ID');

      const response = await apiClient.post<{ result: CompleteMissionResponse }>(
        `/users/${userId}/missions/complete`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.result;
    } catch (error) {
      console.log('completeMission backend endpoint not available, returning simulated completion:', error);
      return {
        success: true,
        pointsEarned: 50,
        newTotalPoints: 1270,
        currentStep: 1
      };
    }
  },

  restToday: async (): Promise<{ success: boolean }> => {
    try {
      const userId = await authStorage.getToken();
      if (!userId) throw new Error('No User ID');

      const response = await apiClient.post<{ result: { success: boolean } }>(`/users/${userId}/missions/rest`);
      return response.data.result;
    } catch (error) {
      console.log('restToday backend endpoint not available, returning simulated success:', error);
      return { success: true };
    }
  },
};

