import { ActivityIndicator, FlatList, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { Text } from '@/components/ui/text';
import { useDisciplinas } from '@/hooks/academico/use-disciplinas';

export default function DisciplinasScreen() {
  const { colors, spacing } = useTheme();
  const { disciplinas, isFetching, isRedirecting, handleDisciplinaPress } = useDisciplinas();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { borderBottomColor: colors.border, paddingHorizontal: spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text variant="subtitle" style={{ color: colors.text, marginLeft: spacing.md }}>
          Minhas Disciplinas
        </Text>
      </View>

      {isFetching ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={disciplinas}
          keyExtractor={(item, i) => `${item.id ?? i}`}
          contentContainerStyle={{ padding: spacing.md }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text variant="body" style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 40 }}>
              Você não possui nenhuma disciplina
            </Text>
          }
          renderItem={({ item, index }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleDisciplinaPress(item)}
              style={[
                styles.item,
                { borderBottomColor: colors.border, borderBottomWidth: index < disciplinas.length - 1 ? 1 : 0 },
              ]}
            >
              <Text variant="label" style={{ color: colors.primary, flex: 1, textTransform: 'capitalize' }}>
                {(item.disciplinaMoodle?.disciplina?.nome ?? item.nome ?? '').toLowerCase()}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        />
      )}

      <Modal visible={isRedirecting} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.surface }]}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text variant="caption" style={{ marginTop: spacing.sm, color: colors.textSecondary }}>
              Redirecionando para o Moodle...
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  modalOverlay: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalBox: { borderRadius: 12, padding: 24, alignItems: 'center' },
});
