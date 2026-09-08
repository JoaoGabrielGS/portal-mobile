import { cardSchema, cardSchemaWae, CardFormSchema } from '@/schemas/financeiro/card.schema';
import { getMeiosPagamento, Mensalidade, payFinancialCard, payFinancialCardWae } from '@/services/financeiro';
import { useUserStore } from '@/store/user.store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { Resolver, useForm } from 'react-hook-form';
import { Alert } from 'react-native';

export function useFinanceiroCartao() {
  const { charge: chargeJson } = useLocalSearchParams<{ charge: string }>();
  const charge: Mensalidade = JSON.parse(chargeJson);
  const cursoSelecionado = useUserStore((s) => s.cursoSelecionado);
  const matriculaId = cursoSelecionado?.matriculaId ?? cursoSelecionado?.id;
  const codigoCurso = cursoSelecionado?.Curso ?? cursoSelecionado?.curriculo?.curso?.codigo;

  const form = useForm<CardFormSchema>({
    mode: 'onChange',
    defaultValues: { number: '', holderName: '', dueAt: '', cvv: '', meioPagamento: undefined },
    resolver: zodResolver(charge.isWaeCobranca ? cardSchemaWae : cardSchema) as Resolver<CardFormSchema>,
  });

  const { data: meiosPagamento } = useQuery({
    queryKey: ['financeiro.meiosPagamento'],
    queryFn: () => getMeiosPagamento(matriculaId, codigoCurso),
    enabled: !!charge.isWaeCobranca && !!matriculaId && !!codigoCurso,
  });

  const { mutateAsync: pagarCartao, isPending } = useMutation({
    mutationKey: ['financeiro.pagamentoCartao'],
    mutationFn: (data: CardFormSchema) =>
      payFinancialCard([charge.financeiroId], {
        number: data.number,
        holderName: data.holderName,
        dueAt: data.dueAt,
        cvv: data.cvv,
      }),
    onError: () => Alert.alert('Erro', 'Erro ao realizar pagamento'),
  });

  const { mutateAsync: pagarCartaoWae, isPending: isPendingWae } = useMutation({
    mutationKey: ['financeiro.pagamentoCartaoWae'],
    mutationFn: (data: CardFormSchema) =>
      payFinancialCardWae(matriculaId!, {
        financeiroId: charge.financeiroId,
        valor: charge.valorOriginal,
        cartaoMes: parseInt(data.dueAt.slice(0, 2), 10),
        cartaoAno: parseInt(data.dueAt.slice(2), 10),
        meioPagamento: data.meioPagamento!,
        cartaoNumero: data.number,
        cartaoPortador: data.holderName,
        cartaoCodigoSeguranca: data.cvv,
      }),
    onError: () => Alert.alert('Erro', 'Erro ao realizar pagamento'),
  });

  const onSubmit = async (data: CardFormSchema) => {
    try {
      if (charge.isWaeCobranca) {
        await pagarCartaoWae(data);
      } else {
        await pagarCartao(data);
      }
      router.replace('/(tabs)/financeiro');
    } catch {
      // erro já tratado no onError das mutations
    }
  };

  return {
    charge,
    form,
    onSubmit,
    isPending: isPending || isPendingWae,
    meiosPagamento: meiosPagamento ?? [],
  };
}
