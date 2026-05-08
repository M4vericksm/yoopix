import { useState, useCallback } from 'react';
import { storage } from '@/lib/storage';
import type { UserPrefs } from '@/types';

export function usePrefs() {
  const [prefs, setPrefs] = useState<UserPrefs>(() => storage.getPrefs());

  const savePrefs = useCallback((update: Partial<UserPrefs>) => {
    storage.savePrefs(update);
    setPrefs(storage.getPrefs());
  }, []);

  return { prefs, savePrefs };
}
