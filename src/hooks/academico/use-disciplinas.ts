import { getDisciplinaLinkMoodle, getDisciplinas } from '@/services/moodle';
import { useUserStore } from '@/store/user.store';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Linking } from 'react-native';

export function useDisciplinas() {
  const cursoSelecionado = useUserStore((s) => s.cursoSelecionado);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { data, isFetching } = useQuery({
    queryKey: ['academico.disciplinas', cursoSelecionado?.id],
    queryFn: () => getDisciplinas(cursoSelecionado!),
    enabled: !!cursoSelecionado,
  });

  const handleDisciplinaPress = async (item: any) => {
    const matriculaId = cursoSelecionado?.matriculaId ?? cursoSelecionado?.id;
    const courseMoodleId = item?.disciplinaMoodle?.courseMoodleId ?? item?.disciplinaMoodleId;
    if (!matriculaId || !courseMoodleId) return;

    setIsRedirecting(true);
    try {
      const link = await getDisciplinaLinkMoodle(matriculaId, courseMoodleId);
      if (link) Linking.openURL(link);
    } finally {
      setIsRedirecting(false);
    }
  };

  return { disciplinas: data ?? [], isFetching, isRedirecting, handleDisciplinaPress };
}
