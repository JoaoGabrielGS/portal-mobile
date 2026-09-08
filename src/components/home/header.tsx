import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/use-theme';
import { useUserStore } from '@/store/user.store';
import { getCountNotificacoes } from '@/services/notificacoes';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export function Header() {
  const { colors, spacing } = useTheme();
  const { pessoa, cursoSelecionado } = useUserStore();

  const primeiroNome = (pessoa?.nome ?? pessoa?.Nome ?? '').split(' ')[0] ?? '';
  const nomeCurso = cursoSelecionado?.CursoNome ?? cursoSelecionado?.curriculo?.curso?.descricao ?? '';

  const alunoId = cursoSelecionado?.matriculaId ?? cursoSelecionado?.id;
  const { data: naoLidas } = useQuery({
    queryKey: ['header.notificacoesCount', alunoId],
    queryFn: () => getCountNotificacoes(alunoId),
    enabled: !!alunoId,
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.primary, padding: spacing.lg }]}>
      <View style={styles.row}>
        <View style={styles.textContainer}>
          <Text variant="subtitle" style={{ color: colors.textInverse, fontSize: 22 }} numberOfLines={1}>
            Olá, {primeiroNome}
          </Text>
          {!!nomeCurso && (
            <Text
              variant="label"
              style={{ color: colors.textInverse, opacity: 0.75, fontSize: 13, marginTop: 2 }}
              numberOfLines={1}
            >
              {nomeCurso}
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={() => router.push('/notificacoes')}
          style={[styles.iconButton, { backgroundColor: 'rgba(255,255,255,0.15)' }]}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={24} color={colors.textInverse} />
          {!!naoLidas && naoLidas > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.error }]}>
              <Text variant="caption" style={{ color: colors.textInverse, fontSize: 10, fontWeight: '700' }}>
                {naoLidas > 9 ? '9+' : naoLidas}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  textContainer: { flex: 1, marginRight: 12 },
  iconButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
});
