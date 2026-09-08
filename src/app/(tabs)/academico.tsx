import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { Text } from '@/components/ui/text';

type Item = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  disabled?: boolean;
};

export default function AcademicoScreen() {
  const { colors, spacing } = useTheme();

  const itens: Item[] = [
    {
      id: 'disciplinas',
      name: 'Minhas Disciplinas',
      icon: 'book-outline',
      onPress: () => router.push('/disciplinas'),
    },
    {
      id: 'historico',
      name: 'Histórico',
      icon: 'document-text-outline',
      onPress: () => router.push('/historico'),
    },
    {
      id: 'requerimentos',
      name: 'Requerimentos',
      icon: 'clipboard-outline',
      onPress: () => router.push('/requerimentos'),
    },
    {
      id: 'fale-fatecie',
      name: 'Fale com a UniFatecie',
      icon: 'chatbubbles-outline',
      onPress: () => router.push('/fale-fatecie'),
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: spacing.lg }}>
        <Text variant="title">Acadêmico</Text>
      </View>

      <View>
        {itens.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.6}
            disabled={item.disabled}
            onPress={item.onPress}
            style={[
              styles.row,
              {
                paddingHorizontal: spacing.lg,
                borderBottomColor: colors.border,
                borderBottomWidth: index < itens.length - 1 ? 1 : 0,
                opacity: item.disabled ? 0.5 : 1,
              },
            ]}
          >
            <View style={styles.left}>
              <Ionicons name={item.icon} size={22} color={colors.primary} />
              <Text variant="body" style={{ marginLeft: spacing.md }}>
                {item.name}
              </Text>
            </View>
            {item.disabled ? (
              <Text variant="caption" style={{ color: colors.textSecondary }}>
                Em breve
              </Text>
            ) : (
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
  left: { flexDirection: 'row', alignItems: 'center' },
});
