import { api } from '@/services/api';

export const reabrirAtendimento = async (id: number) => {
  await api.patch(`/atendimento/${id}/reabrir`);
};

export const finalizarAtendimento = async (id: number) => {
  await api.patch(`/atendimento/${id}/finalizar`);
};

export const avaliarAtendimento = async (id: number, avaliacao: number, matriculaId: number | undefined) => {
  await api.patch(
    `/atendimento/${id}/avaliar`,
    { avaliacao, matriculaId },
    { headers: { matriculaId } },
  );
};
