import { api } from '@/services/api';

export const marcarRespostaVisualizada = async (alunoId: number | undefined, id: number) => {
  await api.patch(`/solicitacao/${id}/visualizar-resposta`, {}, { headers: { alunoId, ra: alunoId } });
};
