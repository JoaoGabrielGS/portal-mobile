import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useIndicacao } from '@/hooks/perfil/use-indicacao';

export default function IndicacaoScreen() {
  const { colors, spacing } = useTheme();
  const { onShare, handleMinhasIndicacoes } = useIndicacao();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { borderBottomColor: colors.border, paddingHorizontal: spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text variant="subtitle" style={{ color: colors.text, marginLeft: spacing.md }}>
          Indicação Premiada
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <View style={[styles.banner, { backgroundColor: colors.primary }]}>
          <Ionicons name="gift-outline" size={48} color={colors.textInverse} />
        </View>

        <Text variant="subtitle" style={{ marginTop: spacing.lg }}>Como Funciona?</Text>
        <Text variant="body" style={{ color: colors.textSecondary, marginTop: spacing.sm }}>
          Indique um amigo para iniciar uma Graduação EAD com a UniFatecie. Se ele se matricular, você ganha benefícios exclusivos.
        </Text>

        <Button label="Indique para os amigos" onPress={onShare} style={{ marginTop: spacing.xxl }} />
        <Button label="Confira suas indicações" variant="outline" onPress={handleMinhasIndicacoes} style={{ marginTop: spacing.sm }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  banner: { height: 150, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
