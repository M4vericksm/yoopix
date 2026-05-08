import { z } from 'zod';

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

export const pixKeySchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('email'),
    value: z.string().email('E-mail inválido'),
  }),
  z.object({
    type: z.literal('phone'),
    value: z.string().regex(/^\d{10,11}$/, 'Telefone inválido (ex: 11999998888)'),
  }),
  z.object({
    type: z.literal('cpf'),
    value: z.string().refine(validateCPF, 'CPF inválido'),
  }),
  z.object({
    type: z.literal('cnpj'),
    value: z.string().regex(/^\d{14}$/, 'CNPJ inválido (14 dígitos sem pontuação)'),
  }),
  z.object({
    type: z.literal('random'),
    value: z.string().uuid('Chave aleatória inválida (deve ser UUID)'),
  }),
]);

export type PixKeyInput = z.infer<typeof pixKeySchema>;
