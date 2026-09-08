import { api } from '@/services/api';
import { Pessoa } from '@/store/user.store';

export const updatePessoa = async (data: Partial<Pessoa>) => {
  const { data: response } = await api.put('/pessoa', data);
  return response;
};
