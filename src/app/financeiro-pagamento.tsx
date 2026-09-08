import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { usePagamento } from '@/hooks/financeiro/use-pagamento';
import { ATRASO_STATUS_ID } from '@/utils/financeiro-status';
import { formatBRL, formatMonthLabel } from '@/utils/format';

const OPCOES = [
  { id: 'pix' as const, label: 'PIX', icon: 'qr-code-outline' as const },
  { id: 'cartao' as const, label: 'Cartão de Crédito', icon: 'card-outline' as const },
];

export default function FinanceiroPagamentoScreen() {
  const { colors, spacing } = useTheme();
  const { charge, metodo, setMetodo, onAvancar, isPending } = usePagamento();

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
        <View style={{ alignItems: 'center' }}>
          <Text variant="caption" style={{ color: colors.textSecondary }}>Valor Total</Text>
          <Text variant="title" style={{ color: colors.primary, marginTop: 4 }}>{formatBRL(valor)}</Text>
        </View>

        <Text variant="label" style={{ marginTop: spacing.xl, marginBottom: spacing.sm }}>
          Selecione o método de pagamento
        </Text>

        {OPCOES.map((opcao) => {
          const ativo = metodo === opcao.id;
          return (
            <TouchableOpacity
              key={opcao.id}
              onPress={() => setMetodo(opcao.id)}
              style={[
                styles.opcao,
                {
                  borderColor: ativo ? colors.primary : colors.border,
                  backgroundColor: ativo ? colors.surface : colors.background,
                  marginBottom: spacing.sm,
                },
              ]}
              activeOpacity={0.7}
            >
              <Ionicons name={opcao.icon} size={20} color={ativo ? colors.primary : colors.textSecondary} />
              <Text
                variant="body"
                style={{ marginLeft: spacing.sm, color: ativo ? colors.primary : colors.text, fontWeight: ativo ? '700' : '400' }}
              >
                {opcao.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        <Button
          label={isPending ? 'CARREGANDO...' : 'AVANÇAR'}
          onPress={onAvancar}
          disabled={!metodo || isPending}
          isLoading={isPending}
          style={{ marginTop: spacing.xl }}
        />
        <Button
          label="CANCELAR"
          variant="outline"
          onPress={() => router.back()}
          style={{ marginTop: spacing.sm }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  opcao: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 10, borderWidth: 1 },
});
