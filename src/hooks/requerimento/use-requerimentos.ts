import { getResumo, marcarRespostaVisualizada, SolicitacaoResumo } from '@/services/requerimento';
import { useUserStore } from '@/store/user.store';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';

export function useRequerimentos() {
  const cursoSelecionado = useUserStore((s) => s.cursoSelecionado);
  const alunoId = cursoSelecionado?.id;
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['requerimentos', alunoId],
    queryFn: ({ pageParam }) => getResumo(alunoId, pageParam),
    enabled: !!alunoId,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => (lastPage.length < 6 ? undefined : allPages.length),
  });

  const itens = data?.pages.flat() ?? [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  const { mutateAsync: marcarVisualizada } = useMutation({
    mutationKey: ['requerimentos.marcarVisualizada'],
    mutationFn: (id: number) => marcarRespostaVisualizada(alunoId, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['requerimentos'] }),
  });

  const handlePress = async (item: SolicitacaoResumo) => {
    if (item.respostaVisualizada === false) {
      await marcarVisualizada(item.id);
    }
    router.push({ pathname: '/requerimento-detalhe', params: { id: String(item.id) } });
  };

  return { itens, isLoading, isFetchingNextPage, handleLoadMore, handlePress };
}
