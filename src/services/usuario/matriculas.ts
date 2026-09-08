import { api } from '@/services/api';
import { Curso } from '@/store/user.store';

export const getMatriculas = async () => {
  const { data } = await api.get<Curso[] | { content: Curso[] }>('/usuario/matriculas');
  return Array.isArray(data) ? data : data?.content ?? [];
};
