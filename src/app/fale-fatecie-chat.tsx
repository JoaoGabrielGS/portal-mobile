import { useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { useTheme } from '@/hooks/use-theme';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useChat } from '@/hooks/atendimento/use-chat';
import { Mensagem } from '@/services/atendimento';
import { ATENDIMENTO_STATUS, ATENDIMENTO_STATUS_STYLE } from '@/utils/atendimento-status';
import { finalizarAtendimento, reabrirAtendimento, avaliarAtendimento } from '@/services/atendimento';

const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'];

function MessageBubble({ message, colors }: { message: Mensagem; colors: any }) {
  const isAutomatic = !!message.mensagemAutomatica;
  const isOutgoing = !message.origemUsuario && !isAutomatic;
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  if (isAutomatic) {
    return (
      <View style={[styles.automaticBubble, { backgroundColor: colors.surface }]}>
        <Text variant="caption" style={{ color: colors.textSecondary, textAlign: 'center' }}>
          {message.texto?.replace(/<[^>]*>/g, '') ?? ''}
        </Text>
      </View>
    );
  }

  const arquivo = message.arquivoLinks?.[0] ?? message.arquivoLink;
  const ext = arquivo?.mensagemLink?.split('.').pop() ?? '';
  const isImage = IMAGE_EXTENSIONS.includes(ext);

  const bubbleStyle = isOutgoing
    ? { backgroundColor: colors.primary, alignSelf: 'flex-end' as const }
    : { backgroundColor: colors.card, alignSelf: 'flex-start' as const };
  const textColor = isOutgoing ? colors.textInverse : colors.text;

  return (
    <View style={[styles.bubble, bubbleStyle]}>
      {arquivo ? (
        isImage ? (
          <TouchableOpacity onPress={() => setPreviewUri(arquivo.mensagemLink)}>
            <Text variant="caption" style={{ color: textColor, marginBottom: 6, textAlign: 'center' }}>
              {message.texto}
            </Text>
            <View style={styles.viewImageBtn}>
              <Text variant="caption" style={{ color: textColor, fontWeight: '700' }}>Ver Imagem</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => Linking.openURL(arquivo.mensagemLink)}>
            <Text variant="body" style={{ color: textColor, textDecorationLine: 'underline' }}>{message.texto}</Text>
          </TouchableOpacity>
        )
      ) : (
        <Text variant="body" style={{ color: textColor }}>{message.texto}</Text>
      )}
      <Text variant="caption" style={{ color: isOutgoing ? 'rgba(255,255,255,0.7)' : colors.textSecondary, textAlign: 'right', marginTop: 4 }}>
        {format(new Date(message.dataAbertura), 'HH:mm')}
      </Text>

      <Modal visible={!!previewUri} transparent>
        <TouchableOpacity style={styles.previewOverlay} onPress={() => setPreviewUri(null)} activeOpacity={1}>
          {previewUri && <Image source={{ uri: previewUri }} style={styles.previewImage} resizeMode="contain" />}
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

export default function FaleFatecieChatScreen() {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const { serviceId, serviceInfo, messages, flatListRef, scrollToBottom, text, setText, sendMessage, handleSendFile, refreshAfterAction } =
    useChat();

  const [arquivoPendente, setArquivoPendente] = useState<{ uri: string; nome: string; tipo: string } | null>(null);
  const [rating, setRating] = useState(0);

  const ultimaMensagem = messages[messages.length - 1];
  const isResolvido =
    ultimaMensagem?.mensagemAutomatica && ultimaMensagem.texto?.toLowerCase().includes('resolvido');
  const isFinalizado = serviceInfo?.status?.id === ATENDIMENTO_STATUS.FINALIZADO;
  const statusStyle = serviceInfo?.status?.id ? ATENDIMENTO_STATUS_STYLE[serviceInfo.status.id] : null;

  const handlePickImage = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) return;

    const resultado = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (resultado.canceled || !resultado.assets[0]) return;

    const asset = resultado.assets[0];
    setArquivoPendente({
      uri: asset.uri,
      nome: asset.fileName ?? 'imagem.jpg',
      tipo: asset.mimeType ?? 'image/jpeg',
    });
  };

  const confirmarEnvioArquivo = async () => {
    if (!arquivoPendente) return;
    const formData = new FormData();
    formData.append('arquivo', { uri: arquivoPendente.uri, name: arquivoPendente.nome, type: arquivoPendente.tipo } as any);

    try {
      await handleSendFile(formData);
      Toast.show({ type: 'success', text1: 'Arquivo enviado com sucesso!' });
      refreshAfterAction();
    } catch {
      Toast.show({ type: 'error', text1: 'Erro ao enviar o arquivo' });
    } finally {
      setArquivoPendente(null);
    }
  };

  const handleReabrir = async () => {
    await reabrirAtendimento(serviceId);
    refreshAfterAction();
    Toast.show({ type: 'success', text1: 'Atendimento reaberto com sucesso!' });
  };

  const handleFinalizar = async () => {
    await finalizarAtendimento(serviceId);
    refreshAfterAction();
    Toast.show({ type: 'success', text1: 'Atendimento finalizado com sucesso!' });
  };

  const handleAvaliar = async () => {
    if (rating === 0) return;
    await avaliarAtendimento(serviceId, rating, undefined);
    refreshAfterAction();
    Toast.show({ type: 'success', text1: 'Atendimento avaliado com sucesso!' });
    setTimeout(() => router.back(), 1200);
  };

  const canSend = !!text.trim();

  return (
    <KeyboardAvoidingView
      style={[styles.safe, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
    >
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.background }}>
        <View style={[styles.topBar, { borderBottomColor: colors.border, paddingHorizontal: spacing.md }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Text variant="label" numberOfLines={1}>Atendimento #{serviceId}</Text>
            {!!serviceInfo?.assunto?.tema?.nome && (
              <Text variant="caption" style={{ color: colors.textSecondary }} numberOfLines={1}>
                {serviceInfo.assunto.tema.nome} • {serviceInfo.assunto.nome}
              </Text>
            )}
          </View>
          {statusStyle && (
            <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
              <Text variant="caption" style={{ color: statusStyle.text, fontWeight: '700' }}>{statusStyle.label}</Text>
            </View>
          )}
        </View>
      </SafeAreaView>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: spacing.md }}
        onContentSizeChange={scrollToBottom}
        renderItem={({ item }) => <MessageBubble message={item} colors={colors} />}
        ListFooterComponent={
          <>
            {isResolvido && (
              <View style={[styles.actionCard, { backgroundColor: colors.surface, marginTop: spacing.md }]}>
                <Text variant="label" style={{ textAlign: 'center', marginBottom: spacing.sm }}>
                  Atendimento Resolvido
                </Text>
                <Text variant="caption" style={{ color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.md }}>
                  Se concorda com a solução, finalize. Se não, reabra para continuar o atendimento.
                </Text>
                <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                  <Button label="Reabrir" variant="outline" onPress={handleReabrir} style={{ flex: 1 }} />
                  <Button label="Finalizar" onPress={handleFinalizar} style={{ flex: 1 }} />
                </View>
              </View>
            )}

            {isFinalizado && (
              <View style={[styles.actionCard, { backgroundColor: colors.surface, marginTop: spacing.md }]}>
                <Text variant="label" style={{ textAlign: 'center', marginBottom: spacing.sm }}>
                  Avalie este atendimento
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4 }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <TouchableOpacity key={n} onPress={() => setRating(n)}>
                      <Ionicons name={n <= rating ? 'star' : 'star-outline'} size={28} color={colors.primary} />
                    </TouchableOpacity>
                  ))}
                </View>
                {!serviceInfo?.avaliacao && (
                  <Button label="Concluir" onPress={handleAvaliar} disabled={rating === 0} style={{ marginTop: spacing.md }} />
                )}
              </View>
            )}
          </>
        }
      />

      {!isFinalizado && (
        <View style={[styles.inputBar, { borderTopColor: colors.border, paddingBottom: spacing.sm + insets.bottom }]}>
          <TouchableOpacity onPress={handlePickImage} style={{ padding: 8 }}>
            <Ionicons name="attach" size={22} color={colors.textSecondary} />
          </TouchableOpacity>

          <TextInput
            multiline
            value={text}
            onChangeText={setText}
            placeholder="Digite sua mensagem..."
            placeholderTextColor={colors.textSecondary}
            style={[styles.textInput, { backgroundColor: colors.surface, color: colors.text }]}
          />

          <TouchableOpacity
            onPress={sendMessage}
            disabled={!canSend}
            style={[styles.sendBtn, { backgroundColor: canSend ? colors.primary : colors.disabled }]}
          >
            <Ionicons name="send" size={16} color={colors.textInverse} />
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={!!arquivoPendente} transparent animationType="fade">
        <View style={styles.confirmOverlay}>
          <View style={[styles.confirmBox, { backgroundColor: colors.surface }]}>
            <Text variant="subtitle" style={{ textAlign: 'center' }}>Envio de Arquivo</Text>
            <Text variant="body" style={{ textAlign: 'center', marginTop: spacing.sm }}>
              Tem certeza que deseja enviar este arquivo?
            </Text>
            <Text variant="caption" style={{ textAlign: 'center', marginTop: spacing.xs, color: colors.textSecondary }}>
              {arquivoPendente?.nome}
            </Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg }}>
              <Button label="Cancelar" variant="outline" onPress={() => setArquivoPendente(null)} style={{ flex: 1 }} />
              <Button label="Enviar" onPress={confirmarEnvioArquivo} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  bubble: { maxWidth: '78%', borderRadius: 16, padding: 10, marginVertical: 4 },
  automaticBubble: { alignSelf: 'center', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6, marginVertical: 8, maxWidth: '80%' },
  viewImageBtn: { backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'center' },
  previewOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', alignItems: 'center', justifyContent: 'center' },
  previewImage: { width: '100%', height: '80%' },
  actionCard: { borderRadius: 10, padding: 16 },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 8, paddingTop: 8, borderTopWidth: 1 },
  textInput: { flex: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10, maxHeight: 100, marginHorizontal: 6 },
  sendBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  confirmOverlay: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 24 },
  confirmBox: { borderRadius: 12, padding: 20, width: '100%' },
});
