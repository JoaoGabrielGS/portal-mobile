export const ATENDIMENTO_STATUS = {
  EM_ESPERA: 41,
  EM_ATENDIMENTO: 42,
  RESOLVIDO: 43,
  REABERTO: 44,
  FINALIZADO: 45,
} as const;

export const ATENDIMENTO_STATUS_STYLE: Record<number, { bg: string; text: string; label: string }> = {
  [ATENDIMENTO_STATUS.EM_ESPERA]: { bg: '#FFF3E0', text: '#E65100', label: 'Em espera' },
  [ATENDIMENTO_STATUS.EM_ATENDIMENTO]: { bg: '#E8F5E9', text: '#2E7D32', label: 'Em atendimento' },
  [ATENDIMENTO_STATUS.RESOLVIDO]: { bg: '#E3F2FD', text: '#1565C0', label: 'Resolvido' },
  [ATENDIMENTO_STATUS.REABERTO]: { bg: '#F3E5F5', text: '#6A1B9A', label: 'Reaberto' },
  [ATENDIMENTO_STATUS.FINALIZADO]: { bg: '#F2F2F7', text: '#636366', label: 'Finalizado' },
};
