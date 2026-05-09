import type { PixKeyType } from '@/types';

export const validateCPF = (cpf: string): boolean => {
  const clean = cpf.replace(/\D/g, '');
  if (clean.length !== 11) return false;
  if (/^(\d)\1+$/.test(clean)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(clean[i]) * (10 - i);
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(clean[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(clean[i]) * (11 - i);
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  return digit === parseInt(clean[10]);
};

export function detectPixKeyType(value: string): PixKeyType | null {
  const v = value.trim();
  if (!v) return null;
  if (v.includes('@')) return 'email';
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v)) return 'random';
  const digits = v.replace(/[\s.\-\/]/g, '');
  if (/^\d+$/.test(digits)) {
    if (digits.length === 14) return 'cnpj';
    if (digits.length === 11) return validateCPF(digits) ? 'cpf' : 'phone';
    if (digits.length === 10) return 'phone';
  }
  return null;
}

export const PIX_TYPE_LABEL: Record<PixKeyType, string> = {
  phone:  'Telefone',
  email:  'E-mail',
  cpf:    'CPF',
  cnpj:   'CNPJ',
  random: 'Chave aleatória',
};

