import { api } from '@/services/api';

export type HistoricoItem = {
  id?: number;
  disciplina: { nome: string; codigo?: string };
  serie: string | number;
  nota: string | number;
  status: { nome: string };
};

export type PageResponse<T> = {
  content: T[];
  number: number;
  last: boolean;
  empty: boolean;
  totalElements: number;
};

export const getHistorico = async (
  matriculaId: number | undefined,
  page: number,
  size: number,
  codigoCurso: string | undefined,
) => {
  const { data } = await api.get<PageResponse<HistoricoItem> | HistoricoItem[]>('/matricula-disciplina/historico', {
    headers: { codigoCurso, matriculaId },
    params: { page, size },
  });

  if (Array.isArray(data)) {
    return { content: data, number: page, last: true, empty: data.length === 0, totalElements: data.length };
  }
  return {
    content: data?.content ?? [],
    number: data?.number ?? page,
    last: data?.last ?? true,
    empty: data?.empty ?? (data?.content?.length ?? 0) === 0,
    totalElements: data?.totalElements ?? data?.content?.length ?? 0,
  };
};
