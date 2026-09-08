import { api } from '@/services/api';
import { Pessoa } from '@/store/user.store';

export const getPessoa = async () => {
  const { data } = await api.get<Pessoa>('/pessoa');
  return data;
};
