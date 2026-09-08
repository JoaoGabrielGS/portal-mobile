import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { Text } from '@/components/ui/text';
import { usePerfil, THEME_OPTIONS } from '@/hooks/perfil/use-perfil';
import { Curso } from '@/store/user.store';

export default function PerfilScreen() {
  const { colors, spacing } = useTheme();
  const {
    cursoSelecionado,
    cursos,
    mode,
    setMode,
    nome,
    email,
    iniciais,
    temaAtual,
    modalCurso,
    setModalCurso,
    modalTema,
    setModalTema,
    modalLogout,
    setModalLogout,
    modalCarteirinha,
    setModalCarteirinha,
    carteirinha,
    carregandoCarteirinha,
    carteirinhaVirada,
    virarCarteirinha,
    onLogout,
    onSelecionarCurso,
    onAbrirCarteirinha,
  } = usePerfil();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        <View style={[styles.header, { backgroundColor: colors.surface, paddingVertical: spacing.xl }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text variant="title" style={{ color: '#FFF', fontSize: 28 }}>{iniciais}</Text>
          </View>
          <Text variant="subtitle" style={{ color: colors.text, marginTop: spacing.md, textAlign: 'center' }}>
            {nome}
          </Text>
          {!!email && (
            <Text variant="caption" style={{ color: colors.textSecondary, marginTop: 4 }}>{email}</Text>
          )}
        </View>

        {!!cursoSelecionado && (
          <View style={[styles.cursoCard, { backgroundColor: colors.card, marginHorizontal: spacing.md, marginTop: spacing.md }]}>
            <Text variant="caption" style={{ color: colors.textSecondary }}>Curso Atual</Text>
            <Text variant="label" style={{ color: colors.text, marginTop: 4 }}>
              {cursoSelecionado.curriculo?.curso?.nome ?? cursoSelecionado.CursoNome}
            </Text>
            <Text variant="caption" style={{ color: colors.textSecondary, marginTop: 2 }}>
              RA: {cursoSelecionado.ra ?? cursoSelecionado.Ra}
            </Text>
          </View>
        )}

        <View style={[styles.menu, { marginTop: spacing.lg, marginHorizontal: spacing.md, backgroundColor: colors.surface, borderRadius: 12 }]}>
          <MenuItem icon="person-outline" label="Minha Conta" colors={colors} onPress={() => router.push('/minha-conta')} />
          <Divider color={colors.border} />

          <MenuItem
            icon="card-outline"
            label="Carteirinha de Estudante"
            colors={colors}
            onPress={onAbrirCarteirinha}
          />
          <Divider color={colors.border} />

          <MenuItem
            icon="swap-horizontal-outline"
            label="Trocar Matrícula"
            colors={colors}
            onPress={() => (cursos.length > 1 ? setModalCurso(true) : undefined)}
            disabled={cursos.length <= 1}
            hint={cursos.length <= 1 ? 'Apenas 1 matrícula disponível' : undefined}
          />
          <Divider color={colors.border} />

          <MenuItem icon="people-outline" label="Indicações" colors={colors} onPress={() => router.push('/indicacao')} />
          <Divider color={colors.border} />

          <MenuItem
            icon={temaAtual?.icon ?? 'phone-portrait-outline'}
            label="Aparência"
            value={temaAtual?.label}
            colors={colors}
            onPress={() => setModalTema(true)}
          />
          <Divider color={colors.border} />

          <MenuItem
            icon="log-out-outline"
            label="Sair da Conta"
            colors={colors}
            labelColor={colors.error}
            onPress={() => setModalLogout(true)}
          />
        </View>
      </ScrollView>

      <Modal visible={modalCurso} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: colors.surface }]}>
            <Text variant="subtitle" style={{ color: colors.text, textAlign: 'center', marginBottom: spacing.lg }}>
              Selecionar Matrícula
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {cursos.map((curso: Curso, i: number) => (
                <TouchableOpacity
                  key={curso.id ?? curso.CursoNome ?? i}
                  style={[styles.cursoItem, { borderBottomColor: colors.border, borderBottomWidth: i < cursos.length - 1 ? 1 : 0 }]}
                  onPress={() => onSelecionarCurso(curso)}
                  activeOpacity={0.7}
                >
                  <Text variant="label" style={{ color: colors.primary }} numberOfLines={2}>
                    {curso.curriculo?.curso?.nome ?? curso.CursoNome}
                  </Text>
                  <Text variant="caption" style={{ color: colors.textSecondary, marginTop: 4 }}>
                    RA: {curso.ra ?? curso.Ra}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={[styles.cancelBtn, { borderTopColor: colors.border }]} onPress={() => setModalCurso(false)}>
              <Text variant="label" style={{ color: colors.textSecondary }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={modalTema} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: colors.surface }]}>
            <Text variant="subtitle" style={{ color: colors.text, textAlign: 'center', marginBottom: spacing.lg }}>
              Aparência
            </Text>
            {THEME_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.temaItem, { borderBottomColor: colors.border }]}
                onPress={() => {
                  setMode(opt.value);
                  setModalTema(false);
                }}
                activeOpacity={0.7}
              >
                <Ionicons name={opt.icon} size={22} color={mode === opt.value ? colors.primary : colors.textSecondary} />
                <Text variant="label" style={{ color: mode === opt.value ? colors.primary : colors.text, marginLeft: 12, flex: 1 }}>
                  {opt.label}
                </Text>
                {mode === opt.value && <Ionicons name="checkmark" size={20} color={colors.primary} />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={[styles.cancelBtn, { borderTopColor: colors.border }]} onPress={() => setModalTema(false)}>
              <Text variant="label" style={{ color: colors.textSecondary }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={modalLogout} transparent animationType="fade">
        <View style={[styles.modalOverlay, { justifyContent: 'center', paddingHorizontal: spacing.xl }]}>
          <View style={[styles.logoutDialog, { backgroundColor: colors.surface }]}>
            <Text variant="subtitle" style={{ color: colors.text, textAlign: 'center' }}>Sair da Conta</Text>
            <Text variant="body" style={{ color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm }}>
              Tem certeza que deseja sair?
            </Text>
            <View style={[styles.logoutBtns, { marginTop: spacing.lg }]}>
              <TouchableOpacity style={[styles.logoutBtn, { borderColor: colors.border, borderWidth: 1 }]} onPress={() => setModalLogout(false)}>
                <Text variant="label" style={{ color: colors.text }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: colors.error }]} onPress={onLogout}>
                <Text variant="label" style={{ color: '#FFF' }}>Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={modalCarteirinha} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: colors.surface, maxHeight: '90%', paddingHorizontal: spacing.sm }]}>
            <Text variant="subtitle" style={{ color: colors.text, textAlign: 'center', marginBottom: spacing.md }}>
              Carteirinha de Estudante
            </Text>

            {carregandoCarteirinha ? (
              <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.xl }} />
            ) : (
              <Image
                source={{ uri: `data:image/png;base64,${carteirinhaVirada ? carteirinha?.verso : carteirinha?.frente}` }}
                style={styles.carteirinhaImg}
                resizeMode="contain"
              />
            )}

            <TouchableOpacity style={[styles.cancelBtn, { borderTopColor: colors.border }]} onPress={virarCarteirinha}>
              <Text variant="label" style={{ color: colors.primary }}>{carteirinhaVirada ? 'Ver Frente' : 'Ver Verso'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.cancelBtn, { borderTopColor: colors.border }]} onPress={() => setModalCarteirinha(false)}>
              <Text variant="label" style={{ color: colors.textSecondary }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function MenuItem({
  icon,
  label,
  value,
  colors,
  labelColor,
  onPress,
  disabled,
  hint,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  colors: any;
  labelColor?: string;
  onPress: () => void;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={disabled ? 1 : 0.7}>
      <Ionicons name={icon} size={22} color={labelColor ?? colors.primary} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text variant="label" style={{ color: labelColor ?? colors.text }}>{label}</Text>
        {!!hint && (
          <Text variant="caption" style={{ color: colors.textSecondary, marginTop: 2 }}>{hint}</Text>
        )}
      </View>
      {value && (
        <Text variant="caption" style={{ color: colors.textSecondary, marginRight: 6 }}>{value}</Text>
      )}
      {!disabled && <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />}
    </TouchableOpacity>
  );
}

function Divider({ color }: { color: string }) {
  return <View style={[styles.divider, { backgroundColor: color }]} />;
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { alignItems: 'center', paddingHorizontal: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  cursoCard: { padding: 14, borderRadius: 10 },
  menu: { overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  divider: { height: 1, marginLeft: 50 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContainer: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, maxHeight: '70%' },
  cursoItem: { paddingVertical: 16 },
  temaItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1 },
  cancelBtn: { borderTopWidth: 1, paddingTop: 16, marginTop: 8, alignItems: 'center' },
  logoutDialog: { borderRadius: 16, padding: 24 },
  logoutBtns: { flexDirection: 'row', gap: 12 },
  logoutBtn: { flex: 1, height: 44, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  carteirinhaImg: { width: '100%', height: 420 },
});
