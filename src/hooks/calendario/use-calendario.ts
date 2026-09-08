import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  format,
  isSameDay,
  isSameMonth,
  isToday,
} from 'date-fns';
import { useUserStore } from '@/store/user.store';
import { getEventos, CalendarioEvento } from '@/services/calendario';

export type ViewMode = 'week' | 'month';

export function useCalendario() {
  const cursoSelecionado = useUserStore((s) => s.cursoSelecionado);
  const matriculaId = cursoSelecionado?.matriculaId ?? cursoSelecionado?.id;

  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 0 }));
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const monthRangeStart = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
  const monthRangeEnd = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 });
  const currentWeekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 0 });

  const { data: eventosMes = [], isLoading: loadingMes } = useQuery({
    queryKey: ['calendario-mes', format(monthRangeStart, 'yyyy-MM-dd'), format(monthRangeEnd, 'yyyy-MM-dd'), matriculaId],
    queryFn: () => getEventos(matriculaId!, monthRangeStart, monthRangeEnd),
    enabled: !!matriculaId && viewMode === 'month',
  });

  const { data: eventosSemana = [], isLoading: loadingSemana } = useQuery({
    queryKey: ['calendario-semana', format(currentWeekStart, 'yyyy-MM-dd'), format(currentWeekEnd, 'yyyy-MM-dd'), matriculaId],
    queryFn: () => getEventos(matriculaId!, currentWeekStart, currentWeekEnd),
    enabled: !!matriculaId && viewMode === 'week',
  });

  const isLoading = viewMode === 'month' ? loadingMes : loadingSemana;
  const eventos = viewMode === 'month' ? eventosMes : eventosSemana;

  const calendarDays: Date[] = useMemo(
    () => eachDayOfInterval({ start: monthRangeStart, end: monthRangeEnd }),
    [monthRangeStart, monthRangeEnd],
  );

  const weekDays: Date[] = useMemo(
    () => eachDayOfInterval({ start: currentWeekStart, end: currentWeekEnd }),
    [currentWeekStart, currentWeekEnd],
  );

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarioEvento[]>();
    for (const ev of eventos) {
      const key = ev.instanteInicio?.slice(0, 10);
      if (!key) continue;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ev);
    }
    return map;
  }, [eventos]);

  const selectedEvents: CalendarioEvento[] = useMemo(() => {
    const key = format(selectedDate, 'yyyy-MM-dd');
    return eventsByDate.get(key) ?? [];
  }, [selectedDate, eventsByDate]);

  const goToPrevMonth = () => setCurrentMonth((d) => subMonths(d, 1));
  const goToNextMonth = () => setCurrentMonth((d) => addMonths(d, 1));
  const goToPrevWeek = () => setCurrentWeekStart((d) => subWeeks(d, 1));
  const goToNextWeek = () => setCurrentWeekStart((d) => addWeeks(d, 1));

  const hasEvents = (day: Date) => eventsByDate.has(format(day, 'yyyy-MM-dd'));
  const isCurrentMonth = (day: Date) => isSameMonth(day, currentMonth);
  const isSelected = (day: Date) => isSameDay(day, selectedDate);
  const isDayToday = (day: Date) => isToday(day);

  return {
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
    selectDate: setSelectedDate,
  };
}
