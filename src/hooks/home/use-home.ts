import { getAtendimentos } from '@/services/atendimento';
import { getBanners } from '@/services/banner';
import { getDisciplinas, getDisciplinaLinkMoodle } from '@/services/moodle';
import { useUserStore } from '@/store/user.store';
import { useQuery } from '@tanstack/react-query';

export function useHome() {
  const cursoSelecionado = useUserStore((s) => s.cursoSelecionado);
  const alunoId = cursoSelecionado?.matriculaId ?? cursoSelecionado?.id;

  const banners = useQuery({
    queryKey: ['home.banners'],
    queryFn: getBanners,
    refetchOnWindowFocus: false,
  });

  const disciplinas = useQuery({
    queryKey: ['home.disciplinas', cursoSelecionado?.id],
    queryFn: () => getDisciplinas(cursoSelecionado!),
    enabled: !!cursoSelecionado,
    refetchOnWindowFocus: false,
  });

  const atendimentos = useQuery({
    queryKey: ['home.atendimentos', alunoId],
    queryFn: () => getAtendimentos(alunoId, 0, 3),
    enabled: !!alunoId,
    refetchOnWindowFocus: false,
  });

  const abrirDisciplinaNoMoodle = async (disciplinaMoodleId?: number) => {
    if (!cursoSelecionado || !disciplinaMoodleId) return null;
    const matriculaId = cursoSelecionado.matriculaId ?? cursoSelecionado.id;
    return getDisciplinaLinkMoodle(matriculaId, disciplinaMoodleId);
  };

  return { banners, disciplinas, atendimentos, abrirDisciplinaNoMoodle, cursoSelecionado };
}
