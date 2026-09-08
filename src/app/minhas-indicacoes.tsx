import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { Text } from '@/components/ui/text';
import { useMinhasIndicacoes } from '@/hooks/perfil/use-minhas-indicacoes';
import { IndicacaoStatus } from '@/services/indicacao';

export default function MinhasIndicacoesScreen() {
  const { colors, spacing } = useTheme();
  const { itens, isLoading, isFetchingNextPage, handleLoadMore } = useMinhasIndicacoes();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { borderBottomColor: colors.border, paddingHorizontal: spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text variant="subtitle" style={{ color: colors.text, marginLeft: spacing.md }}>
          Minhas Indicações
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={itens}
          keyExtractor={(_, i) => String(i)}
          contentContainerStyle={{ padding: spacing.md }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={
            <Text variant="body" style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 40 }}>
              Você ainda não fez nenhuma indicação
            </Text>
          }
          ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={colors.primary} style={{ marginTop: 16 }} /> : null}
          renderItem={({ item }: { item: IndicacaoStatus }) => (
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Text variant="caption" style={{ color: colors.textSecondary }}>Nome do amigo(a)</Text>
              <Text variant="body" style={{ marginBottom: 8 }}>{item.nome}</Text>
              <Text variant="caption" style={{ color: colors.textSecondary }}>Curso</Text>
              <Text variant="body" style={{ marginBottom: 8 }}>{item.curso}</Text>
              <Text variant="caption" style={{ color: colors.textSecondary }}>Status</Text>
              <Text variant="body">{item.status}</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { borderRadius: 10, padding: 14, marginBottom: 10 },
});
