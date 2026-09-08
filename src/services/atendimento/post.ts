import { api } from '@/services/api';

type NovoAtendimentoPayload = {
  assuntoId: number;
  alunoId: number;
  matriculaId: number;
  mensagem: string;
  cursoCodigo?: string;
  cursoNome?: string;
};

export const postAtendimento = async (data: NovoAtendimentoPayload) => {
  const { data: response } = await api.post<number>('/atendimento', data, {
    headers: { matriculaId: data.matriculaId },
  });
  return response;
};

export const postMensagem = async (atendimentoId: number, texto: string, matriculaId: number) => {
  await api.post(`/atendimento/${atendimentoId}/mensagem`, { texto }, { headers: { matriculaId } });
};

export const postAnexo = async (atendimentoId: number, file: FormData) => {
  await api.post(`/atendimento/${atendimentoId}/anexo`, file, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
