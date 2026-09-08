import { minhaContaSchema, MinhaContaFormSchema } from '@/schemas/perfil/minha-conta.schema';
import { removeAvatar, updatePessoa, uploadAvatar } from '@/services/pessoa';
import { useUserStore } from '@/store/user.store';
import { formatPhone } from '@/utils/format';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';

const transformPessoa = (pessoa: any, data: MinhaContaFormSchema) => ({
  nome: data.nome,
  email: {
    id: pessoa?.email?.id,
    valor: data.email,
    nomeResponsavel: pessoa?.email?.nomeResponsavel || '',
    cargoId: pessoa?.email?.cargo?.id || 0,
    tipoContatoId: pessoa?.email?.tipoContato?.id || 0,
  },
  telefone: {
    id: pessoa?.telefone?.id,
    valor: data.telefone,
    nomeResponsavel: pessoa?.telefone?.nomeResponsavel || '',
    cargoId: pessoa?.telefone?.cargo?.id || 0,
    tipoContatoId: pessoa?.telefone?.tipoContato?.id || 0,
  },
  nascimento: pessoa?.nascimento,
  estadoCivilId: pessoa?.estadoCivil?.id || 0,
  endereco: pessoa?.endereco
    ? {
        id: pessoa.endereco.id || 0,
        logradouro: pessoa.endereco.logradouro || '',
        cep: pessoa.endereco.cep || '',
        bairro: pessoa.endereco.bairro || '',
        numero: pessoa.endereco.numero || '',
        complemento: pessoa.endereco.complemento || '',
        cidadeId: pessoa.endereco.cidade?.id || 0,
        ufId: pessoa.endereco.uf?.id || 0,
        paisId: pessoa.endereco.pais?.id || 0,
        tipoEnderecoId: pessoa.endereco.tipoEndereco?.id || 0,
      }
    : undefined,
  avatarUrl: pessoa?.avatarUrl,
});

export function useMinhaConta() {
  const { pessoa, cursoSelecionado, setPessoa } = useUserStore();
  const [isEdit, setIsEdit] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<MinhaContaFormSchema>({
    mode: 'onChange',
    defaultValues: {
      nome: pessoa?.nome ?? '',
      email: pessoa?.email?.valor ?? '',
      telefone: pessoa?.telefone?.valor ? formatPhone(pessoa.telefone.valor) : '',
    },
    resolver: zodResolver(minhaContaSchema),
  });

  const { mutateAsync: salvarPessoa, isPending } = useMutation({
    mutationKey: ['perfil.updatePessoa'],
    mutationFn: updatePessoa,
    onError: () => Alert.alert('Erro', 'Não foi possível atualizar o usuário.'),
  });

  const onSubmit = async (data: MinhaContaFormSchema) => {
    const payload = transformPessoa(pessoa, data);
    try {
      await salvarPessoa(payload);
      setPessoa({
        ...pessoa,
        nome: data.nome,
        email: { ...pessoa?.email, valor: data.email },
        telefone: { ...pessoa?.telefone, valor: data.telefone },
      });
      Toast.show({ type: 'success', text1: 'Sucesso', text2: 'Usuário atualizado com sucesso.' });
      setIsEdit(false);
    } catch {
      // erro já tratado no onError da mutation
    }
  };

  const handleSelecionarFoto = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso às suas fotos para alterar o avatar.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (resultado.canceled || !resultado.assets[0]) return;

    const asset = resultado.assets[0];
    const previousAvatarUrl = pessoa?.avatarUrl;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', {
        uri: asset.uri,
        name: asset.fileName ?? 'avatar.jpg',
        type: asset.mimeType ?? 'image/jpeg',
      } as any);

      const novaUrl = await uploadAvatar(formData);
      setPessoa({ ...pessoa, avatarUrl: novaUrl });

      const payload = transformPessoa({ ...pessoa, avatarUrl: novaUrl }, form.getValues());
      await salvarPessoa(payload);

      Toast.show({ type: 'success', text1: 'Sucesso', text2: 'Imagem enviada com sucesso' });
    } catch {
      setPessoa({ ...pessoa, avatarUrl: previousAvatarUrl });
      Alert.alert('Erro', 'Ocorreu um erro ao enviar a imagem.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoverFoto = async () => {
    try {
      await removeAvatar();
      setPessoa({ ...pessoa, avatarUrl: '' });
      Toast.show({ type: 'success', text1: 'Sucesso', text2: 'Foto removida com sucesso.' });
    } catch {
      Alert.alert('Erro', 'Não foi possível remover a foto.');
    }
  };

  return {
    pessoa,
    cursoSelecionado,
    isEdit,
    setIsEdit,
    form,
    onSubmit,
    isPending,
    isUploading,
    handleSelecionarFoto,
    handleRemoverFoto,
  };
}
