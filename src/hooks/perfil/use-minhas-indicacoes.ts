import { getMatriculasStatus } from '@/services/indicacao';
import { useUserStore } from '@/store/user.store';
import { useInfiniteQuery } from '@tanstack/react-query';

export function useMinhasIndicacoes() {
  const cursoSelecionado = useUserStore((s) => s.cursoSelecionado);
  const alunoId = cursoSelecionado?.id ?? cursoSelecionado?.ra ?? cursoSelecionado?.Ra;

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['perfil.minhasIndicacoes', alunoId],
    queryFn: ({ pageParam }) => getMatriculasStatus(alunoId, pageParam),
    enabled: !!alunoId,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => (lastPage.length < 4 ? undefined : allPages.length),
  });

  const itens = data?.pages.flat() ?? [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  return { itens, isLoading, isFetchingNextPage, handleLoadMore };
}
