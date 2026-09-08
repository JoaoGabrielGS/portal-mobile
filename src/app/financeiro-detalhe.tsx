import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Mensalidade } from '@/services/financeiro';
import { ATRASO_STATUS_ID, PAID_STATUS_IDS, getStatusColor, podeFinalizarPagamento } from '@/utils/financeiro-status';
import { formatBRL, formatDate, formatMonthLabel } from '@/utils/format';

export default function FinanceiroDetalheScreen() {
  const { colors, spacing } = useTheme();
  const { charge: chargeJson } = useLocalSearchParams<{ charge: string }>();
  const charge: Mensalidade = JSON.parse(chargeJson);

  const cor = getStatusColor(charge.status.id);
  const valor = charge.status.id === ATRASO_STATUS_ID ? charge.valorOriginal : charge.valorAteVencimento;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { borderBottomColor: colors.border, paddingHorizontal: spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text variant="subtitle" style={{ color: colors.text, marginLeft: spacing.md }}>
          {formatMonthLabel(charge.competencia)}
        </Text>
      </View>

      <View style={{ padding: spacing.lg }}>
        <View style={[styles.statusBadge, { backgroundColor: colors.surface }]}>
          <Text variant="label" style={{ color: cor, fontWeight: '700' }}>
            {charge.status.nome}
          </Text>
        </View>

        <View style={[styles.row, { marginTop: spacing.lg }]}>
          <View>
            <Text variant="caption" style={{ color: colors.textSecondary }}>Mensalidade</Text>
            <Text variant="body">{formatMonthLabel(charge.competencia)}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text variant="caption" style={{ color: colors.textSecondary }}>Vencimento</Text>
            <Text variant="body">{formatDate(charge.dataVencimento)}</Text>
          </View>
        </View>

        <View style={[styles.valorBox, { borderColor: colors.border, marginTop: spacing.lg }]}>
          <Text variant="caption" style={{ color: colors.textSecondary }}>Valor</Text>
          <Text variant="title" style={{ color: colors.primary }}>{formatBRL(valor)}</Text>
        </View>

        {PAID_STATUS_IDS.includes(charge.status.id) && charge.dataPagamento ? (
          <Text variant="caption" style={{ color: '#388E3C', marginTop: spacing.md }}>
            Pago em: {formatDate(charge.dataPagamento)}
          </Text>
        ) : (
          <Text variant="caption" style={{ color: colors.textSecondary, marginTop: spacing.md }}>
            Pago em: --
          </Text>
        )}

        {podeFinalizarPagamento(charge.status.id) && (
          <Button
            label="IR PARA O PAGAMENTO"
            style={{ marginTop: spacing.xl }}
            onPress={() =>
              router.push({ pathname: '/financeiro-pagamento', params: { charge: chargeJson } })
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  valorBox: { borderWidth: 1, borderRadius: 10, padding: 16, alignItems: 'center' },
});
