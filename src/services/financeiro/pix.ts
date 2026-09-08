import { api } from '@/services/api';
import { PixErp, PixWae } from './types';

export const payFinancialPix = async (financeiroIds: number[]) => {
  const { data } = await api.post<PixErp>('/financeiro/pix', { financeiroIds });
  return data;
};

export const getPixWae = async (matriculaId: number, financeiroId: number) => {
  const { data } = await api.get<PixWae>('/financeiro/wae/pix', {
    headers: { matriculaId },
    params: { financeiroId },
  });
  return data;
};
