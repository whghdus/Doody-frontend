import apiClient from './apiClient';
import { authStorage } from '../utils/authStorage';

export interface BackendCollectionPin {
  pinId: string;
  title: string;
  lat: number;
  lng: number;
  doodyId: string;
  doodyName: string;
  imageUrl: string;
  distanceMeter: number;
  captureAvailable: boolean;
}

export interface BackendCollectionPinsResponse {
  status: number;
  isSuccess: boolean;
  message: string;
  result: BackendCollectionPin[];
}

export interface BackendCaptureDoodyRequest {
  userId: string;
  pinId: string;
  lat: number;
  lng: number;
}

export interface BackendCaptureDoodyResponse {
  status: number;
  isSuccess: boolean;
  message: string;
  result: {
    captureId: number;
    dudy: {
      id: string;
      tier: string;
      axis: string;
      earnedReason: string;
    };
    reward: {
      hanaMoney: number;
    };
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
    collectedDudy: Array<{
      id: string;
      tier: string;
      axis: string;
      earnedReason: string;
    }>;
    unlockedContacts: any[];
  };
}

export const collectionPinApi = {
  getNearbyPins: async (lat: number, lng: number, radiusMeter: number = 2000): Promise<BackendCollectionPin[]> => {
    // GET /api/collection/pins?lat=37.5665&lng=126.978&radiusMeter=2000
    const response = await apiClient.get<BackendCollectionPinsResponse>('/collection/pins', {
      params: {
        lat,
        lng,
        radiusMeter
      }
    });
    return response.data.result || [];
  },

  captureDoody: async (pinId: string, lat: number, lng: number): Promise<BackendCaptureDoodyResponse['result']> => {
    const userId = await authStorage.getToken();
    if (!userId) throw new Error('No User ID found. Please log in.');

    const payload: BackendCaptureDoodyRequest = {
      userId,
      pinId,
      lat,
      lng
    };

    const response = await apiClient.post<BackendCaptureDoodyResponse>('/collection/capture', payload);
    return response.data.result;
  }
};
