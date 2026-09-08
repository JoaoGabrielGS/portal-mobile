import { api } from '@/services/api';
import { Curso } from '@/store/user.store';

export type Disciplina = {
  id: number;
  nome?: string;
  disciplinaMoodleId?: number;
  disciplinaMoodle?: {
    courseMoodleId?: number;
    disciplina?: { nome?: string };
  };
};

type PageResponse<T> = {
  content: T[];
};

export const getDisciplinas = async (curso: Curso) => {
  const headers = {
    alunoId: curso?.Ra ?? curso?.ra,
    ra: curso?.Ra ?? curso?.ra,
    matriculaId: curso?.matriculaId ?? curso?.id,
    anoLetivo: curso?.AnoLetivo,
    periodoLetivo: curso?.PeriodoLetivo,
    curso: curso?.Curso,
    serie: curso?.Serie,
  };

  const { data } = await api.get<PageResponse<Disciplina> | Disciplina[]>('/moodle/disciplinas', { headers });
  return Array.isArray(data) ? data : data?.content ?? [];
};

export const getDisciplinaLinkMoodle = async (matriculaId: number, courseMoodleId: number) => {
  const { data } = await api.get<string>(`/moodle/disciplina-link/${courseMoodleId}`, {
    headers: { matriculaId, ra: matriculaId },
  });
  return data;
};
