import { ActivityIndicator, Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { Text } from '@/components/ui/text';
import { useRequerimentoDetalhe } from '@/hooks/requerimento/use-requerimento-detalhe';
import { getRequerimentoStatusColor, STATUS_DEVOLUTIVA, STATUS_INDEFERIDO } from '@/utils/requerimento-status';
import { formatDate } from '@/utils/format';

export default function RequerimentoDetalheScreen() {
  const { colors, spacing } = useTheme();
  const { data, devolutiva, isLoading } = useRequerimentoDetalhe();

  const anexos =
    data?.etapas
      .filter((etapa) => etapa.etapa !== 0)
      .flatMap((etapa) => etapa.etapaAnexos.flatMap((anexo) => anexo.arquivoLinks)) ?? [];

  const justificativa =
    data?.status.id === STATUS_DEVOLUTIVA
      ? devolutiva?.mensagem
      : data?.status.id === STATUS_INDEFERIDO
        ? data?.resposta
        : '-';

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

      {isLoading || !data ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
          <Text variant="title" style={{ color: colors.primary, fontSize: 22 }}>
            {data.requerimento.nome}
          </Text>

          <Text variant="label" style={{ marginTop: spacing.lg }}>Status</Text>
          <Text variant="body" style={{ color: getRequerimentoStatusColor(data.status.id), fontWeight: '700' }}>
            {data.status.nome}
          </Text>

          <Text variant="label" style={{ marginTop: spacing.md }}>Justificativa</Text>
          <Text variant="body" style={{ marginTop: 4 }}>{justificativa}</Text>

          <Text variant="subtitle" style={{ color: colors.primary, marginTop: spacing.xl }}>
            Dados da Solicitação
          </Text>

          <Text variant="label" style={{ marginTop: spacing.md }}>Data da Solicitação</Text>
          <Text variant="body" style={{ marginTop: 4 }}>{formatDate(data.dataAbertura)}</Text>

          <Text variant="label" style={{ marginTop: spacing.md }}>Prazo de Análise</Text>
          <Text variant="body" style={{ marginTop: 4 }}>{data.slaSolicitacao} dias úteis</Text>

          <Text variant="label" style={{ marginTop: spacing.md }}>Documento Anexado</Text>
          {anexos.length === 0 ? (
            <Text variant="body" style={{ marginTop: 4, color: colors.textSecondary }}>Nenhum documento</Text>
          ) : (
            anexos.map((anexo) => (
              <Text
                key={anexo.id}
                variant="body"
                style={{ marginTop: 4, color: colors.primary, textDecorationLine: 'underline' }}
                onPress={() => Linking.openURL(anexo.etapaAnexoLink)}
              >
                {anexo.nome}
              </Text>
            ))
          )}

          <Text variant="label" style={{ marginTop: spacing.xl }}>Descrição do Requerimento</Text>
          <Text variant="body" style={{ marginTop: 4 }}>{data.requerimento.descricao}</Text>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
