import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { Text } from '@/components/ui/text';
import { HistoricoItem } from '@/services/historico';
import { useHistorico, HISTORICO_STATUS_COLOR as STATUS_COLOR } from '@/hooks/historico/use-historico';

export default function HistoricoScreen() {
  const { colors, spacing } = useTheme();
  const { itens, isLoading, isFetchingNextPage, handleLoadMore, cursoSelecionado } = useHistorico();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { borderBottomColor: colors.border, paddingHorizontal: spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text variant="subtitle" style={{ color: colors.text, marginLeft: spacing.md }}>
          Histórico
        </Text>
      </View>

      <View style={[styles.cursoCard, { backgroundColor: colors.surface, padding: spacing.md }]}>
        <Text variant="label" style={{ color: colors.primary, marginBottom: 4 }}>
          Dados do Curso
        </Text>
        <Text variant="caption" style={{ color: colors.textSecondary }}>
          Curso: <Text variant="caption" style={{ color: colors.text }}>{cursoSelecionado?.CursoNome}</Text>
        </Text>
        <Text variant="caption" style={{ color: colors.textSecondary, marginTop: 2 }}>
          RA: <Text variant="caption" style={{ color: colors.text }}>{cursoSelecionado?.ra ?? cursoSelecionado?.Ra}</Text>
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={itens}
          keyExtractor={(item, i) => `${item.id ?? item.disciplina?.codigo}-${i}`}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListHeaderComponent={
            <View style={[styles.tableHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
              <Text variant="caption" style={{ ...styles.colDisciplina, color: colors.textSecondary, fontWeight: '600' }}>
                Disciplina
              </Text>
              <Text variant="caption" style={{ ...styles.colSmall, color: colors.textSecondary, fontWeight: '600' }}>
                Série
              </Text>
              <Text variant="caption" style={{ ...styles.colSmall, color: colors.textSecondary, fontWeight: '600' }}>
                Nota
              </Text>
              <Text variant="caption" style={{ ...styles.colSmall, color: colors.textSecondary, fontWeight: '600' }}>
                Status
              </Text>
            </View>
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={{ paddingVertical: spacing.md }}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <Text variant="body" style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 40 }}>
              Nenhum histórico encontrado
            </Text>
          }
          renderItem={({ item }: { item: HistoricoItem }) => (
            <View style={[styles.row, { borderBottomColor: colors.border }]}>
              <Text variant="caption" style={{ ...styles.colDisciplina, color: colors.text }} numberOfLines={2}>
                {item.disciplina?.nome}
              </Text>
              <Text variant="caption" style={{ ...styles.colSmall, color: colors.textSecondary }}>
                {item.serie}
              </Text>
              <Text variant="caption" style={{ ...styles.colSmall, color: colors.textSecondary }}>
                {item.nota}
              </Text>
              <Text
                variant="caption"
                style={{
                  ...styles.colSmall,
                  color: STATUS_COLOR[item.status?.nome] ?? colors.textSecondary,
                  fontWeight: '600',
                }}
              >
                {item.status?.nome}
              </Text>
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
  cursoCard: { borderBottomWidth: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tableHeader: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1 },
  row: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  colDisciplina: { flex: 2 },
  colSmall: { flex: 1, textAlign: 'center' },
});
