export type PixKeyType = 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';

export interface PixKey {
  type: PixKeyType;
  value: string;
}

export interface Receiver {
  name?: string;
  city: string;
  pixKey: PixKey;
}

export interface Participant {
  id: string;
  name: string;
  amount: number; // centavos
  paid: boolean;
}

export type SplitMode = 'equal' | 'custom';

export interface Bill {
  id: string;
  createdAt: number;
  description: string;
  totalAmount: number; // centavos
  splitMode: SplitMode;
  receiver: Receiver;
  participants: Participant[];
}

export interface UserPrefs {
  defaultName?: string;
  defaultPixKey?: PixKey;
}

export interface BillDraft {
  totalAmount: number; // centavos
  description: string;
  receiver: Receiver;
  splitMode?: SplitMode;
  participants?: Partial<Participant>[];
}
