export const PAID_STATUS_IDS = [9, 37, 40];
export const ATRASO_STATUS_ID = 38;

const STATUS_MAP: Record<number, { nome: string; color: string }> = {
  8: { nome: 'Em Aberto', color: '#F57C00' },
  38: { nome: 'Em Atraso', color: '#D32F2F' },
  9: { nome: 'Pago', color: '#388E3C' },
  37: { nome: 'Pago Manual', color: '#388E3C' },
  40: { nome: 'Acordado', color: '#388E3C' },
  10: { nome: 'Cancelado', color: '#9E9E9E' },
  11: { nome: 'Estornado', color: '#9E9E9E' },
  39: { nome: 'Renegociado', color: '#1976D2' },
};

export const getStatusColor = (statusId: number) => STATUS_MAP[statusId]?.color ?? '#9E9E9E';

export const isPago = (statusId: number) => PAID_STATUS_IDS.includes(statusId);

export const podeFinalizarPagamento = (statusId: number) =>
  ![...PAID_STATUS_IDS, 10, 11].includes(statusId);
