import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import useLogin from '@/hooks/auth/use-login';
import { useTheme } from '@/hooks/use-theme';
import { Curso } from '@/store/user.store';
import { Controller } from 'react-hook-form';
import { useRef } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from 'react-native-reanimated';

const AnimatedScrollView = Animated.ScrollView;

const NIVEIS = [
  { id: 1, label: 'Graduação' },
  { id: 2, label: 'Pós-Graduação' },
];

const BG = '#1A1A1A';

export default function LoginScreen() {
  const { colors, spacing } = useTheme();
  const {
    form,
    isLoading,
    error,
    isGraduacao,
    onSubmit,
    cursos,
    modalCursoVisivel,
    onSelecionarCurso,
  } = useLogin();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const scrollRef = useRef<Animated.ScrollView>(null);
  const keyboard = useAnimatedKeyboard();

  const scrollToEnd = () => {
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  const spacerStyle = useAnimatedStyle(() => ({
    height: keyboard.height.value,
  }));

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: BG }]}>
      <AnimatedScrollView
        ref={scrollRef}
        contentContainerStyle={[styles.scroll, { paddingHorizontal: spacing.lg }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Image source={require('@/assets/images/logo.png')} style={styles.logo} />

        <Text variant="label" style={{ ...styles.welcome, fontSize: 16 }}>
          Seja bem-vindo(a) ao app
        </Text>
        <Text
          variant="title"
          style={{
            color: colors.primary,
            textAlign: 'center',
            marginBottom: spacing.xl,
            fontSize: 36,
          }}
        >
          UniFatecie
        </Text>

        <Controller
          control={control}
          name="nivel"
          render={({ field }) => (
            <View style={[styles.nivelRow, { marginBottom: spacing.md }]}>
              {NIVEIS.map((item) => {
                const active = field.value === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.nivelBtn,
                      {
                        borderColor: active ? colors.primary : '#3A3A3A',
                        backgroundColor: active ? colors.primary : 'transparent',
                        padding: spacing.sm,
                      },
                    ]}
                    onPress={() => field.onChange(item.id)}
                    activeOpacity={0.8}
                  >
                    <Text variant="label" style={{ color: active ? '#FFFFFF' : '#888888' }}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        />
        {errors.nivel && (
          <Text variant="error" style={{ marginBottom: spacing.sm }}>
            {errors.nivel.message}
          </Text>
        )}

        <Controller
          control={control}
          name="login"
          render={({ field }) => (
            <Input
              label={isGraduacao ? 'R.A.' : 'CPF'}
              placeholder={isGraduacao ? 'Digite seu R.A.' : 'Digite seu CPF'}
              value={field.value}
              onChangeText={field.onChange}
              autoCapitalize="none"
              keyboardType={isGraduacao ? 'default' : 'numeric'}
              error={errors.login?.message}
              inputStyle={{ backgroundColor: '#2A2A2A', color: '#FFFFFF', borderColor: '#3A3A3A' }}
              labelStyle={{ color: '#888888' }}
              onFocus={scrollToEnd}
            />
          )}
        />

        <View style={{ height: spacing.md }} />

        <Controller
          control={control}
          name="senha"
          render={({ field }) => (
            <Input
              label="Senha"
              placeholder="Digite sua senha"
              value={field.value}
              onChangeText={field.onChange}
              secureTextEntry
              error={errors.senha?.message}
              inputStyle={{ backgroundColor: '#2A2A2A', color: '#FFFFFF', borderColor: '#3A3A3A' }}
              labelStyle={{ color: '#888888' }}
              onFocus={scrollToEnd}
            />
          )}
        />

        {error && (
          <Text variant="error" style={{ marginTop: spacing.sm }}>
            {error}
          </Text>
        )}

        <Button
          label="ENTRAR"
          onPress={handleSubmit(onSubmit)}
          isLoading={isLoading}
          style={{ marginTop: spacing.xl }}
        />

        <Text variant="caption" style={{ color: '#555555', textAlign: 'center', marginTop: spacing.xl }}>
          Versão 1.0.0
        </Text>

        <Animated.View style={spacerStyle} />
      </AnimatedScrollView>

      <Modal visible={modalCursoVisivel} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: '#1E1E1E' }]}>
            <Text variant="subtitle" style={{ color: '#FFFFFF', textAlign: 'center', marginBottom: spacing.lg }}>
              Selecione o curso
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {cursos.map((curso: Curso, index: number) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.cursoItem,
                    { borderColor: '#3A3A3A', borderBottomWidth: index < cursos.length - 1 ? 1 : 0 },
                  ]}
                  onPress={() => onSelecionarCurso(curso)}
                  activeOpacity={0.7}
                >
                  <Text variant="body" style={{ color: colors.primary, fontWeight: '600' }} numberOfLines={2}>
                    {curso.CursoNome ?? curso.curriculo?.curso?.descricao}
                  </Text>
                  <Text variant="caption" style={{ color: '#888888', marginTop: 4 }}>
                    {curso.ra ?? curso.Ra}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingVertical: 40 },
  logo: { width: 160, height: 160, resizeMode: 'contain', alignSelf: 'center', marginBottom: 24 },
  welcome: { color: '#AAAAAA', textAlign: 'center', marginBottom: 4 },
  nivelRow: { flexDirection: 'row', gap: 8 },
  nivelBtn: { flex: 1, alignItems: 'center', borderWidth: 1, borderRadius: 8 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalContainer: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, maxHeight: '70%' },
  cursoItem: { paddingVertical: 16 },
});
