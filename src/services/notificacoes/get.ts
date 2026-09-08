import { api } from '@/services/api';
import { Aviso, Notificacao } from './types';

type PageResponse<T> = { content: T[] };

export const getNotificacoes = async (matriculaId: number | undefined, page: number, size: number = 6) => {
  const { data } = await api.get<PageResponse<Notificacao> | Notificacao[]>('/notificacao', {
    headers: { matriculaId },
    params: { sort: 'id,desc', page, size },
  });
  return Array.isArray(data) ? data : data?.content ?? [];
};

export const getNotificacoesNaoLidas = async (
  matriculaId: number | undefined,
  page: number,
  size: number = 6,
  ra?: string,
) => {
  const { data } = await api.get<PageResponse<Notificacao> | Notificacao[]>('/notificacao', {
    headers: { matriculaId, ra },
    params: { visualizada: false, sort: 'id,desc', page, size },
  });
  return Array.isArray(data) ? data : data?.content ?? [];
};

export const getCountNotificacoes = async (alunoId: number | undefined) => {
  const { data } = await api.get<number>('/notificacao/count', {
    headers: { matriculaId: alunoId },
    params: { 'aluno.id': alunoId, visualizada: false },
  });
  return data;
};

export const getAvisoById = async (alunoId: number, avisoId: number) => {
  const { data } = await api.get<Aviso>(`/aviso/${avisoId}`, {
    headers: { alunoId },
  });
  return data;
};

export const marcarNotificacaoVisualizada = async (alunoId: number, notificationId: number) => {
  await api.patch(`/notificacao/${notificationId}/visualizar`, {}, { headers: { alunoId } });
};
