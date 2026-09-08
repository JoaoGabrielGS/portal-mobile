import {
  createAtendimentoStompClient,
  getAtendimentoById,
  getMensagens,
  Mensagem,
  postAnexo,
  postMensagem,
} from '@/services/atendimento';
import { useAuthStore } from '@/store/auth.store';
import { useUserStore } from '@/store/user.store';
import { Client } from '@stomp/stompjs';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList } from 'react-native';

const ATTENDANT_ID = 2;

export function useChat() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const serviceId = Number(id);
  const cursoSelecionado = useUserStore((s) => s.cursoSelecionado);
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  const flatListRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState<Mensagem[]>([]);
  const [text, setText] = useState('');
  const stompRef = useRef<Client | null>(null);

  const { data: serviceInfo } = useQuery({
    queryKey: ['atendimento.info', serviceId],
    queryFn: () => getAtendimentoById(serviceId),
    enabled: !!serviceId,
  });

  const { data: historico } = useQuery({
    queryKey: ['atendimento.mensagens', serviceId],
    queryFn: () => getMensagens(serviceId, 0),
    enabled: !!serviceId,
  });

  useEffect(() => {
    if (!historico?.content?.length) return;
    const novasMensagens = historico.content.flatMap((grupo) => grupo.mensagens);
    setMessages((prev) => {
      const idsExistentes = new Set(prev.map((m) => m.id));
      const merged = [...novasMensagens.filter((m) => !idsExistentes.has(m.id)), ...prev];
      return merged.sort((a, b) => new Date(a.dataAbertura).getTime() - new Date(b.dataAbertura).getTime());
    });
  }, [historico]);

  useEffect(() => {
    if (!token || !serviceId) return;

    const client = createAtendimentoStompClient(token);
    client.onConnect = () => {
      client.subscribe(`/topic/atendimento.replies.${serviceId}`, (frame) => {
        try {
          const parsed = JSON.parse(frame.body);
          const msg: Mensagem = parsed.content ?? parsed;
          setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
          if (msg.origemUsuario) {
            client.publish({ destination: `/mensagem/${msg.id}/visualizar` });
          }
        } catch {
          // ignora payload malformado
        }
      });

      client.subscribe(`/topic/deletedMessage.${serviceId}`, (frame) => {
        try {
          const parsed = JSON.parse(frame.body);
          const deletedId: number = parsed.content ?? parsed;
          setMessages((prev) => prev.filter((m) => m.id !== deletedId));
        } catch {
          // ignora payload malformado
        }
      });
    };

    client.activate();
    stompRef.current = client;

    return () => {
      client.deactivate();
      stompRef.current = null;
    };
  }, [token, serviceId]);

  const scrollToBottom = useCallback(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, []);

  const sendMessage = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const client = stompRef.current;
    const isWae = !!cursoSelecionado?.Ra;
    const matriculaId = cursoSelecionado?.matriculaId ?? cursoSelecionado?.id ?? 0;

    if (isWae && client?.connected) {
      client.publish({
        destination: `/app/chat/${serviceId}`,
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          mensagem: { texto: trimmed },
          waeMatriculaDisciplina: cursoSelecionado?.Ra,
          recipientId: String(ATTENDANT_ID),
          senderId: cursoSelecionado?.Ra,
        }),
      });
    } else {
      await postMensagem(serviceId, trimmed, matriculaId);
    }

    setText('');
  };

  const handleSendFile = async (formData: FormData) => {
    await postAnexo(serviceId, formData);
  };

  const refreshAfterAction = () => {
    queryClient.invalidateQueries({ queryKey: ['atendimento.info', serviceId] });
    queryClient.invalidateQueries({ queryKey: ['atendimento.mensagens', serviceId] });
    queryClient.invalidateQueries({ queryKey: ['atendimentos'] });
  };

  return {
    serviceId,
    serviceInfo,
    messages,
    flatListRef,
    scrollToBottom,
    text,
    setText,
    sendMessage,
    handleSendFile,
    refreshAfterAction,
  };
}
