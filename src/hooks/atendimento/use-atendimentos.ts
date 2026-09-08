import { getAtendimentos } from '@/services/atendimento';
import { useUserStore } from '@/store/user.store';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';

export function useAtendimentos() {
  const cursoSelecionado = useUserStore((s) => s.cursoSelecionado);
  const alunoId = cursoSelecionado?.matriculaId ?? cursoSelecionado?.id;
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['atendimentos', alunoId],
    queryFn: ({ pageParam }) => getAtendimentos(alunoId, pageParam),
    enabled: !!alunoId,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.number + 1),
  });

  const itens = data?.pages.flatMap((p) => p.content) ?? [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['atendimentos'] });
    setRefreshing(false);
  }, [queryClient]);

  const abrirChat = (id: number) => router.push({ pathname: '/fale-fatecie-chat', params: { id: String(id) } });
  const irParaNovoAtendimento = () => router.push('/fale-fatecie-novo');

  return {
    itens,
    isLoading,
    isFetchingNextPage,
    handleLoadMore,
    refreshing,
    handleRefresh,
    abrirChat,
    irParaNovoAtendimento,
  };
}
