import { createStaticPix, hasError } from 'pix-utils';

export function generateBRCode({
  pixKey,
  amount,
  receiverName,
  city = 'BRASIL',
  txid,
}: {
  pixKey: string;
  amount: number; // centavos
  receiverName?: string;
  city?: string;
  txid: string;
}): string {
  const pix = createStaticPix({
    merchantName: (receiverName?.trim() || 'PAGADOR').substring(0, 25),
    merchantCity: city.substring(0, 15),
    pixKey,
    transactionAmount: amount / 100,
    txid,
  });

  if (hasError(pix)) {
    throw new Error(`Erro ao gerar BR Code: ${pix.error}`);
  }

  return pix.toBRCode();
}
