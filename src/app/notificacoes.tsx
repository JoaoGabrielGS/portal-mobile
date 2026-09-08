import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useTheme } from '@/hooks/use-theme';
import { Text } from '@/components/ui/text';
import { useNotificacoes, TipoNotificacaoEnum } from '@/hooks/notificacoes/use-notificacoes';
import { Notificacao } from '@/services/notificacoes';

const ICONS: Record<number, keyof typeof Ionicons.glyphMap> = {
  [TipoNotificacaoEnum.AVISO]: 'megaphone-outline',
  [TipoNotificacaoEnum.SOLICITACAO]: 'document-text-outline',
  [TipoNotificacaoEnum.ATENDIMENTO]: 'chatbubbles-outline',
};

export default function NotificacoesScreen() {
  const { colors, spacing } = useTheme();
  const { itens, isLoading, isFetchingNextPage, handleLoadMore, handlePressNotificacao } = useNotificacoes();

  const tituloDe = (item: Notificacao) => {
    if (item.tipoNotificacao.id === TipoNotificacaoEnum.SOLICITACAO) return item.solicitacao?.requerimento?.nome ?? '';
    if (item.tipoNotificacao.id === TipoNotificacaoEnum.ATENDIMENTO) return 'Fale com a UniFatecie';
    return item.aviso?.titulo ?? '';
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { borderBottomColor: colors.border, paddingHorizontal: spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text variant="subtitle" style={{ color: colors.text, marginLeft: spacing.md }}>
          Suas Notificações
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={itens}
          keyExtractor={(item, i) => `${item.id}-${i}`}
          contentContainerStyle={{ padding: spacing.md }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={colors.primary} style={{ marginTop: 16 }} /> : null}
          ListEmptyComponent={
            <Text variant="body" style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 40 }}>
              Nenhuma notificação encontrada
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handlePressNotificacao(item)}
              style={[styles.card, { backgroundColor: colors.card }]}
              activeOpacity={0.7}
            >
              <Ionicons name={ICONS[item.tipoNotificacao.id] ?? 'notifications-outline'} size={26} color={colors.primary} />
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <View style={styles.row}>
                  <Text variant="label" numberOfLines={1} style={{ flex: 1 }}>{tituloDe(item)}</Text>
                  {!item.visualizada && <View style={[styles.dot, { backgroundColor: colors.error }]} />}
                </View>
                <Text variant="caption" style={{ color: colors.textSecondary, marginTop: 4 }}>
                  {format(new Date(item.criacao), 'dd/MM/yyyy HH:mm')}
                </Text>
              </View>
            </TouchableOpacity>
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
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, padding: 14, marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, marginLeft: 8 },
});
