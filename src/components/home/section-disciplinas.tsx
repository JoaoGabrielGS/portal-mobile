import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { Text } from '@/components/ui/text';
import { SectionTitle } from './section-title';
import { Disciplina } from '@/services/moodle';

type Props = {
  disciplinas: Disciplina[];
  onPressDisciplina?: (item: Disciplina) => void;
  onVerTodas?: () => void;
};

export function SectionDisciplinas({ disciplinas, onPressDisciplina, onVerTodas }: Props) {
  const { colors } = useTheme();
  const lista = disciplinas.slice(0, 4);

  return (
    <View>
      <SectionTitle title="Minhas Disciplinas" iconName="book-outline" onPress={onVerTodas} />
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        {lista.length === 0 && (
          <Text variant="caption" style={{ color: colors.textSecondary, textAlign: 'center', padding: 8 }}>
            Nenhuma disciplina encontrada
          </Text>
        )}
        {lista.map((item, i) => (
          <TouchableOpacity
            key={item.id?.toString() ?? i}
            activeOpacity={0.7}
            onPress={() => onPressDisciplina?.(item)}
            style={[
              styles.item,
              { borderBottomColor: colors.border, borderBottomWidth: i < lista.length - 1 ? 1 : 0 },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text variant="label" style={{ color: colors.text, textTransform: 'capitalize' }}>
                {(item.disciplinaMoodle?.disciplina?.nome ?? item.nome ?? '').toLowerCase()}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 8, overflow: 'hidden' },
  item: { flexDirection: 'row', alignItems: 'center', padding: 12 },
});
