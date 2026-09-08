import { LoginFormSchema, loginSchema } from '@/schemas/auth/login.schema';
import { login } from '@/services/auth/login';
import { getPessoa } from '@/services/pessoa/get';
import { getPessoaPrincipal } from '@/services/pessoa/principal';
import { getMatriculas } from '@/services/usuario/matriculas';
import { initPush } from '@/services/push';
import { useAuthStore } from '@/store/auth.store';
import { Curso, useUserStore } from '@/store/user.store';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [modalCursoVisivel, setModalCursoVisivel] = useState(false);

  const { setTokens } = useAuthStore();
  const { setPessoa, setCursos: setCursosStore, setCursoSelecionado } = useUserStore();
  const usuarioExternoIdRef = useRef(0);

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { login: '', senha: '', nivel: 1 },
  });

  const nivel = form.watch('nivel');
  const isGraduacao = nivel === 1;

  const irParaApp = (curso: Curso) => {
    setCursoSelecionado(curso);
    setModalCursoVisivel(false);
    if (usuarioExternoIdRef.current) {
      initPush(String(usuarioExternoIdRef.current));
    }
    router.replace('/(tabs)');
  };

  const onSubmit = async (values: LoginFormSchema) => {
    setIsLoading(true);
    setError(null);
    try {
      const loginNormalizado = values.login.replaceAll('-', '').replaceAll('.', '');

      const { token, refresh } = await login({ login: loginNormalizado, senha: values.senha });
      await setTokens(token, refresh);

      const pessoa = await getPessoa();
      setPessoa(pessoa);

      const principal = await getPessoaPrincipal();
      usuarioExternoIdRef.current = principal?.usuarioExternoId ?? 0;

      const matriculas = await getMatriculas();
      let listaCursos: Curso[] = (matriculas ?? []).map((item: any) => ({
        ra: item?.ra ?? item?.Ra,
        ...item,
        matriculaId: item?.matriculaId ?? item?.Ra ?? item?.ra,
        Curso: item?.Curso ?? item?.curriculo?.curso?.codigo,
        flGraduacao: values.nivel === 1,
        flPos: values.nivel === 2,
      }));

      listaCursos = listaCursos.filter((item) => {
        if (!item.Modalidade) return true;
        const modalidade = String(item.Modalidade).toUpperCase();
        return modalidade.includes('EAD') || modalidade.includes('DISTANCIA');
      });

      if (listaCursos.length === 0) {
        setError(
          'Este aplicativo é exclusivo para alunos EAD. Alunos presenciais devem utilizar o aplicativo Unifatecie Presencial.',
        );
        return;
      }

      listaCursos = listaCursos.filter((item) => {
        const nivelId = item?.curriculo?.curso?.nivelEnsino?.id;
        if (!nivelId) return true;
        return nivelId === values.nivel;
      });

      if (listaCursos.length === 0) {
        const nivelNome = values.nivel === 1 ? 'Graduação' : 'Pós-Graduação';
        setError(
          `Nenhuma matrícula de ${nivelNome} encontrada para este usuário. Verifique o nível de ensino selecionado.`,
        );
        return;
      }

      setCursosStore(listaCursos);

      if (listaCursos.length === 1) {
        irParaApp(listaCursos[0]);
        return;
      }

      setCursos(listaCursos);
      setModalCursoVisivel(true);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        'Erro ao realizar login';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    error,
    isGraduacao,
    onSubmit,
    cursos,
    modalCursoVisivel,
    onSelecionarCurso: irParaApp,
  };
}
