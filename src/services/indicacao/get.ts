import { apiGoLeads } from '@/services/api';

export type IndicacaoStatus = {
  nome: string;
  curso: string;
  status: string;
};

const TOKEN = '9ba0a5d2-665a-4d16-9fb6-432125468cb0';

export const getMatriculasStatus = async (alunoId: number | undefined, page: number, size: number = 4) => {
  const { data } = await apiGoLeads.get<IndicacaoStatus[] | { content: IndicacaoStatus[] }>(
    `/matricula-status/${alunoId}`,
    {
      headers: { alunoId, ra: alunoId },
      params: { tk: TOKEN, page, size },
    },
  );
  return Array.isArray(data) ? data : data?.content ?? [];
};
