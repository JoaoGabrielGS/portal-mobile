import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Controller } from 'react-hook-form';
import MaskInput, { Masks } from 'react-native-mask-input';
import { useTheme } from '@/hooks/use-theme';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFinanceiroCartao } from '@/hooks/financeiro/use-financeiro-cartao';
import { ATRASO_STATUS_ID } from '@/utils/financeiro-status';
import { formatBRL } from '@/utils/format';

export default function FinanceiroCartaoScreen() {
  const { colors, spacing } = useTheme();
  const { charge, form, onSubmit, isPending, meiosPagamento } = useFinanceiroCartao();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const valor = charge.status.id === ATRASO_STATUS_ID ? charge.valorOriginal : charge.valorAteVencimento;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { borderBottomColor: colors.border, paddingHorizontal: spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text variant="subtitle" style={{ color: colors.text, marginLeft: spacing.md }}>
          Cartão de Crédito
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 32 }}>
        <Text variant="caption" style={{ color: colors.textSecondary }}>Valor Total</Text>
        <Text variant="title" style={{ color: colors.primary, marginBottom: spacing.lg }}>{formatBRL(valor)}</Text>

        <Controller
          control={control}
          name="number"
          render={({ field }) => (
            <View style={{ marginBottom: spacing.md }}>
              <Text variant="label" style={{ marginBottom: spacing.xs }}>Número do Cartão</Text>
              <MaskInput
                value={field.value}
                onChangeText={(masked) => field.onChange(masked)}
                mask={Masks.CREDIT_CARD}
                keyboardType="numeric"
                placeholder="---- ---- ---- ----"
                placeholderTextColor={colors.textSecondary}
                style={[styles.input, { borderColor: errors.number ? colors.error : colors.border, color: colors.text, backgroundColor: colors.surface }]}
              />
              {errors.number && (
                <Text variant="error" style={{ marginTop: spacing.xs }}>{errors.number.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="holderName"
          render={({ field }) => (
            <Input
              label="Nome do Cartão"
              placeholder="Insira o nome como está no cartão"
              value={field.value}
              onChangeText={field.onChange}
              autoCapitalize="characters"
              error={errors.holderName?.message}
              containerStyle={{ marginBottom: spacing.md }}
            />
          )}
        />

        {charge.isWaeCobranca && (
          <View style={{ marginBottom: spacing.md }}>
            <Text variant="label" style={{ marginBottom: spacing.xs }}>Tipo de Pagamento</Text>
            <Controller
              control={control}
              name="meioPagamento"
              render={({ field }) => (
                <View style={[styles.selectBox, { borderColor: colors.border }]}>
                  {meiosPagamento.map((opcao) => {
                    const ativo = field.value === opcao.MeioPagamento;
                    return (
                      <TouchableOpacity
                        key={opcao.MeioPagamento}
                        onPress={() => field.onChange(opcao.MeioPagamento)}
                        style={[
                          styles.selectOption,
                          { borderBottomColor: colors.border, backgroundColor: ativo ? colors.surface : undefined },
                        ]}
                      >
                        <Text variant="body" style={{ color: ativo ? colors.primary : colors.text }}>
                          {opcao.MeioPagamentoDescricao}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            />
            {errors.meioPagamento && (
              <Text variant="error" style={{ marginTop: spacing.xs }}>{errors.meioPagamento.message as string}</Text>
            )}
          </View>
        )}

        <View style={styles.row}>
          <Controller
            control={control}
            name="dueAt"
            render={({ field }) => (
              <View style={{ flex: 1, marginRight: spacing.sm }}>
                <Text variant="label" style={{ marginBottom: spacing.xs }}>Validade</Text>
                <MaskInput
                  value={field.value}
                  onChangeText={(_masked, unmasked) => field.onChange(unmasked)}
                  mask={[/\d/, /\d/, '/', /\d/, /\d/]}
                  keyboardType="numeric"
                  placeholder="MM/AA"
                  placeholderTextColor={colors.textSecondary}
                  style={[styles.input, { borderColor: errors.dueAt ? colors.error : colors.border, color: colors.text, backgroundColor: colors.surface }]}
                />
                {errors.dueAt && (
                  <Text variant="error" style={{ marginTop: spacing.xs }}>{errors.dueAt.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="cvv"
            render={({ field }) => (
              <Input
                label="CVV"
                placeholder="---"
                value={field.value}
                onChangeText={field.onChange}
                keyboardType="numeric"
                maxLength={3}
                error={errors.cvv?.message}
                containerStyle={{ flex: 1 }}
              />
            )}
          />
        </View>

        <Button
          label={isPending ? 'CARREGANDO...' : 'CONFIRMAR PAGAMENTO'}
          onPress={handleSubmit(onSubmit)}
          isLoading={isPending}
          style={{ marginTop: spacing.xl }}
        />
        <Button label="CANCELAR" variant="outline" onPress={() => router.back()} style={{ marginTop: spacing.sm }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 15 },
  row: { flexDirection: 'row' },
  selectBox: { borderWidth: 1, borderRadius: 8, overflow: 'hidden' },
  selectOption: { padding: 12, borderBottomWidth: 1 },
});
