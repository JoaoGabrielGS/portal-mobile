import { payFinancialPix } from '@/services/financeiro';
import { Mensalidade } from '@/services/financeiro';
import { useUserStore } from '@/store/user.store';
import { useMutation } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

export function usePagamento() {
  const { charge: chargeJson } = useLocalSearchParams<{ charge: string }>();
  const charge: Mensalidade = JSON.parse(chargeJson);
  const cursoSelecionado = useUserStore((s) => s.cursoSelecionado);

  const [metodo, setMetodo] = useState<'pix' | 'cartao' | null>(null);

  const { mutateAsync: gerarPix, isPending } = useMutation({
    mutationKey: ['financeiro.pagamentoPix'],
    mutationFn: () => payFinancialPix([charge.financeiroId]),
    onError: () => Alert.alert('Erro', 'Erro ao gerar código Pix'),
  });

  const onAvancar = async () => {
    if (metodo === 'cartao') {
      router.push({ pathname: '/financeiro-cartao', params: { charge: chargeJson } });
      return;
    }

    if (metodo === 'pix') {
      if (charge.isWaeCobranca) {
        router.push({ pathname: '/financeiro-pix', params: { charge: chargeJson } });
        return;
      }
      try {
        const pix = await gerarPix();
        router.push({
          pathname: '/financeiro-pix',
          params: { charge: chargeJson, pix: JSON.stringify(pix) },
        });
      } catch {
        // erro já tratado no onError da mutation
      }
    }
  };

  return { charge, cursoSelecionado, metodo, setMetodo, onAvancar, isPending };
}
