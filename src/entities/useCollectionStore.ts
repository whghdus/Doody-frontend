import { create } from 'zustand';
import { collectionApi, BackendDoodyCollectionResponse } from '@/shared/api/collection';

interface CollectionState {
  unlockedDoodies: number[]; // Array of indices of caught doodies (0-6)
  collectedDoodies: BackendDoodyCollectionResponse[]; // Raw backend response
  unlockDoody: (id: number) => void;
  fetchUnlockedDoodies: () => Promise<void>;
}

export const mapDoodyIdToIndex = (doodyId: string): number => {
  const lower = doodyId.toLowerCase();
  if (lower.includes('exploration') || lower.includes('map') || lower.includes('008') || lower.includes('002')) return 5;
  if (lower.includes('default') || lower.includes('001')) return 0;
  if (lower.includes('brush')) return 1;
  if (lower.includes('happy') || lower.includes('003')) return 2;
  if (lower.includes('sad') || lower.includes('004')) return 3;
  if (lower.includes('smile') || lower.includes('common') || lower.includes('005')) return 4;
  if (lower.includes('salary') || lower.includes('connection') || lower.includes('006')) return 6;
  if (lower.includes('green') || lower.includes('autonomy') || lower.includes('007')) return 7;
  return 0;
};

export const useCollectionStore = create<CollectionState>()((set) => ({
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
      set((state) => {
        // Still merge with current session state to ensure immediate UI updates aren't lost
        const mergedIndices = Array.from(new Set([...state.unlockedDoodies, ...uniqueIndices]));
        return { unlockedDoodies: mergedIndices, collectedDoodies: doodies };
      });
    } catch (error) {
      console.error('Failed to fetch collection from backend:', error);
    }
  },
}));
