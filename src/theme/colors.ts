export const lightColors = {
  primary: '#EF6C00',
  secondary: '#1C1C1C',
  background: '#FFFFFF',
  card: '#F5F5F5',
  surface: '#F5F5F5',
  surfaceVariant: '#EFEFEF',
  text: '#1A1A1A',
  textSecondary: '#6B6B6B',
  textInverse: '#FFFFFF',
  border: '#E0E0E0',
  error: '#D32F2F',
  success: '#388E3C',
  warning: '#FBC02D',
  disabled: '#FFE0A7',
  overlay: 'rgba(0,0,0,0.5)',
};

export const darkColors: typeof lightColors = {
  primary: '#EF6C00',
  secondary: '#D9D9D9',
  background: '#121212',
  card: '#1E1E1E',
  surface: '#1E1E1E',
  surfaceVariant: '#2C2C2C',
  text: '#F5F5F5',
  textSecondary: '#9E9E9E',
  textInverse: '#FFFFFF',
  border: '#2C2C2C',
  error: '#EF5350',
  success: '#66BB6A',
  warning: '#FFB300',
  disabled: '#424242',
  overlay: 'rgba(0,0,0,0.7)',
};

export type AppColors = typeof lightColors;
