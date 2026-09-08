import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export const createAtendimentoStompClient = (token: string) => {
  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  return new Client({
    webSocketFactory: () => new SockJS(`${baseUrl}/ws`),
    connectHeaders: { Authorization: `Bearer ${token}` },
    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
  });
};
