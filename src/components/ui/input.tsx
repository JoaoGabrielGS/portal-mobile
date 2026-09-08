import { useTheme } from '@/hooks/use-theme';
import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Text } from './text';

type Props = TextInputProps & {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
};

export function Input({
  label,
  error,
  inputStyle,
  labelStyle,
  containerStyle,
  onFocus,
  onBlur,
  ...props
}: Props) {
  const { colors, spacing, fontSize } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text variant="label" style={{ marginBottom: spacing.xs, ...labelStyle }}>
          {label}
        </Text>
      )}

      <TextInput
        style={[
          styles.input,
          {
            borderColor: error
              ? colors.error
              : isFocused
                ? colors.primary
                : colors.border,
            backgroundColor: colors.surface,
            color: colors.text,
            fontSize: fontSize.md,
            padding: spacing.sm,
            borderRadius: 8,
          },
          inputStyle,
        ]}
        placeholderTextColor={colors.textSecondary}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />

      {error && (
        <Text variant="error" style={{ marginTop: spacing.xs }}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
  },
});
