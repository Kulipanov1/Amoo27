import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, UserPreferences } from '@/types/user';
import { mockUsers } from '@/mocks/users';

interface UserState {
  currentUser: User | null;
  potentialMatches: User[];
  likedUsers: string[];
  dislikedUsers: string[];
  superLikedUsers: string[];
  preferences: UserPreferences;
  setCurrentUser: (user: User) => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  setPotentialMatches: (users: User[]) => void;
  addLikedUser: (userId: string) => void;
  addDislikedUser: (userId: string) => void;
  addSuperLikedUser: (userId: string) => void;
  setPreferences: (preferences: Partial<UserPreferences>) => void;
  resetSwipes: () => void;
}

const defaultPreferences: UserPreferences = {
  ageRange: [18, 35],
  distance: 25,
  gender: 'all',
  showMe: 'all',
};

// Ensure mock users have all required fields
const validatedMockUsers = mockUsers.map(user => ({
  ...user,
  bio: user.bio || 'Нет информации',
  distance: typeof user.distance === 'number' ? user.distance : 0,
  verified: user.verified || false,
  interests: user.interests || [],
  gender: user.gender || 'other',
  lookingFor: user.lookingFor || 'all'
})) as User[];

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      currentUser: null,
      potentialMatches: [],
      likedUsers: [],
      dislikedUsers: [],
      superLikedUsers: [],
      preferences: defaultPreferences,
      setCurrentUser: (user) => set({ currentUser: user }),
      updateCurrentUser: (updates) => set((state) => {
        if (state.currentUser) {
          return { currentUser: { ...state.currentUser, ...updates } };
        }
        return state;
      }),
      setPotentialMatches: (users) => set({ potentialMatches: users }),
      addLikedUser: (userId) => set((state) => ({ 
        likedUsers: [...state.likedUsers, userId] 
      })),
      addDislikedUser: (userId) => set((state) => ({ 
        dislikedUsers: [...state.dislikedUsers, userId] 
      })),
      addSuperLikedUser: (userId) => set((state) => ({ 
        superLikedUsers: [...state.superLikedUsers, userId] 
      })),
      setPreferences: (preferences) => set((state) => ({ 
        preferences: { ...state.preferences, ...preferences } 
      })),
      resetSwipes: () => set({ 
        likedUsers: [], 
        dislikedUsers: [], 
        superLikedUsers: [],
        potentialMatches: validatedMockUsers
      }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);