import { api } from '@/services/api';
import { Devolutiva, SolicitacaoDetalhe, SolicitacaoResumo } from './types';

type PageResponse<T> = { content: T[] };

export const getResumo = async (alunoId: number | undefined, page: number, size: number = 6) => {
  const { data } = await api.get<PageResponse<SolicitacaoResumo> | SolicitacaoResumo[]>('/solicitacao/resumo', {
    headers: { alunoId, ra: alunoId },
    params: { sort: 'id,desc', page, size },
  });
  return Array.isArray(data) ? data : data?.content ?? [];
};

export const getSolicitacaoById = async (alunoId: number | undefined, id: number) => {
  const { data } = await api.get<SolicitacaoDetalhe>(`/solicitacao/${id}`, {
    headers: { alunoId, ra: alunoId },
  });
  return data;
};

export const getDevolutiva = async (alunoId: number | undefined, id: number) => {
  const { data } = await api.get<Devolutiva>(`/solicitacao/${id}/devolutiva`, {
    headers: { alunoId, ra: alunoId },
  });
  return data;
};
