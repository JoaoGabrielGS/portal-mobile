import { getCarteirinha } from '@/services/carteirinha';
import { useUserStore } from '@/store/user.store';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export function useCarteirinha() {
  const cursoSelecionado = useUserStore((s) => s.cursoSelecionado);
  const [visivel, setVisivel] = useState(false);
  const [virada, setVirada] = useState(false);

  const matriculaId = cursoSelecionado?.matriculaId ?? cursoSelecionado?.id;
  const codigoCurso = cursoSelecionado?.Curso ?? cursoSelecionado?.curriculo?.curso?.codigo;

  const { data, isLoading } = useQuery({
    queryKey: ['perfil.carteirinha', matriculaId],
    queryFn: () =>
      getCarteirinha(matriculaId!, codigoCurso, cursoSelecionado?.AnoLetivo, cursoSelecionado?.PeriodoLetivo),
    enabled: !!matriculaId && visivel,
  });

  return {
    visivel,
    abrir: () => setVisivel(true),
    fechar: () => setVisivel(false),
    virada,
    virar: () => setVirada((v) => !v),
    data,
    isLoading,
  };
}
