import { api } from '@/services/api';
import { format } from 'date-fns';

export type CalendarioEvento = {
  id: string;
  nome: string;
  instanteInicio: string;
  instanteFim: string;
};

type CalendarioDiaResponse = {
  eventos: { nome: string; instanteInicio: string; instanteFim: string }[];
};

export const getEventos = async (matriculaId: number, startDate: Date, endDate: Date) => {
  const { data } = await api.get<CalendarioDiaResponse[] | { content: CalendarioDiaResponse[] }>('/moodle/calendario', {
    headers: { matriculaId },
    params: {
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
    },
  });

  const dias = Array.isArray(data) ? data : data?.content ?? [];

  return dias.flatMap((dia, diaIndex) =>
    (dia.eventos ?? []).map((evento, eventoIndex) => ({
      id: `${diaIndex}-${eventoIndex}`,
      ...evento,
    })),
  );
};
