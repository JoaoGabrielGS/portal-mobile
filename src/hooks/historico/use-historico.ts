import { getHistorico, HistoricoItem } from '@/services/historico';
import { useUserStore } from '@/store/user.store';
import { useInfiniteQuery } from '@tanstack/react-query';

export const HISTORICO_STATUS_COLOR: Record<string, string> = {
  Aprovado: '#388E3C',
  Cursando: '#F57C00',
};

export function useHistorico() {
  const cursoSelecionado = useUserStore((s) => s.cursoSelecionado);
  const matriculaId = cursoSelecionado?.matriculaId ?? cursoSelecionado?.id;
  const codigoCurso = cursoSelecionado?.Curso ?? cursoSelecionado?.curriculo?.curso?.codigo;

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['historico', matriculaId, codigoCurso],
    queryFn: ({ pageParam }) => getHistorico(matriculaId, pageParam, 10, codigoCurso),
    enabled: !!matriculaId,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.last || lastPage.empty || lastPage.content.length === 0) return undefined;
      return allPages.length;
    },
  });

  const itens: HistoricoItem[] = data?.pages.flatMap((page) => page.content) ?? [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  return { itens, isLoading, isFetchingNextPage, handleLoadMore, cursoSelecionado };
}
