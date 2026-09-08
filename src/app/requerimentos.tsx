import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { Text } from '@/components/ui/text';
import { useRequerimentos } from '@/hooks/requerimento/use-requerimentos';
import { SolicitacaoResumo } from '@/services/requerimento';
import { getRequerimentoStatusColor } from '@/utils/requerimento-status';

export default function RequerimentosScreen() {
  const { colors, spacing } = useTheme();
  const { itens, isLoading, isFetchingNextPage, handleLoadMore, handlePress } = useRequerimentos();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { borderBottomColor: colors.border, paddingHorizontal: spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text variant="subtitle" style={{ color: colors.text, marginLeft: spacing.md }}>
          Requerimentos
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={itens}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: spacing.md }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={colors.primary} style={{ marginTop: 16 }} /> : null}
          ListEmptyComponent={
            <Text variant="body" style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 40 }}>
              Você não possui nenhum requerimento
            </Text>
          }
          renderItem={({ item }: { item: SolicitacaoResumo }) => {
            const cor = getRequerimentoStatusColor(item.status.id);
            return (
              <TouchableOpacity
                onPress={() => handlePress(item)}
                style={[styles.card, { backgroundColor: colors.card }]}
                activeOpacity={0.7}
              >
                <View style={{ flex: 1 }}>
                  <Text variant="caption" style={{ color: colors.textSecondary }}>Tipo de Requerimento</Text>
                  <Text variant="label" style={{ marginTop: 2 }}>{item.requerimento?.nome}</Text>
                  <Text variant="caption" style={{ marginTop: 4 }}>
                    Status: <Text variant="caption" style={{ color: cor, fontWeight: '700' }}>{item.status.nome}</Text>
                  </Text>
                </View>
                {item.respostaVisualizada === false && <View style={[styles.dot, { backgroundColor: colors.error }]} />}
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, padding: 14, marginBottom: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, marginLeft: 8 },
});
