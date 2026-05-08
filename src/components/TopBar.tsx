import type { ReactNode } from 'react';
import { I } from '@/components/icons';

export default function TopBar({
  onBack, title, step, right,
}: {
  onBack?: () => void;
  title?: string;
  step?: string;
  right?: ReactNode;
}) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 20px',
      background: 'var(--stone-100)',
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      {onBack && (
        <button onClick={onBack} style={{
          width: 40, height: 40, borderRadius: 20,
          background: 'white', border: '1px solid var(--stone-200)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'var(--stone-700)', flexShrink: 0,
        }}>
          <I.Back size={18}/>
        </button>
      )}
      <div style={{ fontSize: 13, color: 'var(--stone-500)', flex: 1, fontWeight: 500 }}>
        {step ?? title}
      </div>
      {right}
    </header>
  );
}
