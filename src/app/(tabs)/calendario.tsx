import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTheme } from '@/hooks/use-theme';
import { useCalendario } from '@/hooks/calendario/use-calendario';
import { Text } from '@/components/ui/text';
import { CalendarioEvento } from '@/services/calendario';

const DIAS_SEMANA_ABREV = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const DIAS_SEMANA_FULL = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function EventCard({ item, colors }: { item: CalendarioEvento; colors: any }) {
  const hora = (iso: string) => iso?.slice(11, 16);

  return (
    <View style={[styles.eventCard, { backgroundColor: colors.card, borderLeftColor: colors.primary }]}>
      <Text variant="label" style={{ color: colors.text }} numberOfLines={2}>
        {item.nome}
      </Text>
      {item.instanteInicio && item.instanteFim && (
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
          <Text variant="caption" style={{ color: colors.textSecondary, marginLeft: 4 }}>
            {hora(item.instanteInicio)} – {hora(item.instanteFim)}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function CalendarioScreen() {
  const { colors, spacing } = useTheme();
  const {
    viewMode,
    setViewMode,
    currentMonth,
    currentWeekStart,
    currentWeekEnd,
    calendarDays,
    weekDays,
    selectedDate,
    selectedEvents,
    isLoading,
    eventsByDate,
    goToPrevMonth,
    goToNextMonth,
    goToPrevWeek,
    goToNextWeek,
    hasEvents,
    isCurrentMonth,
    isSelected,
    isDayToday,
    selectDate,
  } = useCalendario();

  const mesLabel = MESES[currentMonth.getMonth()];
  const anoLabel = currentMonth.getFullYear();

  const weekLabel =
    format(currentWeekStart, 'dd MMM', { locale: ptBR }) +
    ' – ' +
    format(currentWeekEnd, 'dd MMM yyyy', { locale: ptBR });

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.primary, paddingHorizontal: spacing.md }]}>
        <Text variant="subtitle" style={{ color: colors.textInverse, fontWeight: '700' }}>
          Calendário
        </Text>

        <View style={[styles.toggle, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'week' && styles.toggleBtnActive]}
            onPress={() => setViewMode('week')}
          >
            <Text variant="caption" style={{ color: viewMode === 'week' ? colors.primary : colors.textInverse, fontWeight: '600' }}>
              Semana
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'month' && styles.toggleBtnActive]}
            onPress={() => setViewMode('month')}
          >
            <Text variant="caption" style={{ color: viewMode === 'month' ? colors.primary : colors.textInverse, fontWeight: '600' }}>
              Mês
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {viewMode === 'month' ? (
        <View style={{ flex: 1 }}>
          <View style={[styles.navRow, { paddingHorizontal: spacing.md, paddingVertical: spacing.sm }]}>
            <TouchableOpacity onPress={goToPrevMonth} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="chevron-back" size={22} color={colors.primary} />
            </TouchableOpacity>
            <Text variant="subtitle" style={{ color: colors.text, fontWeight: '700' }}>
              {mesLabel} {anoLabel}
            </Text>
            <TouchableOpacity onPress={goToNextMonth} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="chevron-forward" size={22} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={[styles.weekRow, { paddingHorizontal: spacing.md }]}>
            {DIAS_SEMANA_ABREV.map((d, i) => (
              <View key={i} style={[styles.dayCell, { paddingVertical: 6 }]}>
                <Text variant="caption" style={{ color: colors.textSecondary, fontWeight: '600', textAlign: 'center' }}>
                  {d}
                </Text>
              </View>
            ))}
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {isLoading ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: 24 }} />
          ) : (
            <View style={[styles.grid, { paddingHorizontal: spacing.md }]}>
              {calendarDays.map((day, i) => {
                const inMonth = isCurrentMonth(day);
                const selected = isSelected(day);
                const today = isDayToday(day);
                const hasEv = hasEvents(day);
                return (
                  <TouchableOpacity key={i} style={styles.dayCell} onPress={() => selectDate(day)} activeOpacity={0.7}>
                    <View
                      style={[
                        styles.dayInner,
                        selected && { backgroundColor: colors.primary },
                        today && !selected && { borderWidth: 1.5, borderColor: colors.primary },
                      ]}
                    >
                      <Text
                        variant="caption"
                        style={{
                          color: selected ? colors.textInverse : inMonth ? colors.text : colors.border,
                          fontWeight: today || selected ? '700' : '400',
                          textAlign: 'center',
                        }}
                      >
                        {day.getDate()}
                      </Text>
                    </View>
                    {hasEv && (
                      <View style={[styles.dot, { backgroundColor: selected ? colors.textInverse : colors.primary }]} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          <View style={[styles.divider, { backgroundColor: colors.border, marginTop: spacing.sm }]} />

          <View style={[styles.eventHeader, { paddingHorizontal: spacing.md, paddingTop: spacing.sm }]}>
            <Text variant="label" style={{ color: colors.primary }}>
              {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
            </Text>
          </View>

          <FlatList
            data={selectedEvents}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text variant="caption" style={{ color: colors.textSecondary, marginTop: spacing.sm, textAlign: 'center' }}>
                Nenhum evento neste dia
              </Text>
            }
            renderItem={({ item }: { item: CalendarioEvento }) => <EventCard item={item} colors={colors} />}
          />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={[styles.navRow, { paddingHorizontal: spacing.md, paddingVertical: spacing.sm }]}>
            <TouchableOpacity onPress={goToPrevWeek} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="chevron-back" size={22} color={colors.primary} />
            </TouchableOpacity>
            <Text variant="label" style={{ color: colors.text, fontWeight: '700' }}>
              {weekLabel}
            </Text>
            <TouchableOpacity onPress={goToNextWeek} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="chevron-forward" size={22} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={[styles.weekRow, { paddingHorizontal: spacing.md, marginBottom: 0 }]}>
            {weekDays.map((day, i) => {
              const selected = isSelected(day);
              const today = isDayToday(day);
              const hasEv = hasEvents(day);
              return (
                <TouchableOpacity key={i} style={styles.dayCell} onPress={() => selectDate(day)} activeOpacity={0.7}>
                  <Text variant="caption" style={{ color: colors.textSecondary, fontWeight: '600', textAlign: 'center', marginBottom: 4 }}>
                    {DIAS_SEMANA_FULL[i]}
                  </Text>
                  <View
                    style={[
                      styles.dayInner,
                      selected && { backgroundColor: colors.primary },
                      today && !selected && { borderWidth: 1.5, borderColor: colors.primary },
                    ]}
                  >
                    <Text
                      variant="caption"
                      style={{
                        color: selected ? colors.textInverse : colors.text,
                        fontWeight: today || selected ? '700' : '400',
                        textAlign: 'center',
                      }}
                    >
                      {day.getDate()}
                    </Text>
                  </View>
                  {hasEv && (
                    <View style={[styles.dot, { backgroundColor: selected ? colors.textInverse : colors.primary }]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border, marginTop: 8 }]} />

          {isLoading ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: 24 }} />
          ) : (
            <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
              {weekDays.map((day) => {
                const key = format(day, 'yyyy-MM-dd');
                const dayEvents = eventsByDate.get(key) ?? [];
                const today = isDayToday(day);
                const selected = isSelected(day);
                const diaNome = DIAS_SEMANA_FULL[day.getDay()];
                return (
                  <View key={key} style={{ marginBottom: spacing.md }}>
                    <TouchableOpacity onPress={() => selectDate(day)} activeOpacity={0.7}>
                      <View style={styles.weekDayHeader}>
                        <View
                          style={[
                            styles.weekDayBadge,
                            selected && { backgroundColor: colors.primary },
                            today && !selected && { borderWidth: 1.5, borderColor: colors.primary },
                          ]}
                        >
                          <Text
                            variant="caption"
                            style={{
                              color: selected ? colors.textInverse : today ? colors.primary : colors.text,
                              fontWeight: '700',
                              fontSize: 13,
                            }}
                          >
                            {day.getDate()}
                          </Text>
                        </View>
                        <Text
                          variant="label"
                          style={{
                            color: selected || today ? colors.primary : colors.textSecondary,
                            marginLeft: 8,
                            fontWeight: selected || today ? '700' : '400',
                          }}
                        >
                          {diaNome}
                        </Text>
                        {dayEvents.length > 0 && (
                          <View style={[styles.countBadge, { backgroundColor: colors.primary }]}>
                            <Text variant="caption" style={{ color: colors.textInverse, fontSize: 10, fontWeight: '700' }}>
                              {dayEvents.length}
                            </Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>

                    {dayEvents.length === 0 ? (
                      <Text variant="caption" style={{ color: colors.border, marginLeft: 46, marginTop: 4 }}>
                        Sem eventos
                      </Text>
                    ) : (
                      dayEvents.map((ev) => <EventCard key={ev.id} item={ev} colors={colors} />)
                    )}
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingTop: 12, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  toggle: { flexDirection: 'row', borderRadius: 8, overflow: 'hidden' },
  toggleBtn: { paddingHorizontal: 12, paddingVertical: 6 },
  toggleBtnActive: { backgroundColor: '#FFFFFF' },
  navRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  weekRow: { flexDirection: 'row', marginBottom: 4 },
  dayCell: { width: '14.28%', alignItems: 'center', paddingVertical: 8 },
  dayInner: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 5, height: 5, borderRadius: 3, marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  divider: { height: 1 },
  eventHeader: { paddingBottom: 8 },
  eventCard: { borderRadius: 8, padding: 12, marginTop: 8, borderLeftWidth: 3 },
  metaItem: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  weekDayHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  weekDayBadge: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  countBadge: { marginLeft: 'auto', width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
});
