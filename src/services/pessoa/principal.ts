import { api } from '@/services/api';

export const getPessoaPrincipal = async () => {
  const { data } = await api.get<{ usuarioExternoId: number }>('/pessoa/principal');
  return data;
};
