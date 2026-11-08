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
    // --- MOCK FOR TEST ---
    if (missionId === 'a06_future_capture_1') {
      return {
        missionId: 'a06_future_capture_1',
        axis: 'AUTONOMY',
        stage: 1,
        title: '마음에 드는 공고 찍어서 올리기',
        description: '내가 원하는 일자리나 지원 사업의 공고를 찾아서 찍어보자.',
        reason: '관심 있는 분야의 공고를 찾아보는 것도 큰 시작이야.',
        howTo: ['마음에 드는 채용 공고나 지원 사업 공고를 찾아 사진 찍기', '사진을 업로드하여 완료하기'],
        goalTags: ['정보탐색', '자립'],
        missionType: 'NORMAL',
        requiredEvidenceCount: 1,
        reward: { hanaMoney: 50 },
        externalUrl: null,
        fallbackMissionId: null,
        isFallback: false,
      };
    }
    // ----------------------
    const userId = await authStorage.getToken();
    if (!userId) throw new Error('User ID is not found. Please log in.');

    // GET /api/users/{userId}/autonomy/missions/{missionId}
    const response = await apiClient.get<BackendAutonomyMissionDetailResponse>(
      `/users/${userId}/autonomy/missions/${missionId}`
    );
    return response.data.result;
  },

  startMission: async (missionId: string): Promise<AutonomyMissionStartResult> => {
    // --- MOCK FOR TEST ---
    if (missionId === 'a06_future_capture_1') {
      return {
        missionLogId: 999,
        missionId: 'a06_future_capture_1',
        actionType: 'START',
        startedAt: new Date().toISOString(),
      };
    }
    // ----------------------
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
    // --- MOCK FOR TEST ---
    if (missionId === 'a06_future_capture_1') {
      return {
        missionLogId: 999,
        missionId: 'a06_future_capture_1',
        updatedAri: { rhythm: 1, autonomy: 1, connection: 1 },
        appliedDelta: { rhythm: 1, autonomy: 1, connection: 1 },
        eta: 0,
        reward: { hanaMoney: 50 },
        completed: true,
        signatureAvailable: false,
        signatureCompleted: false,
        contactUnlocked: false,
        collectedDudy: [],
        unlockedContacts: [],
        message: '미션 성공'
      };
    }
    // ----------------------
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
    // --- MOCK FOR TEST ---
    if (missionId === 'a06_future_capture_1') {
      return { fileUrl: evidenceData.photoUri };
    }
    // ----------------------
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
