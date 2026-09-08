import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useTheme } from '@/hooks/use-theme';
import { Text } from '@/components/ui/text';
import { useAtendimentos } from '@/hooks/atendimento/use-atendimentos';
import { Atendimento } from '@/services/atendimento';
import { ATENDIMENTO_STATUS_STYLE } from '@/utils/atendimento-status';

export default function FaleFatecieScreen() {
  const { colors, spacing } = useTheme();
  const { itens, isLoading, isFetchingNextPage, handleLoadMore, refreshing, handleRefresh, abrirChat, irParaNovoAtendimento } =
    useAtendimentos();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { borderBottomColor: colors.border, paddingHorizontal: spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text variant="subtitle" style={{ color: colors.text, marginLeft: spacing.md }}>
          Fale com a gente
        </Text>
      </View>

      <Text variant="caption" style={{ color: colors.textSecondary, padding: spacing.md, paddingBottom: 0 }}>
        Acompanhe o histórico de interações com a nossa equipe abaixo.
      </Text>

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
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />}
          ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={colors.primary} style={{ marginTop: 16 }} /> : null}
          ListEmptyComponent={
            <Text variant="body" style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 40 }}>
              Você ainda não abriu nenhum atendimento
            </Text>
          }
          renderItem={({ item }: { item: Atendimento }) => {
            const statusStyle = ATENDIMENTO_STATUS_STYLE[item.status?.id];
            return (
              <TouchableOpacity
                onPress={() => abrirChat(item.id)}
                style={[styles.card, { backgroundColor: colors.card }]}
                activeOpacity={0.7}
              >
                <View style={{ flex: 1 }}>
                  <Text variant="caption" style={{ color: colors.textSecondary }}>
                    Tema: {item.assunto?.tema?.nome}
                  </Text>
                  <Text variant="label" style={{ marginTop: 2 }}>{item.assunto?.nome}</Text>
                  <Text variant="caption" style={{ marginTop: 4, color: colors.textSecondary }}>
                    Protocolo: {item.protocolo} • {format(new Date(item.dataAbertura), 'dd/MM/yy')}
                  </Text>
                </View>
                {statusStyle && (
                  <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
                    <Text variant="caption" style={{ color: statusStyle.text, fontWeight: '700' }}>
                      {statusStyle.label}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
        />
      )}

      <TouchableOpacity
        onPress={irParaNovoAtendimento}
        style={[styles.fab, { backgroundColor: colors.primary }]}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={26} color={colors.textInverse} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', borderRadius: 10, padding: 14, marginBottom: 10 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginLeft: 8 },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 4 },
});
