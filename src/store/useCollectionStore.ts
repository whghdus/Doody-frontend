import { create } from 'zustand';
import { collectionApi, BackendDoodyCollectionResponse } from '../api/collection';

interface CollectionState {
  unlockedDoodies: number[]; // Array of indices of caught doodies (0-6)
  collectedDoodies: BackendDoodyCollectionResponse[]; // Raw backend response
  unlockDoody: (id: number) => void;
  fetchUnlockedDoodies: () => Promise<void>;
}

export const mapDoodyIdToIndex = (doodyId: string): number => {
  const lower = doodyId.toLowerCase();
  if (lower.includes('default') || lower.includes('001')) return 0;
  if (lower.includes('brush') || lower.includes('002')) return 1;
  if (lower.includes('happy') || lower.includes('003')) return 2;
  if (lower.includes('sad') || lower.includes('004')) return 3;
  if (lower.includes('smile') || lower.includes('common') || lower.includes('005')) return 4;
  if (lower.includes('salary') || lower.includes('connection') || lower.includes('006')) return 5;
  if (lower.includes('green') || lower.includes('autonomy') || lower.includes('007')) return 6;
  return 0;
};

export const useCollectionStore = create<CollectionState>((set) => ({
  unlockedDoodies: [],
  collectedDoodies: [],
  unlockDoody: (id) => set((state) => ({
    unlockedDoodies: state.unlockedDoodies.includes(id) 
      ? state.unlockedDoodies 
      : [...state.unlockedDoodies, id]
  })),
  fetchUnlockedDoodies: async () => {
    try {
      const doodies = await collectionApi.getCollectedDoodies();
      const indices = doodies.map(d => mapDoodyIdToIndex(d.doodyId));
      // Remove duplicates in mapped indices
      const uniqueIndices = Array.from(new Set(indices));
      set({ unlockedDoodies: uniqueIndices, collectedDoodies: doodies });
    } catch (error) {
      console.error('Failed to sync collection from backend:', error);
    }
  },
}));
