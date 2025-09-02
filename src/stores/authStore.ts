import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  userId: string | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setUserId: (userId: string) => void;
  setToken: (token: string) => void;
  clearAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  userId: null,
  token: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      setUserId: (userId: string) => set({ userId }),
      setToken: (token: string) => set({ token, isAuthenticated: true }),
      clearAuth: () => set(initialState),
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        userId: state.userId,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
