export const months = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export const formatBRL = (value: number) =>
  value?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? '-';

export const formatDate = (isoString?: string) => {
  if (!isoString) return '-';
  const date = new Date(isoString);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatMonthLabel = (isoString?: string) => {
  if (!isoString) return '-';
  return months[new Date(isoString).getUTCMonth()];
};

export const formatPhone = (phone?: string) =>
  phone
    ?.replace(/\D/g, '')
    ?.replace(/(\d{2})(\d)/, '($1) $2')
    ?.replace(/(\d{5})(\d)/, '$1-$2')
    ?.replace(/(-\d{4})\d+?$/, '$1') ?? '';
