import { getCarteirinha } from '@/services/carteirinha';
import { useAuthStore } from '@/store/auth.store';
import { ThemeMode, useThemeStore } from '@/store/theme.store';
import { Curso, useUserStore } from '@/store/user.store';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import Toast from 'react-native-toast-message';

export const THEME_OPTIONS: { label: string; value: ThemeMode; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: 'Sistema', value: 'system', icon: 'phone-portrait-outline' },
  { label: 'Claro', value: 'light', icon: 'sunny-outline' },
  { label: 'Escuro', value: 'dark', icon: 'moon-outline' },
];

export function usePerfil() {
  const { clearTokens } = useAuthStore();
  const { clear, pessoa, cursoSelecionado, cursos, setCursoSelecionado } = useUserStore();
  const { mode, setMode } = useThemeStore();
  const queryClient = useQueryClient();

  const [modalCurso, setModalCurso] = useState(false);
  const [modalTema, setModalTema] = useState(false);
  const [modalLogout, setModalLogout] = useState(false);
  const [modalCarteirinha, setModalCarteirinha] = useState(false);
  const [carteirinhaVirada, setCarteirinhaVirada] = useState(false);

  const nome = pessoa?.nome ?? '';
  const email = pessoa?.email?.valor ?? '';
  const iniciais = nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p: string) => p[0]?.toUpperCase())
    .join('');

  const matriculaId = cursoSelecionado?.matriculaId ?? cursoSelecionado?.id;
  const codigoCurso = cursoSelecionado?.Curso ?? cursoSelecionado?.curriculo?.curso?.codigo;

  const { data: carteirinha, isLoading: carregandoCarteirinha } = useQuery({
    queryKey: ['perfil.carteirinha', matriculaId],
    queryFn: () => getCarteirinha(matriculaId!, codigoCurso, cursoSelecionado?.AnoLetivo, cursoSelecionado?.PeriodoLetivo),
    enabled: !!matriculaId && modalCarteirinha,
  });

  const onLogout = async () => {
    setModalLogout(false);
    await clearTokens();
    clear();
    router.replace('/(auth)/login');
  };

  const onSelecionarCurso = async (curso: Curso) => {
    const normalizado: Curso = {
      ...curso,
      ra: curso.Ra ?? curso.ra,
      matriculaId: curso.matriculaId ?? curso.Ra,
      Curso: curso.Curso ?? curso.curriculo?.curso?.codigo,
    };
    setCursoSelecionado(normalizado);
    await queryClient.invalidateQueries();
    Toast.show({ type: 'success', text1: 'Curso alterado', text2: normalizado.CursoNome ?? curso.curriculo?.curso?.nome });
    setModalCurso(false);
  };

  const onAbrirCarteirinha = () => {
    setCarteirinhaVirada(false);
    setModalCarteirinha(true);
  };

  const temaAtual = THEME_OPTIONS.find((o) => o.value === mode);

  return {
    cursoSelecionado,
    cursos,
    mode,
    setMode,
    nome,
    email,
    iniciais,
    temaAtual,
    modalCurso,
    setModalCurso,
    modalTema,
    setModalTema,
    modalLogout,
    setModalLogout,
    modalCarteirinha,
    setModalCarteirinha,
    carteirinha,
    carregandoCarteirinha,
    carteirinhaVirada,
    virarCarteirinha: () => setCarteirinhaVirada((v) => !v),
    onLogout,
    onSelecionarCurso,
    onAbrirCarteirinha,
  };
}
