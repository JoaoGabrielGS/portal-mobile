import { Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHome } from '@/hooks/home/use-home';
import { useTheme } from '@/hooks/use-theme';
import { Header } from '@/components/home/header';
import { SectionBanners } from '@/components/home/section-banners';
import { SectionDisciplinas } from '@/components/home/section-disciplinas';
import { SectionFaleFatecie } from '@/components/home/section-fale-fatecie';
import { Text } from '@/components/ui/text';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { colors, spacing } = useTheme();
  const { banners, disciplinas, atendimentos, abrirDisciplinaNoMoodle } = useHome();

  const handlePressDisciplina = async (item: any) => {
    const link = await abrirDisciplinaNoMoodle(
      item?.disciplinaMoodle?.courseMoodleId ?? item?.disciplinaMoodleId,
    );
    if (link) Linking.openURL(link);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.primary }]} edges={['top']}>
      <Header />

      <ScrollView
        style={[styles.scroll, { backgroundColor: colors.background }]}
        contentContainerStyle={{ padding: spacing.md, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <SectionBanners data={banners.data ?? []} />

        <View style={{ height: spacing.lg }} />
        <TouchableOpacity
          onPress={() => router.push('/voce-fatecie')}
          style={[styles.fiqueAtento, { backgroundColor: colors.card }]}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-circle-outline" size={28} color={colors.primary} />
          <View style={{ flex: 1, marginLeft: spacing.sm }}>
            <Text variant="label">Fique Atento</Text>
            <Text variant="caption" style={{ color: colors.textSecondary }}>Veja o que é novo pra você</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <View style={{ height: spacing.lg }} />
        <SectionDisciplinas
          disciplinas={disciplinas.data ?? []}
          onPressDisciplina={handlePressDisciplina}
          onVerTodas={() => router.push('/disciplinas')}
        />

        <View style={{ height: spacing.lg }} />
        <SectionFaleFatecie
          atendimentos={atendimentos.data?.content ?? []}
          onVerTodos={() => router.push('/fale-fatecie')}
          onNovoAtendimento={() => router.push('/fale-fatecie-novo')}
          onPressAtendimento={(id) => router.push({ pathname: '/fale-fatecie-chat', params: { id: String(id) } })}
        />

        <View style={{ height: spacing.lg }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  fiqueAtento: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, padding: 12 },
});
