import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBills } from '@/hooks/useBills';
import { formatBRL, parseBRL } from '@/lib/format';
import { splitEqual } from '@/lib/split';
import { Button, Segmented, Avatar } from '@/components/ui/primitives';
import TopBar from '@/components/TopBar';
import { I } from '@/components/icons';
import type { BillDraft, Participant } from '@/types';

type DraftP = { id: string; name: string; amount: number };

export default function SplitMode() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { saveBill } = useBills();

  const draft: BillDraft | undefined = location.state?.draft;

  const [mode, setMode]               = useState<'equal' | 'custom'>('equal');
  const [count, setCount]             = useState(3);
  const [participants, setParticipants] = useState<DraftP[]>([
    { id: 'p0', name: 'Você', amount: 0 },
    { id: 'p1', name: '', amount: 0 },
    { id: 'p2', name: '', amount: 0 },
  ]);

  useEffect(() => {
    setParticipants(curr => {
      if (curr.length === count) return curr;
      if (curr.length < count) {
        return [...curr, ...Array.from({ length: count - curr.length }, (_, i) => ({
          id: `p${curr.length + i}-${Date.now()}`, name: '', amount: 0,
        }))];
      }
      return curr.slice(0, count);
    });
  }, [count]);

  if (!draft) {
    navigate('/novo');
    return null;
  }

  const equalAmount = Math.floor(draft.totalAmount / count);
  const remainder   = draft.totalAmount - equalAmount * count;
  const customSum   = participants.reduce((s, p) => s + p.amount, 0);
  const customDiff  = draft.totalAmount - customSum;
  const valid       = mode === 'equal' || customDiff === 0;

  function handleGenerate() {
    const amounts = mode === 'equal'
      ? splitEqual(draft!.totalAmount, count)
      : participants.map(p => ({ amount: p.amount }));

    const final: Participant[] = participants.map((p, i) => ({
      id: p.id,
      name: p.name.trim() || (i === 0 ? 'Você' : `Pessoa ${i + 1}`),
      amount: amounts[i].amount,
      paid: false,
    }));

    const bill = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      description: draft!.description,
      totalAmount: draft!.totalAmount,
      splitMode: mode,
      receiver: draft!.receiver,
      participants: final,
    };

    saveBill(bill);
    navigate(`/role/${bill.id}`, { replace: true });
  }

  function setParticipantName(idx: number, name: string) {
    setParticipants(curr => curr.map((p, i) => i === idx ? { ...p, name } : p));
  }

  function setParticipantAmount(idx: number, raw: string) {
    const cents = parseBRL(raw);
    setParticipants(curr => curr.map((p, i) => i === idx ? { ...p, amount: cents } : p));
  }

  return (
    <div className="screen-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100svh', background: 'var(--stone-100)' }}>
      <TopBar onBack={() => navigate('/novo')} step="Passo 2 de 2"/>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 120px' }} className="no-scrollbar">
        {/* Total hero */}
        <div style={{ textAlign: 'center', padding: '24px 0 28px' }}>
          <div style={{ fontSize: 12, color: 'var(--stone-400)', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
            Total
          </div>
          <div className="serif" style={{ fontSize: 48, fontWeight: 500, color: 'var(--stone-900)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            {formatBRL(draft.totalAmount)}
          </div>
          {draft.description && (
            <div style={{ fontSize: 13, color: 'var(--stone-500)', marginTop: 6 }}>{draft.description}</div>
          )}
        </div>

        {/* Mode toggle */}
        <Segmented
          value={mode}
          onChange={v => setMode(v as 'equal' | 'custom')}
          options={[
            { id: 'equal',  label: 'Igual',        icon: <I.Users size={14}/> },
            { id: 'custom', label: 'Personalizada', icon: <I.Coins size={14}/> },
          ]}
        />

        {/* Stepper */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, margin: '24px 0 8px' }}>
          <button onClick={() => setCount(c => Math.max(2, c - 1))} disabled={count <= 2} style={{
            width: 40, height: 40, borderRadius: 20, border: '1px solid var(--stone-200)',
            background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: count <= 2 ? 'not-allowed' : 'pointer', opacity: count <= 2 ? 0.4 : 1, color: 'var(--stone-700)',
          }}>
            <I.Minus size={16}/>
          </button>
          <div style={{ textAlign: 'center' }}>
            <div className="serif" style={{ fontSize: 36, fontWeight: 500, color: 'var(--stone-900)', letterSpacing: '-0.02em', lineHeight: 1 }}>{count}</div>
            <div style={{ fontSize: 12, color: 'var(--stone-400)', marginTop: 2 }}>pessoas</div>
          </div>
          <button onClick={() => setCount(c => Math.min(12, c + 1))} disabled={count >= 12} style={{
            width: 40, height: 40, borderRadius: 20, border: '1px solid var(--stone-200)',
            background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: count >= 12 ? 'not-allowed' : 'pointer', opacity: count >= 12 ? 0.4 : 1, color: 'var(--stone-700)',
          }}>
            <I.Plus size={16}/>
          </button>
        </div>

        {/* Preview badge */}
        {mode === 'equal' ? (
          <div style={{ textAlign: 'center', padding: '12px 0 20px' }}>
            <span style={{ background: 'rgba(251,191,36,0.15)', color: '#92400e', padding: '8px 16px', borderRadius: 999, fontSize: 13, fontWeight: 500 }}>
              Cada um paga {formatBRL(equalAmount)}{remainder > 0 ? ` (último paga ${formatBRL(equalAmount + remainder)})` : ''}
            </span>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '12px 0 20px' }}>
            {customDiff === 0 ? (
              <span style={{ background: 'var(--emerald-50)', color: '#047857', padding: '8px 16px', borderRadius: 999, fontSize: 13, fontWeight: 500 }}>
                ✓ Valores conferem
              </span>
            ) : (
              <span style={{ background: customDiff > 0 ? 'rgba(251,191,36,0.15)' : 'rgba(244,63,94,0.1)', color: customDiff > 0 ? '#92400e' : 'var(--rose)', padding: '8px 16px', borderRadius: 999, fontSize: 13, fontWeight: 500 }}>
                {customDiff > 0 ? `Falta ${formatBRL(customDiff)}` : `Excede em ${formatBRL(Math.abs(customDiff))}`}
              </span>
            )}
          </div>
        )}

        {/* Participant list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {participants.map((p, i) => (
            <div key={p.id} className="slide-in-r" style={{
              background: 'white', border: '1px solid var(--stone-200)',
              borderRadius: 16, padding: '10px 12px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <Avatar name={p.name || (i === 0 ? 'Você' : `Pessoa ${i + 1}`)} size={32}/>
              <input
                type="text"
                value={p.name}
                onChange={e => setParticipantName(i, e.target.value)}
                placeholder={i === 0 ? 'Você' : `Pessoa ${i + 1}`}
                style={{ flex: 1, background: 'transparent', border: 0, outline: 0, fontSize: 15, color: 'var(--stone-900)', fontFamily: "'Inter', sans-serif", minWidth: 0 }}
              />
              {mode === 'custom' ? (
                <div style={{ position: 'relative', width: 110 }}>
                  <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--stone-400)', fontSize: 12 }}>R$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={p.amount > 0 ? (p.amount / 100).toFixed(2).replace('.', ',') : ''}
                    onChange={e => setParticipantAmount(i, e.target.value)}
                    placeholder="0,00"
                    style={{ width: '100%', paddingLeft: 28, paddingRight: 8, paddingTop: 8, paddingBottom: 8, border: '1px solid var(--stone-200)', borderRadius: 8, background: 'var(--stone-50)', fontSize: 14, fontFamily: "'Inter', sans-serif", color: 'var(--stone-900)', outline: 0, boxSizing: 'border-box' }}
                  />
                </div>
              ) : (
                <div style={{ fontSize: 14, color: 'var(--stone-500)', fontFamily: "'Fraunces', serif", flexShrink: 0 }}>
                  {formatBRL(i === count - 1 ? equalAmount + remainder : equalAmount)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, padding: '12px 20px 28px', background: 'linear-gradient(to top, var(--stone-100) 70%, transparent)' }}>
        <Button fullWidth size="lg" disabled={!valid} onClick={handleGenerate}>
          Gerar QR Pix
        </Button>
      </div>
    </div>
  );
}
