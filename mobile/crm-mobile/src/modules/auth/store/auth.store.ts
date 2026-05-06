import { create } from 'zustand';
import { tokenStorage } from '@/src/lib/token-storage';
import type { User } from '../types/auth.types';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

interface AuthActions {
  initialize: () => Promise<void>;
  setSession: (accessToken: string, refreshToken: string, user: User) => Promise<void>;
  clearSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  isInitialized: false,

  initialize: async () => {
    await tokenStorage.clearAll();
    set({ isAuthenticated: false, isInitialized: true });
  },

  setSession: async (accessToken, refreshToken, user) => {
    await tokenStorage.setAccessToken(accessToken);
    await tokenStorage.setRefreshToken(refreshToken);
    set({ accessToken, refreshToken, user, isAuthenticated: true });
  },

  clearSession: async () => {
    await tokenStorage.clearAll();
    set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false });
  },
}));
