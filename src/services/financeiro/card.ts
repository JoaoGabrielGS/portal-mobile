import { api } from '@/services/api';
import { CardPayload, MeioPagamento } from './types';

export const payFinancialCard = async (financeiroIds: number[], card: CardPayload) => {
  const { data } = await api.post('/financeiro/cartao-credito', { financeiroIds, card });
  return data;
};

type CardPayloadWae = {
  financeiroId: number;
  valor: number;
  cartaoMes: number;
  cartaoAno: number;
  meioPagamento: number;
  cartaoNumero: string;
  cartaoPortador: string;
  cartaoCodigoSeguranca: string;
};

export const payFinancialCardWae = async (matriculaId: number, payload: CardPayloadWae) => {
  const { data } = await api.post('/financeiro/wae/cartao-credito', payload, {
    headers: { matriculaId },
  });
  return data;
};

export const getMeiosPagamento = async (matriculaId: number | undefined, codigoCurso: string | undefined) => {
  const { data } = await api.get<MeioPagamento[]>('/financeiro/wae/meio-pagamento', {
    headers: { matriculaId, codigoCurso },
  });
  return data;
};
