import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { Text } from '@/components/ui/text';
import { useNotificacaoDetalhe } from '@/hooks/notificacoes/use-notificacao-detalhe';

export default function NotificacaoDetalheScreen() {
  const { colors, spacing } = useTheme();
  const { data, isLoading, handleBack } = useNotificacaoDetalhe();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { borderBottomColor: colors.border, paddingHorizontal: spacing.md }]}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text variant="subtitle" style={{ color: colors.text, marginLeft: spacing.md }}>
          Notificações
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
          <Text variant="caption" style={{ color: colors.textSecondary }}>Comunicado Fatecie</Text>
          <Text variant="subtitle" style={{ marginTop: spacing.sm, textTransform: 'uppercase' }}>
            {data?.titulo}
          </Text>
          <Text variant="body" style={{ marginTop: spacing.md, color: colors.textSecondary }}>
            {data?.mensagem?.replace(/<\/?[^>]+(>|$)/g, '')}
          </Text>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
