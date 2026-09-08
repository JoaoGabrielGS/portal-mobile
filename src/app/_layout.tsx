import '@/config/reactotron';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { useThemeStore } from '@/store/theme.store';
import { useAuthStore } from '@/store/auth.store';
import { useUserStore } from '@/store/user.store';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/services/api';
import { AnimatedSplash } from '@/components/splash/animated-splash';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function AppContent() {
  const loadMode = useThemeStore((s) => s.loadMode);
  const { isDark } = useTheme();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    loadMode().finally(() => {
      SplashScreen.hideAsync();
    });
  }, []);

  useEffect(() => {
    const unregister = api.registerInterceptTokenManager(async () => {
      await useAuthStore.getState().clearTokens();
      useUserStore.getState().clear();
      router.replace('/(auth)/login');
    });
    return unregister;
  }, []);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }} />
      <Toast />
      {showSplash && <AnimatedSplash onFinish={() => setShowSplash(false)} />}
    </>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
