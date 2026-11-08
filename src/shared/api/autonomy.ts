import apiClient from './apiClient';
import { authStorage } from '@/shared/lib/authStorage';

export interface AutonomyNode {
  step: number;
  status: 'COMPLETED' | 'CURRENT' | 'LOCKED';
  missionId: string;
  title: string;
}

export interface AutonomyPathResponse {
  title: string;
  currentStep: number;
  todayAvailable: boolean;
  nodes: AutonomyNode[];
}

export interface BackendAutonomyPathResponse {
  status: number;
  isSuccess: boolean;
  message: string;
  result: AutonomyPathResponse;
}

export interface AutonomyMissionDetailResponse {
  missionId: string;
  axis: string;
  stage: number;
  title: string;
  description: string;
  reason: string;
  howTo: string[];
  goalTags: string[];
  missionType: string;
  requiredEvidenceCount: number;
  reward: { hanaMoney: number };
  externalUrl: string | null;
  fallbackMissionId: string | null;
  isFallback: boolean;
}

export interface BackendAutonomyMissionDetailResponse {
  status: number;
  isSuccess: boolean;
  message: string;
  result: AutonomyMissionDetailResponse;
}

export interface AutonomyMissionStartResult {
  missionLogId: number;
  missionId: string;
  actionType: 'START';
  startedAt: string;
}

export interface BackendAutonomyMissionStartResponse {
  status: number;
  isSuccess: boolean;
  message: string;
  result: AutonomyMissionStartResult;
}

export interface AutonomyMissionRejectResult {
  missionLogId: number;
  missionId: string;
  action: string;
  message: string;
  restOption: boolean;
  candidates: import('./mission').BackendMission[];
}

export interface BackendAutonomyMissionRejectResponse {
  status: number;
  isSuccess: boolean;
  message: string;
  result: AutonomyMissionRejectResult;
}

export const autonomyApi = {
  getPath: async (): Promise<AutonomyPathResponse> => {
    const userId = await authStorage.getToken();
    if (!userId) throw new Error('User ID is not found. Please log in.');

    // GET /api/users/{userId}/autonomy/path
    const response = await apiClient.get<BackendAutonomyPathResponse>(`/users/${userId}/autonomy/path`);
    return response.data.result;
  },

  getMission: async (missionId: string): Promise<AutonomyMissionDetailResponse> => {
    const userId = await authStorage.getToken();
    if (!userId) throw new Error('User ID is not found. Please log in.');

    // GET /api/users/{userId}/autonomy/missions/{missionId}
    const response = await apiClient.get<BackendAutonomyMissionDetailResponse>(
      `/users/${userId}/autonomy/missions/${missionId}`
    );
    return response.data.result;
  },

  startMission: async (missionId: string): Promise<AutonomyMissionStartResult> => {
    const userId = await authStorage.getToken();
    if (!userId) throw new Error('User ID is not found. Please log in.');

    // POST /api/users/{userId}/autonomy/missions/{missionId}/start
    const response = await apiClient.post<BackendAutonomyMissionStartResponse>(
      `/users/${userId}/autonomy/missions/${missionId}/start`
    );
    return response.data.result;
  },

  rejectMission: async (missionId: string, rejectReason?: string): Promise<AutonomyMissionRejectResult> => {
    const userId = await authStorage.getToken();
    if (!userId) throw new Error('User ID is not found. Please log in.');

    // POST /api/users/{userId}/autonomy/missions/{missionId}/reject
    const response = await apiClient.post<BackendAutonomyMissionRejectResponse>(
      `/users/${userId}/autonomy/missions/${missionId}/reject`,
      {
        reasonText: rejectReason || '오늘은 이걸 하기 어려워.',
      }
    );
    return response.data.result;
  },

  completeMission: async (missionId: string): Promise<AutonomyMissionCompleteResult> => {
    const userId = await authStorage.getToken();
    if (!userId) throw new Error('User ID is not found. Please log in.');

    // POST /api/users/{userId}/autonomy/missions/{missionId}/complete
    const response = await apiClient.post<BackendAutonomyMissionCompleteResponse>(
      `/users/${userId}/autonomy/missions/${missionId}/complete`
    );
    return response.data.result;
  },

  submitEvidence: async (
    missionId: string,
    evidenceData: { photoUri?: string; fileUrl?: string; contentType?: string }
  ): Promise<AutonomyMissionEvidenceResult> => {
    const userId = await authStorage.getToken();
    if (!userId) throw new Error('User ID is not found. Please log in.');

    const formData = new FormData();
    if (evidenceData.fileUrl) {
      formData.append('fileUrl', evidenceData.fileUrl);
    }
    if (evidenceData.contentType) {
      formData.append('contentType', evidenceData.contentType);
    }
    if (evidenceData.photoUri) {
      const filename = evidenceData.photoUri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = evidenceData.contentType || (match ? `image/${match[1]}` : `image/jpeg`);

      formData.append('file', {
        uri: evidenceData.photoUri,
        name: filename,
        type,
      } as any);
    }

    // POST /api/users/{userId}/autonomy/missions/{missionId}/evidence
    const response = await apiClient.post<BackendAutonomyMissionEvidenceResponse>(
      `/users/${userId}/autonomy/missions/${missionId}/evidence`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.result;
  },
};

export interface AutonomyMissionCompleteResult {
  missionLogId: number;
  missionId: string;
  updatedAri: {
    rhythm: number;
    autonomy: number;
    connection: number;
  };
  appliedDelta: {
    rhythm: number;
    autonomy: number;
    connection: number;
  };
  eta: number;
  reward: { hanaMoney: number };
  completed: boolean;
  signatureAvailable: boolean;
  signatureCompleted: boolean;
  contactUnlocked: boolean;
  collectedDudy: Array<{
    id: string;
    tier: string;
    axis: string;
    earnedReason: string;
  }>;
  unlockedContacts: any[];
  message: string;
}

export interface BackendAutonomyMissionCompleteResponse {
  status: number;
  isSuccess: boolean;
  message: string;
  result: AutonomyMissionCompleteResult;
}

export interface AutonomyMissionEvidenceResult {
  fileUrl?: string;
  [key: string]: any;
}

export interface BackendAutonomyMissionEvidenceResponse {
  status: number;
  isSuccess: boolean;
  message: string;
  result: AutonomyMissionEvidenceResult;
}
