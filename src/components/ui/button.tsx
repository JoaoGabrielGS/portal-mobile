import { useTheme } from '@/hooks/use-theme';
import {
  ActivityIndicator,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Text } from './text';

type Variant = 'primary' | 'outline' | 'ghost';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  style,
}: Props) {
  const { colors, spacing } = useTheme();

  const isDisabled = disabled || isLoading;

  const containerStyles: Record<Variant, ViewStyle> = {
    primary: {
      backgroundColor: colors.primary,
      borderWidth: 0,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.primary,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
  };

  const labelStyles: Record<Variant, TextStyle> = {
    primary: { color: colors.textInverse },
    outline: { color: colors.primary },
    ghost: { color: colors.primary },
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.base,
        { padding: spacing.md, borderRadius: 8 },
        containerStyles[variant],
        isDisabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.textInverse : colors.primary}
        />
      ) : (
        <Text
          variant="label"
          style={{ ...styles.label, ...labelStyles[variant] }}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.5,
  },
});
