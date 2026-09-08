import { getAvisoById } from '@/services/notificacoes';
import { useUserStore } from '@/store/user.store';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';

export function useNotificacaoDetalhe() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const cursoSelecionado = useUserStore((s) => s.cursoSelecionado);
  const queryClient = useQueryClient();

  const alunoId = cursoSelecionado?.id ?? 0;

  const { data, isLoading } = useQuery({
    queryKey: ['notificacao.aviso', alunoId, id],
    queryFn: () => getAvisoById(alunoId, Number(id)),
    enabled: !!alunoId && !!id,
  });

  const handleBack = () => {
    queryClient.invalidateQueries({ queryKey: ['notificacoes'] });
    router.back();
  };

  return { data, isLoading, handleBack };
}
