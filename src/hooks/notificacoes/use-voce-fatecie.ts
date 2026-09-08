import { getNotificacoesNaoLidas, marcarNotificacaoVisualizada, Notificacao } from '@/services/notificacoes';
import { useUserStore } from '@/store/user.store';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';

export enum TipoNotificacaoEnum {
  ATENDIMENTO = 1,
  AVISO = 2,
  SOLICITACAO = 3,
}

export function useVoceFatecie() {
  const cursoSelecionado = useUserStore((s) => s.cursoSelecionado);
  const matriculaId = cursoSelecionado?.matriculaId ?? cursoSelecionado?.id;
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['voceFatecie', matriculaId],
    queryFn: ({ pageParam }) => getNotificacoesNaoLidas(matriculaId, pageParam, undefined, cursoSelecionado?.ra),
    enabled: !!matriculaId,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => (lastPage.length < 6 ? undefined : allPages.length),
  });

  const itens = data?.pages.flat() ?? [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  const handlePressNotificacao = async (item: Notificacao) => {
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
    await marcarNotificacaoVisualizada(matriculaId ?? 0, item.id);
    queryClient.invalidateQueries({ queryKey: ['voceFatecie'] });
    router.push({ pathname: '/notificacao-detalhe', params: { id: String(item.aviso?.id) } });
  };

  return { itens, isLoading, isFetchingNextPage, handleLoadMore, handlePressNotificacao };
}
