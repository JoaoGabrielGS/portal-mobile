import { CriarAtendimentoFormSchema, criarAtendimentoSchema } from '@/schemas/atendimento/criar-atendimento.schema';
import { getAssuntos, getTemas, postAtendimento } from '@/services/atendimento';
import { useUserStore } from '@/store/user.store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';

export function useCriarAtendimento() {
  const cursoSelecionado = useUserStore((s) => s.cursoSelecionado);
  const matriculaId = cursoSelecionado?.matriculaId ?? cursoSelecionado?.id;
  const isGraduacao = cursoSelecionado?.flGraduacao ?? true;

  const form = useForm<CriarAtendimentoFormSchema>({
    resolver: zodResolver(criarAtendimentoSchema),
    defaultValues: { temaId: '', assuntoId: '', mensagem: '' },
  });

  const temaId = form.watch('temaId');

  const { data: temas = [] } = useQuery({
    queryKey: ['atendimento.temas', matriculaId],
    queryFn: () => getTemas(matriculaId!),
    enabled: !!matriculaId,
  });

  const { data: assuntos = [] } = useQuery({
    queryKey: ['atendimento.assuntos', temaId, isGraduacao],
    queryFn: () => getAssuntos({ temaId: temaId || undefined, educationLevel: isGraduacao ? 1 : 2 }),
    enabled: !!temaId,
  });

  useEffect(() => {
    if (assuntos.length === 1) {
      form.setValue('assuntoId', String(assuntos[0].id));
    }
  }, [assuntos]);

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['atendimento.criar'],
    mutationFn: (data: CriarAtendimentoFormSchema) =>
      postAtendimento({
        alunoId: matriculaId!,
        matriculaId: matriculaId!,
        assuntoId: Number(data.assuntoId),
        mensagem: data.mensagem,
        cursoCodigo: cursoSelecionado?.Curso ?? cursoSelecionado?.curriculo?.curso?.codigo,
        cursoNome: cursoSelecionado?.CursoNome ?? cursoSelecionado?.curriculo?.curso?.nome,
      }),
    onError: () => Toast.show({ type: 'error', text1: 'Erro ao enviar solicitação' }),
  });

  const onSubmit = async (data: CriarAtendimentoFormSchema) => {
    try {
      const novoId = await mutateAsync(data);
      Toast.show({ type: 'success', text1: 'Solicitação enviada com sucesso' });
      router.replace({ pathname: '/fale-fatecie-chat', params: { id: String(novoId) } });
    } catch {
      // erro já tratado no onError da mutation
    }
  };

  return { form, onSubmit, isPending, temas, assuntos };
}
