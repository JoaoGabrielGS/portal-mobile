import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { Text } from '@/components/ui/text';
import { useMensalidades } from '@/hooks/financeiro/use-mensalidades';
import { Mensalidade } from '@/services/financeiro';
import { ATRASO_STATUS_ID, getStatusColor } from '@/utils/financeiro-status';
import { formatBRL, formatDate, formatMonthLabel } from '@/utils/format';

export default function FinanceiroScreen() {
  const { colors, spacing } = useTheme();
  const { isLoading, naoPagas, pagas, cursoSelecionado } = useMensalidades();

  const abrirDetalhe = (item: Mensalidade) => {
    router.push({ pathname: '/financeiro-detalhe', params: { charge: JSON.stringify(item) } });
  };

  const renderItem = (item: Mensalidade) => {
    const cor = getStatusColor(item.status.id);
    const valor = item.status.id === ATRASO_STATUS_ID ? item.valorOriginal : item.valorAteVencimento;

    return (
      <TouchableOpacity
        key={item.financeiroId}
        activeOpacity={0.7}
        onPress={() => abrirDetalhe(item)}
        style={[styles.card, { backgroundColor: colors.card, borderLeftColor: cor }]}
      >
        <View style={styles.row}>
          <Text variant="label" style={{ color: colors.text }}>
            {formatMonthLabel(item.competencia)}
          </Text>
          <Text variant="subtitle" style={{ color: colors.primary, fontWeight: '700' }}>
            {formatBRL(valor)}
          </Text>
        </View>
        <View style={[styles.row, { marginTop: 6 }]}>
          <Text variant="caption" style={{ color: colors.textSecondary }}>
            Venc. {formatDate(item.dataVencimento)}
          </Text>
          <Text variant="caption" style={{ color: cor, fontWeight: '700' }}>
            {item.status.nome}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={{ padding: spacing.lg }}>
        <Text variant="title">Financeiro</Text>
        <Text variant="caption" style={{ color: colors.textSecondary, marginTop: 4 }}>
          {cursoSelecionado?.CursoNome}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : naoPagas.length === 0 && pagas.length === 0 ? (
        <View style={styles.center}>
          <Text variant="body" style={{ color: colors.textSecondary }}>
            Nenhuma mensalidade encontrada
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: 0 }} showsVerticalScrollIndicator={false}>
          {naoPagas.length > 0 && (
            <>
              <Text variant="label" style={{ color: colors.primary, marginBottom: spacing.sm }}>
                Em Aberto
              </Text>
              {naoPagas.map(renderItem)}
            </>
          )}

          {pagas.length > 0 && (
            <>
              <Text variant="label" style={{ color: colors.primary, marginTop: spacing.lg, marginBottom: spacing.sm }}>
                Pagas
              </Text>
              {pagas.map(renderItem)}
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { borderRadius: 10, padding: 14, marginBottom: 10, borderLeftWidth: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
