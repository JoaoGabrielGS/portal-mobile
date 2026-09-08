export const STATUS_DEFERIDO = 1001;
export const STATUS_DEVOLUTIVA = 35;
export const STATUS_INDEFERIDO = 36;

const STATUS_COLOR: Record<number, string> = {
  33: '#F57C00', // EM_ESPERA
  34: '#F57C00', // EM_ATENDIMENTO
  1002: '#F57C00', // AGUARDANDO_PAGAMENTO
  35: '#1976D2', // DEVOLUTIVA
  36: '#D32F2F', // INDEFERIDO
  1001: '#388E3C', // DEFERIDO
  1003: '#D32F2F', // CANCELADO
};

export const getRequerimentoStatusColor = (statusId: number) => STATUS_COLOR[statusId] ?? '#9E9E9E';
