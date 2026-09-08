import { api } from '@/services/api';

type LoginParams = {
  login: string;
  senha: string;
};

type LoginResponse = {
  token: string;
  refresh: string;
};

export const login = async ({ login, senha }: LoginParams) => {
  const { data } = await api.post<LoginResponse>('/auth/login', { login, senha });
  return data;
};
