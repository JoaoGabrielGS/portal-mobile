import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

export const AUTH_TOKEN_KEY = 'auth_token';
export const AUTH_REFRESH_KEY = 'auth_refresh_token';

type AuthState = {
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setTokens: (token: string, refreshToken?: string) => Promise<void>;
  clearTokens: () => Promise<void>;
  loadTokens: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  refreshToken: null,
  isAuthenticated: false,

  setTokens: async (token, refreshToken) => {
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
    if (refreshToken) {
      await SecureStore.setItemAsync(AUTH_REFRESH_KEY, refreshToken);
    }
    set({
      token,
      refreshToken: refreshToken ?? get().refreshToken,
      isAuthenticated: true,
    });
  },

  clearTokens: async () => {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(AUTH_REFRESH_KEY);
    set({ token: null, refreshToken: null, isAuthenticated: false });
  },

  loadTokens: async () => {
    const [token, refreshToken] = await Promise.all([
      SecureStore.getItemAsync(AUTH_TOKEN_KEY),
      SecureStore.getItemAsync(AUTH_REFRESH_KEY),
    ]);
    set({ token, refreshToken, isAuthenticated: !!token });
  },
}));
