import apiClient from './apiClient';
import { authStorage } from '../utils/authStorage';

export interface HanaContact {
  contactId: string;
  title: string;
  url: string | null;
  unlockedAt: string | null;
}

export interface HanaRareDoody {
  doodyCollectionId: number | null;
  doodyId: string;
  name: string | null;
  tier: string;
  axis: string;
  imageUrl: string | null;
  collectedAt: string | null;
}

export interface HanaFinanceUnlockStatusResponse {
  axis: string;
  requiredStage: number;
  reachedStage: number;
  unlockable: boolean;
  unlocked: boolean;
  contact: HanaContact | null;
  rareDoody: HanaRareDoody | null;
}

export interface BackendHanaFinanceUnlockStatusResponse {
  status: number;
  isSuccess: boolean;
  message: string;
  result: HanaFinanceUnlockStatusResponse;
}

export const hanaFinanceApi = {
  getUnlockStatus: async (axis: 'AUTONOMY' | 'CONNECTION'): Promise<HanaFinanceUnlockStatusResponse> => {
    const userId = await authStorage.getToken();
    if (!userId) throw new Error('No User ID found. Please log in.');
    
    // GET /api/users/{userId}/hana-finance/unlock-status?axis=...
    const response = await apiClient.get<BackendHanaFinanceUnlockStatusResponse>(
      `/users/${userId}/hana-finance/unlock-status`,
      { params: { axis } }
    );
    return response.data.result;
  },

  unlockHanaFinance: async (axis: 'AUTONOMY' | 'CONNECTION'): Promise<HanaFinanceUnlockResponse> => {
    const userId = await authStorage.getToken();
    if (!userId) throw new Error('No User ID found. Please log in.');
    
    // POST /api/users/{userId}/hana-finance/unlocks
    const response = await apiClient.post<BackendHanaFinanceUnlockResponse>(
      `/users/${userId}/hana-finance/unlocks`,
      { axis, requiredStage: 10 }
    );
    return response.data.result;
  },
};

export interface HanaFinanceUnlockResponse {
  axis: string;
  requiredStage: number;
  reachedStage: number;
  newlyUnlocked: boolean;
  contact: HanaContact | null;
  rareDoody: HanaRareDoody | null;
  message: string;
}

export interface BackendHanaFinanceUnlockResponse {
  status: number;
  isSuccess: boolean;
  message: string;
  result: HanaFinanceUnlockResponse;
}
