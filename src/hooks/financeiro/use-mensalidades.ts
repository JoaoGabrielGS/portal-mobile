import { getMensalidades, Mensalidade } from '@/services/financeiro';
import { useUserStore } from '@/store/user.store';
import { PAID_STATUS_IDS } from '@/utils/financeiro-status';
import { useQuery } from '@tanstack/react-query';

const sortByVencimento = (a: Mensalidade, b: Mensalidade) =>
  new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime();

const sortByPagamento = (a: Mensalidade, b: Mensalidade) => {
  const dateA = a.dataPagamento ? new Date(a.dataPagamento).getTime() : 0;
  const dateB = b.dataPagamento ? new Date(b.dataPagamento).getTime() : 0;
  return dateB - dateA;
};

export function useMensalidades() {
  const cursoSelecionado = useUserStore((s) => s.cursoSelecionado);
  const matriculaId = cursoSelecionado?.matriculaId ?? cursoSelecionado?.id;
  const codigoCurso = cursoSelecionado?.Curso ?? cursoSelecionado?.curriculo?.curso?.codigo;

  const { data = [], isLoading } = useQuery({
    queryKey: ['financeiro.mensalidades', matriculaId],
    queryFn: () => getMensalidades(matriculaId, codigoCurso),
    enabled: !!matriculaId,
  });

  const naoPagas = data.filter((item) => !PAID_STATUS_IDS.includes(item.status.id)).sort(sortByVencimento);
  const pagas = data.filter((item) => PAID_STATUS_IDS.includes(item.status.id)).sort(sortByPagamento);

  return { isLoading, naoPagas, pagas, cursoSelecionado };
}
