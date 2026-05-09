import type { Bill, UserPrefs, BillDraft } from '@/types';

const KEYS = {
  bills: 'divide:bills',
  prefs: 'divide:prefs',
  draft: 'divide:draft',
  billCounter: 'divide:billCounter',
} as const;

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Storage write failed:', e);
  }
}

export const storage = {
  getBills: (): Bill[] => safeRead(KEYS.bills, []),

  saveBills: (bills: Bill[]) => safeWrite(KEYS.bills, bills),

  saveBill: (bill: Bill) => {
    const bills = storage.getBills();
    const idx = bills.findIndex((b) => b.id === bill.id);
    if (idx >= 0) bills[idx] = bill;
    else bills.unshift(bill);
    storage.saveBills(bills);
  },

  deleteBill: (id: string) => {
    storage.saveBills(storage.getBills().filter((b) => b.id !== id));
  },

  getPrefs: (): UserPrefs => safeRead(KEYS.prefs, {}),

  savePrefs: (prefs: Partial<UserPrefs>) => {
    safeWrite(KEYS.prefs, { ...storage.getPrefs(), ...prefs });
  },

  getDraft: (): BillDraft | null => safeRead(KEYS.draft, null),

  saveDraft: (draft: BillDraft | null) => {
    if (draft === null) localStorage.removeItem(KEYS.draft);
    else safeWrite(KEYS.draft, draft);
  },

  nextBillNumber: (): number => {
    const next = safeRead(KEYS.billCounter, 0) + 1;
    safeWrite(KEYS.billCounter, next);
    return next;
  },

  clearAll: () => {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  },
};
