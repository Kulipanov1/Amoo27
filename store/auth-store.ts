import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  telegramUser: {
    id: string;
    username: string | null;
    firstName: string | null;
    lastName: string | null;
    photoUrl: string | null;
  } | null;
  isOnboarded: boolean;
  isLoading: boolean;
  error: string | null;
  setIsAuthenticated: (value: boolean) => void;
  login: (userId: string, telegramUser?: AuthState['telegramUser']) => void;
  logout: () => void;
  setOnboarded: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userId: null,
      telegramUser: null,
      isOnboarded: false,
      isLoading: false,
      error: null,
      setIsAuthenticated: (value) => set({ isAuthenticated: value }),
      login: (userId, telegramUser = null) => set({ 
        isAuthenticated: true, 
        userId, 
        telegramUser,
        error: null,
      }),
      logout: () => set({ 
        isAuthenticated: false, 
        userId: null, 
        telegramUser: null,
        error: null,
      }),
      setOnboarded: (value) => set({ isOnboarded: value }),
      setLoading: (value) => set({ isLoading: value }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        userId: state.userId,
        telegramUser: state.telegramUser,
        isOnboarded: state.isOnboarded,
      }),
    }
  )
);