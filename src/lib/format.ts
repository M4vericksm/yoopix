export const formatBRL = (cents: number): string =>
  `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;

export const parseBRL = (str: string): number => {
  const cleaned = str.replace(/\D/g, '');
  return parseInt(cleaned || '0', 10);
};

export const formatDate = (timestamp: number): string =>
  new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(
    new Date(timestamp),
  );
