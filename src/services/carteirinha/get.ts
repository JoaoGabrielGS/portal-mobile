import { api } from '@/services/api';

export type Carteirinha = {
  frente: string;
  verso: string;
};

export const getCarteirinha = async (
  matriculaId: number,
  codigoCurso: string | undefined,
  anoLetivo: number | undefined,
  periodoLetivo: number | undefined,
) => {
  const { data } = await api.get<Carteirinha>('/matricula/carteirinha', {
    headers: { matriculaId, codigoCurso, anoLetivo, periodoLetivo },
  });
  return data;
};
