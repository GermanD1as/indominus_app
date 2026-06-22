import { create } from 'zustand';
import type { ARStatus } from '../services/arBridge';
import type { Product } from '../data/products';

interface ARState {
  status: ARStatus;
  selectedProduct: Product | null;
  selectedColorIndex: number;
  isSessionActive: boolean;
  bodyTrackingConfidence: number;
  lastError: string | null;
  snapshotUri: string | null;

  setStatus: (status: ARStatus) => void;
  selectProduct: (product: Product | null) => void;
  selectColor: (index: number) => void;
  setSessionActive: (active: boolean) => void;
  setBodyTrackingConfidence: (confidence: number) => void;
  setError: (error: string | null) => void;
  setSnapshotUri: (uri: string | null) => void;
  reset: () => void;
}

const initialState = {
  status: 'idle' as ARStatus,
  selectedProduct: null,
  selectedColorIndex: 0,
  isSessionActive: false,
  bodyTrackingConfidence: 0,
  lastError: null,
  snapshotUri: null,
};

export const useArStore = create<ARState>((set) => ({
  ...initialState,

  setStatus: (status) => set({ status }),
  selectProduct: (product) =>
    set({ selectedProduct: product, selectedColorIndex: 0, lastError: null }),
  selectColor: (index) => set({ selectedColorIndex: index }),
  setSessionActive: (active) => set({ isSessionActive: active }),
  setBodyTrackingConfidence: (confidence) =>
    set({ bodyTrackingConfidence: confidence }),
  setError: (error) =>
    set({ lastError: error, status: error ? 'error' : 'idle' }),
  setSnapshotUri: (uri) => set({ snapshotUri: uri }),
  reset: () => set(initialState),
}));
