import { useState, useCallback } from 'react';
import { storage } from '@/lib/storage';
import type { BillDraft } from '@/types';

export function useDraft() {
  const [draft, setDraft] = useState<BillDraft | null>(() => storage.getDraft());

  const saveDraft = useCallback((d: BillDraft | null) => {
    storage.saveDraft(d);
    setDraft(d);
  }, []);

  const clearDraft = useCallback(() => {
    storage.saveDraft(null);
    setDraft(null);
  }, []);

  return { draft, saveDraft, clearDraft };
}
