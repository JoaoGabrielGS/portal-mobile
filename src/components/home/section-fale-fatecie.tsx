import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Text } from '@/components/ui/text';
import { SectionTitle } from './section-title';
import { Atendimento } from '@/services/atendimento';
import { ATENDIMENTO_STATUS_STYLE } from '@/utils/atendimento-status';

type Props = {
  atendimentos: Atendimento[];
  onVerTodos: () => void;
  onNovoAtendimento: () => void;
  onPressAtendimento: (id: number) => void;
};

export function SectionFaleFatecie({ atendimentos, onVerTodos, onNovoAtendimento, onPressAtendimento }: Props) {
  const { colors, spacing } = useTheme();

  return (
    <View>
      <SectionTitle title="Fale com a UniFatecie" iconName="chatbubbles-outline" iconColor="#07A8FF" onPress={onVerTodos} />
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={onNovoAtendimento} style={[styles.novoBtn, { borderColor: colors.primary }]}>
          <Text variant="caption" style={{ color: colors.primary, fontWeight: '700' }}>+ Novo atendimento</Text>
        </TouchableOpacity>

        {atendimentos.length === 0 ? (
          <Text variant="caption" style={{ color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm }}>
            Nenhum atendimento por aqui ainda.
          </Text>
        ) : (
          atendimentos.map((item) => {
            const statusStyle = ATENDIMENTO_STATUS_STYLE[item.status?.id];
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => onPressAtendimento(item.id)}
                style={[styles.item, { borderTopColor: colors.border }]}
              >
                <View style={{ flex: 1 }}>
                  <Text variant="label" numberOfLines={1}>{item.assunto?.nome}</Text>
                  <Text variant="caption" style={{ color: colors.textSecondary }} numberOfLines={1}>
                    {item.assunto?.tema?.nome}
                  </Text>
                </View>
                {statusStyle && (
                  <Text variant="caption" style={{ color: statusStyle.text, fontWeight: '700' }}>{statusStyle.label}</Text>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 8, padding: 12 },
  novoBtn: { borderWidth: 1, borderRadius: 20, paddingVertical: 8, alignItems: 'center' },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, marginTop: 8 },
});
