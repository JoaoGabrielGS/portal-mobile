import { getPixWae, Mensalidade, PixErp, PixWae } from '@/services/financeiro';
import { useUserStore } from '@/store/user.store';
import { useQuery } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

export function useFinanceiroPix() {
  const { charge: chargeJson, pix: pixJson } = useLocalSearchParams<{ charge: string; pix?: string }>();
  const charge: Mensalidade = JSON.parse(chargeJson);
  const pixErp: PixErp | null = pixJson ? JSON.parse(pixJson) : null;

  const cursoSelecionado = useUserStore((s) => s.cursoSelecionado);
  const matriculaId = cursoSelecionado?.matriculaId ?? cursoSelecionado?.id;

  const [timeLeft, setTimeLeft] = useState(charge.isWaeCobranca ? 1800 : 600);

  const { data: pixWae, isLoading } = useQuery({
    queryKey: ['financeiro.pixWae', charge.financeiroId],
    queryFn: () => getPixWae(matriculaId!, charge.financeiroId),
    enabled: !!charge.isWaeCobranca && !!matriculaId,
  });

  const pixCode = charge.isWaeCobranca ? (pixWae as PixWae | undefined)?.URL : pixErp?.key ?? pixErp?.qrCodeUrl;
  const pixQrCodeUri = charge.isWaeCobranca ? (pixWae as PixWae | undefined)?.PixQrCode : pixErp?.qrCodeUrl;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const onCopiar = async () => {
    if (!pixCode) return;
    await Clipboard.setStringAsync(pixCode);
    Toast.show({ type: 'success', text1: 'Código Pix copiado' });
  };

  const voltarParaLista = () => router.replace('/(tabs)/financeiro');

  return {
    charge,
    isLoading: charge.isWaeCobranca ? isLoading : false,
    timeLeft,
    formatTime,
    pixCode,
    pixQrCodeUri,
    onCopiar,
    voltarParaLista,
  };
}
