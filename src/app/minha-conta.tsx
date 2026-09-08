import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Controller } from 'react-hook-form';
import { useTheme } from '@/hooks/use-theme';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMinhaConta } from '@/hooks/perfil/use-minha-conta';
import { formatPhone } from '@/utils/format';

export default function MinhaContaScreen() {
  const { colors, spacing } = useTheme();
  const {
    pessoa,
    cursoSelecionado,
    isEdit,
    setIsEdit,
    form,
    onSubmit,
    isPending,
    isUploading,
    handleSelecionarFoto,
    handleRemoverFoto,
  } = useMinhaConta();
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
        <Text variant="subtitle" style={{ color: colors.text, marginLeft: spacing.md, flex: 1 }}>
          Minha Conta
        </Text>
        {!isEdit && (
          <TouchableOpacity onPress={() => setIsEdit(true)}>
            <Ionicons name="create-outline" size={22} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 32 }}>
        <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TouchableOpacity onPress={handleSelecionarFoto} disabled={isUploading}>
            {pessoa?.avatarUrl ? (
              <Image source={{ uri: pessoa.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder, { backgroundColor: colors.card }]}>
                <Ionicons name="person" size={36} color={colors.textSecondary} />
              </View>
            )}
            <View style={[styles.cameraBadge, { backgroundColor: colors.primary }]}>
              <Ionicons name="camera" size={14} color={colors.textInverse} />
            </View>
          </TouchableOpacity>

          <View style={{ marginLeft: spacing.md, flex: 1 }}>
            <Text variant="subtitle">{pessoa?.nome ?? '--'}</Text>
            <Text variant="caption" style={{ color: colors.textSecondary, marginTop: 2 }}>
              RA: {cursoSelecionado?.ra ?? cursoSelecionado?.Ra ?? '--'}
            </Text>
            {!!pessoa?.avatarUrl && (
              <TouchableOpacity onPress={handleRemoverFoto}>
                <Text variant="caption" style={{ color: colors.error, marginTop: 4 }}>
                  Remover foto
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Text variant="label" style={{ color: colors.primary, marginTop: spacing.lg, marginBottom: spacing.sm }}>
          Dados Pessoais
        </Text>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          {isEdit ? (
            <>
              <Controller
                control={control}
                name="nome"
                render={({ field }) => (
                  <Input label="Nome Completo" value={field.value} onChangeText={field.onChange} error={errors.nome?.message} containerStyle={{ marginBottom: spacing.sm }} />
                )}
              />
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <Input label="E-mail" value={field.value} onChangeText={field.onChange} autoCapitalize="none" error={errors.email?.message} containerStyle={{ marginBottom: spacing.sm }} />
                )}
              />
              <Controller
                control={control}
                name="telefone"
                render={({ field }) => (
                  <Input
                    label="Telefone"
                    value={field.value}
                    onChangeText={(text) => field.onChange(formatPhone(text))}
                    keyboardType="numeric"
                    error={errors.telefone?.message}
                  />
                )}
              />
            </>
          ) : (
            <>
              <Text variant="caption" style={{ color: colors.textSecondary }}>Nome Completo</Text>
              <Text variant="body" style={{ marginBottom: spacing.sm }}>{pessoa?.nome ?? '--'}</Text>

              <Text variant="caption" style={{ color: colors.textSecondary }}>E-mail</Text>
              <Text variant="body" style={{ marginBottom: spacing.sm }}>{pessoa?.email?.valor ?? '--'}</Text>

              <Text variant="caption" style={{ color: colors.textSecondary }}>Telefone</Text>
              <Text variant="body">{pessoa?.telefone?.valor ? formatPhone(pessoa.telefone.valor) : '--'}</Text>
            </>
          )}
        </View>

        <Text variant="label" style={{ color: colors.primary, marginTop: spacing.lg, marginBottom: spacing.sm }}>
          Informações do Curso
        </Text>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text variant="caption" style={{ color: colors.textSecondary }}>Nome do Curso</Text>
          <Text variant="body" style={{ marginBottom: spacing.sm }}>
            {cursoSelecionado?.curriculo?.curso?.nome ?? cursoSelecionado?.CursoNome ?? '--'}
          </Text>
          <Text variant="caption" style={{ color: colors.textSecondary }}>RA</Text>
          <Text variant="body">{cursoSelecionado?.ra ?? cursoSelecionado?.Ra ?? '--'}</Text>
        </View>

        {isEdit && (
          <View style={{ marginTop: spacing.xl }}>
            <Button label="SALVAR ALTERAÇÕES" onPress={handleSubmit(onSubmit)} isLoading={isPending} />
            <Button label="CANCELAR" variant="outline" onPress={() => setIsEdit(false)} style={{ marginTop: spacing.sm }} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  profileCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1 },
  avatar: { width: 64, height: 64, borderRadius: 32 },
  avatarPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  cameraBadge: { position: 'absolute', right: -2, bottom: -2, width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  card: { borderRadius: 10, padding: 14 },
});
