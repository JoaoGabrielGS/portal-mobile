import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Controller } from 'react-hook-form';
import { useTheme } from '@/hooks/use-theme';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCriarAtendimento } from '@/hooks/atendimento/use-criar-atendimento';

export default function FaleFatecieNovoScreen() {
  const { colors, spacing } = useTheme();
  const { form, onSubmit, isPending, temas, assuntos } = useCriarAtendimento();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { borderBottomColor: colors.border, paddingHorizontal: spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text variant="subtitle" style={{ color: colors.text, marginLeft: spacing.md }}>
          Novo Atendimento
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Text variant="label" style={{ marginBottom: spacing.sm }}>Tema</Text>
        <Controller
          control={control}
          name="temaId"
          render={({ field }) => (
            <View style={[styles.selectBox, { borderColor: colors.border, maxHeight: 180 }]}>
              <ScrollView nestedScrollEnabled showsVerticalScrollIndicator>
                {temas.map((tema) => {
                  const ativo = field.value === String(tema.id);
                  return (
                    <TouchableOpacity
                      key={tema.id}
                      onPress={() => {
                        field.onChange(String(tema.id));
                        form.setValue('assuntoId', '');
                      }}
                      style={[styles.selectOption, { borderBottomColor: colors.border, backgroundColor: ativo ? colors.surface : undefined }]}
                    >
                      <Text variant="body" style={{ color: ativo ? colors.primary : colors.text }}>{tema.nome}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}
        />
        {errors.temaId && <Text variant="error" style={{ marginTop: spacing.xs }}>{errors.temaId.message}</Text>}

        <Text variant="label" style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>Assunto</Text>
        <Controller
          control={control}
          name="assuntoId"
          render={({ field }) => (
            <View style={[styles.selectBox, { borderColor: colors.border }]}>
              {assuntos.length === 0 ? (
                <Text variant="caption" style={{ color: colors.textSecondary, padding: spacing.sm }}>
                  Selecione um tema primeiro
                </Text>
              ) : (
                assuntos.map((assunto) => {
                  const ativo = field.value === String(assunto.id);
                  return (
                    <TouchableOpacity
                      key={assunto.id}
                      onPress={() => field.onChange(String(assunto.id))}
                      style={[styles.selectOption, { borderBottomColor: colors.border, backgroundColor: ativo ? colors.surface : undefined }]}
                    >
                      <Text variant="body" style={{ color: ativo ? colors.primary : colors.text }}>{assunto.nome}</Text>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          )}
        />
        {errors.assuntoId && <Text variant="error" style={{ marginTop: spacing.xs }}>{errors.assuntoId.message}</Text>}

        <Controller
          control={control}
          name="mensagem"
          render={({ field }) => (
            <Input
              label="Sua mensagem"
              placeholder="Descreva o que você precisa..."
              value={field.value}
              onChangeText={field.onChange}
              multiline
              numberOfLines={4}
              error={errors.mensagem?.message}
              containerStyle={{ marginTop: spacing.lg }}
              inputStyle={{ minHeight: 100, textAlignVertical: 'top' }}
            />
          )}
        />

        <Button
          label={isPending ? 'ENVIANDO...' : 'ENVIAR SOLICITAÇÃO'}
          onPress={handleSubmit(onSubmit)}
          isLoading={isPending}
          style={{ marginTop: spacing.xl }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  selectBox: { borderWidth: 1, borderRadius: 8, overflow: 'hidden' },
  selectOption: { padding: 12, borderBottomWidth: 1 },
});
