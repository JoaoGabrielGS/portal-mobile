import { getDevolutiva, getSolicitacaoById } from '@/services/requerimento';
import { useUserStore } from '@/store/user.store';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';

export function useRequerimentoDetalhe() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const cursoSelecionado = useUserStore((s) => s.cursoSelecionado);
  const alunoId = cursoSelecionado?.id;

  const { data, isLoading } = useQuery({
    queryKey: ['requerimento.detalhe', alunoId, id],
    queryFn: () => getSolicitacaoById(alunoId, Number(id)),
    enabled: !!alunoId && !!id,
  });

  const { data: devolutiva } = useQuery({
    queryKey: ['requerimento.devolutiva', alunoId, id],
    queryFn: () => getDevolutiva(alunoId, Number(id)),
    enabled: !!alunoId && !!id && data?.status.id === 35,
  });

  return { data, devolutiva, isLoading };
}
