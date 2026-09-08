import { api } from '@/services/api';
import { Assunto, Atendimento, MensagemGrupo, Tema } from './types';

type PageResponse<T> = { content: T[]; last: boolean; number: number; totalPages: number };

const normalizePage = <T>(data: PageResponse<T> | T[], page: number): PageResponse<T> => {
  if (Array.isArray(data)) {
    return { content: data, last: true, number: page, totalPages: page + 1 };
  }
  return {
    content: data?.content ?? [],
    last: data?.last ?? true,
    number: data?.number ?? page,
    totalPages: data?.totalPages ?? page + 1,
  };
};

export const getAtendimentos = async (matriculaId: number | undefined, page: number, size: number = 10) => {
  const { data } = await api.get<PageResponse<Atendimento> | Atendimento[]>('/atendimento/matricula', {
    headers: { matriculaId },
    params: { sort: 'dataAbertura,desc', page, size },
  });
  return normalizePage(data, page);
};

export const getAtendimentoById = async (id: number) => {
  const { data } = await api.get<Atendimento>(`/atendimento/${id}`);
  return data;
};

export const getMensagens = async (serviceId: number, page: number) => {
  const { data } = await api.get<PageResponse<MensagemGrupo> | MensagemGrupo[]>(`/atendimento/${serviceId}/mensagem`, {
    params: { page, size: 15 },
  });
  return normalizePage(data, page);
};

export const getTemas = async (matriculaId: number) => {
  const { data } = await api.get<Tema[] | { content: Tema[] }>('/tema/list', { headers: { matriculaId } });
  return Array.isArray(data) ? data : data?.content ?? [];
};

type AssuntoFilters = { temaId?: string; educationLevel: number };

export const getAssuntos = async (filters: AssuntoFilters) => {
  const { data } = await api.get<{ content: Assunto[] } | Assunto[]>('/assunto', {
    params: { page: 0, size: 100, sort: 'nome,asc', ...filters },
  });
  return Array.isArray(data) ? data : data?.content ?? [];
};
