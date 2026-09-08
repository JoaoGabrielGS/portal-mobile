import { api } from '@/services/api';
import { Mensalidade } from './types';

export const getMensalidades = async (matriculaId: number | undefined, codigoCurso?: string) => {
  const { data } = await api.get<{ content: Mensalidade[] } | Mensalidade[]>('/financeiro/mensalidade', {
    headers: { matriculaId, codigoCurso },
  });
  return Array.isArray(data) ? data : data.content ?? [];
};
