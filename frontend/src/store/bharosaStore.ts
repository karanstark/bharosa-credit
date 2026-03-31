import { create } from 'zustand';
import * as api from '../utils/api';

interface BharosaReport {
  bharosa_score: number;
  feature_report: any;
  compliance_report: any;
  decision_report: any;
  explanation_report: {
     user_explanation_hi: string;
     user_explanation_en: string;
     lender_explanation: string;
  };
  edge_case_report: Record<string, boolean>;
  pipeline_summary?: any;
  // New orchestrator fields
  bharosa_profile?: any;
  decision?: any;
  explanations?: any;
  compliance?: any;
}

interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
}

interface BharosaState {
  report: BharosaReport | null;
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  analyzeFile: (file: File, amount: number) => Promise<void>;
  analyzeSample: (type: string) => Promise<void>;
  setUser: (user: UserProfile | null) => void;
  resetStore: () => void;
}

export const useBharosaStore = create<BharosaState>((set) => ({
  report: null,
  user: null,
  isLoading: false,
  error: null,

  analyzeFile: async (file, amount) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.analyzeFile(file, amount);
      set({ report: data, isLoading: false });
    } catch (err: any) {
      set({ error: api.handleApiError(err), isLoading: false });
    }
  },

  analyzeSample: async (type) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.analyzeSample(type);
      set({ report: data, isLoading: false });
    } catch (err) {
      set({ error: api.handleApiError(err), isLoading: false });
    }
  },

  setUser: (user) => set({ user }),

  resetStore: () => set({ report: null, user: null, error: null, isLoading: false }),
}));
