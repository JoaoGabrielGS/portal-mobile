import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

export type ThemeMode = 'system' | 'light' | 'dark';

type ThemeState = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  loadMode: () => Promise<void>;
};

const KEY = 'theme_mode';

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'system',
  setMode: (mode) => {
    set({ mode });
    AsyncStorage.setItem(KEY, mode);
  },
  loadMode: async () => {
    const stored = await AsyncStorage.getItem(KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      set({ mode: stored });
    }
  },
}));
