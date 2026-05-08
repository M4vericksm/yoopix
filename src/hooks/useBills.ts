import { useState, useCallback } from 'react';
import { storage } from '@/lib/storage';
import type { Bill } from '@/types';

export function useBills() {
  const [bills, setBills] = useState<Bill[]>(() => storage.getBills());

  const saveBill = useCallback((bill: Bill) => {
    storage.saveBill(bill);
    setBills(storage.getBills());
  }, []);

  const deleteBill = useCallback((id: string) => {
    storage.deleteBill(id);
    setBills(storage.getBills());
  }, []);

  const refresh = useCallback(() => {
    setBills(storage.getBills());
  }, []);

  return { bills, saveBill, deleteBill, refresh };
}
