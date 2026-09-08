import { useTheme } from '@/hooks/use-theme';
import { Text as RNText, TextProps, TextStyle } from 'react-native';

type Variant = 'title' | 'subtitle' | 'body' | 'label' | 'caption' | 'error';

type Props = Omit<TextProps, 'style'> & {
  children: React.ReactNode;
  variant?: Variant;
  style?: TextStyle;
};

export function Text({ children, variant = 'body', style, ...rest }: Props) {
  const { colors, fontSize, fontWeight } = useTheme();

  const variantStyles: Record<Variant, TextStyle> = {
    title: {
      fontSize: fontSize.xxxl,
      fontWeight: fontWeight.bold,
      color: colors.text,
    },
    subtitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.semiBold,
      color: colors.text,
    },
    body: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.regular,
      color: colors.text,
    },
    label: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.textSecondary,
    },
    caption: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.regular,
      color: colors.textSecondary,
    },
    error: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.regular,
      color: colors.error,
    },
  };

  return (
    <RNText style={[variantStyles[variant], style]} {...rest}>
      {children}
    </RNText>
  );
}
