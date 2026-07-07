import apiClient from './apiClient';
import { authStorage } from '@/shared/lib/authStorage';

export interface BackendDoodyCollectionResponse {
  doodyCollectionId: number;
  doodyId: string;
  name: string;
  tier: string;
  axis: string;
  imageUrl: string;
  earnedReason: string;
  source: string;
  sourceId: number;
  collectedAt: string;
}

export interface BackendDoodyCollectionDetailResponse extends BackendDoodyCollectionResponse {
  description: string;
  unlockCondition: string;
  detail: {
    detailId: number;
    detailTitle: string;
    detailDescription: string;
    personality: string;
    detailImageUrl: string;
    createdAt: string;
    updatedAt: string;
  } | null;
}

export const collectionApi = {
  getCollectedDoodies: async (): Promise<BackendDoodyCollectionResponse[]> => {
    const userId = await authStorage.getToken();
    if (!userId) throw new Error('No User ID found. Please log in.');
    
    // GET /api/users/{userId}/doody-collections
    const response = await apiClient.get<{ result: BackendDoodyCollectionResponse[] }>(
      `/users/${userId}/doody-collections`
    );
    return response.data.result || [];
  },

  getDoodyCollectionDetail: async (collectionId: number): Promise<BackendDoodyCollectionDetailResponse> => {
    const userId = await authStorage.getToken();
    if (!userId) throw new Error('No User ID found. Please log in.');

    // GET /api/users/{userId}/doody-collections/{collectionId}
    const response = await apiClient.get<{ result: BackendDoodyCollectionDetailResponse }>(
      `/users/${userId}/doody-collections/${collectionId}`
    );
    return response.data.result;
  },
};
