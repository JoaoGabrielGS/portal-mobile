import { criptografar } from '@/services/indicacao';
import { useUserStore } from '@/store/user.store';
import { router } from 'expo-router';
import { Alert, Share } from 'react-native';

export function useIndicacao() {
  const cursoSelecionado = useUserStore((s) => s.cursoSelecionado);

  const encryptRa = criptografar(cursoSelecionado?.ra ?? cursoSelecionado?.Ra ?? '');
  const encryptPolo = criptografar(String(cursoSelecionado?.filial?.codigoFilialWae ?? cursoSelecionado?.Polo ?? ''));

  const link = `${process.env.EXPO_PUBLIC_LINK_INDICACAO}polo=${encryptPolo}&matricula=${encryptRa}`;

  const onShare = async () => {
    try {
      await Share.share({
        message: `Você foi indicado por um amigo para iniciar sua Graduação EAD na UniFatecie!\n${link}`,
      });
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    }
  };

  const handleMinhasIndicacoes = () => router.push('/minhas-indicacoes');

  return { onShare, handleMinhasIndicacoes };
}
