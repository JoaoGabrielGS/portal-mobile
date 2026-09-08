import { ActivityIndicator, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useFinanceiroPix } from '@/hooks/financeiro/use-financeiro-pix';
import { ATRASO_STATUS_ID } from '@/utils/financeiro-status';
import { formatBRL } from '@/utils/format';

export default function FinanceiroPixScreen() {
  const { colors, spacing } = useTheme();
  const { charge, isLoading, timeLeft, formatTime, pixCode, pixQrCodeUri, onCopiar, voltarParaLista } =
    useFinanceiroPix();

  const valor = charge.status.id === ATRASO_STATUS_ID ? charge.valorOriginal : charge.valorAteVencimento;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { borderBottomColor: colors.border, paddingHorizontal: spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text variant="subtitle" style={{ color: colors.text, marginLeft: spacing.md }}>
          Pagamento via PIX
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 32 }}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text variant="body" style={{ color: colors.text }}>Valor Total</Text>
          <Text variant="title" style={{ color: colors.primary }}>{formatBRL(valor)}</Text>
        </View>

        <View style={{ height: spacing.lg }} />

        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text variant="caption" style={{ color: colors.textSecondary, marginTop: spacing.sm }}>
              Gerando QR Code...
            </Text>
          </View>
        ) : pixCode ? (
          <>
            {!!pixQrCodeUri && (
              <View style={styles.qrContainer}>
                <Image source={{ uri: pixQrCodeUri }} style={styles.qrImage} resizeMode="contain" />
              </View>
            )}

            <View style={[styles.timerRow, { marginTop: spacing.md }]}>
              <Ionicons name="time-outline" size={16} color={timeLeft < 60 ? colors.error : colors.textSecondary} />
              <Text
                variant="caption"
                style={{ color: timeLeft < 60 ? colors.error : colors.textSecondary, marginLeft: 6 }}
              >
                Expira em {formatTime(timeLeft)}
              </Text>
            </View>

            <View style={[styles.codeBox, { backgroundColor: colors.surface, borderColor: colors.border, marginTop: spacing.md }]}>
              <Text variant="caption" style={{ color: colors.textSecondary }} numberOfLines={3} selectable>
                {pixCode}
              </Text>
            </View>

            <View style={{ height: spacing.md }} />
            <Button label="Copiar código Pix" onPress={onCopiar} />
            <Button label="Voltar para mensalidades" variant="outline" onPress={voltarParaLista} style={{ marginTop: spacing.sm }} />
          </>
        ) : (
          <View style={styles.center}>
            <Ionicons name="alert-circle-outline" size={40} color={colors.textSecondary} />
            <Text variant="body" style={{ color: colors.textSecondary, marginTop: spacing.sm, textAlign: 'center' }}>
              Não foi possível gerar o PIX.{'\n'}Tente novamente.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  card: { borderRadius: 10, padding: 16 },
  center: { alignItems: 'center', paddingVertical: 32 },
  qrContainer: { alignItems: 'center' },
  qrImage: { width: 220, height: 220 },
  timerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  codeBox: { borderWidth: 1, borderRadius: 8, padding: 12 },
});
