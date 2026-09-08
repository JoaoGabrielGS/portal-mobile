import { getNotificacoes, Notificacao } from '@/services/notificacoes';
import { useUserStore } from '@/store/user.store';
import { useInfiniteQuery } from '@tanstack/react-query';
import { router } from 'expo-router';

export enum TipoNotificacaoEnum {
  ATENDIMENTO = 1,
  AVISO = 2,
  SOLICITACAO = 3,
}

export function useNotificacoes() {
  const cursoSelecionado = useUserStore((s) => s.cursoSelecionado);
  const matriculaId = cursoSelecionado?.matriculaId ?? cursoSelecionado?.id;

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['notificacoes', matriculaId],
    queryFn: ({ pageParam }) => getNotificacoes(matriculaId, pageParam),
    enabled: !!matriculaId,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => (lastPage.length < 6 ? undefined : allPages.length),
  });

  const itens = data?.pages.flat() ?? [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  const handlePressNotificacao = (item: Notificacao) => {
    if (item.tipoNotificacao.id === TipoNotificacaoEnum.SOLICITACAO) {
      if (item.solicitacao?.id) {
        router.push({ pathname: '/requerimento-detalhe', params: { id: String(item.solicitacao.id) } });
      }
      return;
    }
    if (item.tipoNotificacao.id === TipoNotificacaoEnum.ATENDIMENTO) {
      if (item.atendimento?.id) {
        router.push({ pathname: '/fale-fatecie-chat', params: { id: String(item.atendimento.id) } });
      }
      return;
    }
    router.push({ pathname: '/notificacao-detalhe', params: { id: String(item.aviso?.id) } });
  };

  return { itens, isLoading, isFetchingNextPage, handleLoadMore, handlePressNotificacao };
}
