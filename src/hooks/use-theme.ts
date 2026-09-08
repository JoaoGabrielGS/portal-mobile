import { useColorScheme } from 'react-native';
import { lightColors, darkColors, type AppColors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import { useThemeStore } from '@/store/theme.store';

export function useTheme() {
  const systemScheme = useColorScheme();
  const mode = useThemeStore((s) => s.mode);

  const scheme = mode === 'system' ? systemScheme : mode;
  const colors: AppColors = scheme === 'dark' ? darkColors : lightColors;

  return {
    colors,
    spacing,
    fontSize,
    fontWeight,
    isDark: scheme === 'dark',
  };
}
