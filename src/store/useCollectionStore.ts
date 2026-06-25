import { create } from 'zustand';

interface CollectionState {
  unlockedDoodies: number[]; // Array of indices of caught doodies (0-4)
  unlockDoody: (id: number) => void;
}

export const useCollectionStore = create<CollectionState>((set) => ({
  unlockedDoodies: [],
  unlockDoody: (id) => set((state) => ({
    unlockedDoodies: state.unlockedDoodies.includes(id) 
      ? state.unlockedDoodies 
      : [...state.unlockedDoodies, id]
  })),
}));
