import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  onPress?: () => void;
};

export function SectionTitle({ title, iconName, iconColor, onPress }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <Ionicons name={iconName} size={20} color={iconColor ?? colors.primary} />
      <Text variant="subtitle" style={{ marginLeft: 6, flex: 1, color: colors.text }}>
        {title}
      </Text>
      {onPress && (
        <TouchableOpacity onPress={onPress}>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
});
