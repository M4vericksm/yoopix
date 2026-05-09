import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBills } from '@/hooks/useBills';
import { formatBRL, formatDate } from '@/lib/format';
import TopBar from '@/components/TopBar';
import { Avatar } from '@/components/ui/primitives';
import { I } from '@/components/icons';
import type { Bill } from '@/types';

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const LONG_PRESS_MS = 550;

function useLongPress(onLongPress: () => void, onClick: () => void) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fired  = useRef(false);

  const start = useCallback((e: React.PointerEvent) => {
    if (e.button !== undefined && e.button !== 0) return;
    fired.current = false;
    timer.current = setTimeout(() => {
      fired.current = true;
      onLongPress();
    }, LONG_PRESS_MS);
  }, [onLongPress]);

  const cancel = useCallback((_e?: React.PointerEvent) => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const end = useCallback((_e?: React.PointerEvent) => {
    if (timer.current) clearTimeout(timer.current);
    if (!fired.current) onClick();
  }, [onClick]);

  return { onPointerDown: start, onPointerUp: end, onPointerCancel: cancel, onPointerLeave: cancel };
}

function BillRow({
  bill, selectMode, selected, onLongPress, onSelect, onClick,
}: {
  bill: Bill;
  selectMode: boolean;
  selected: boolean;
  onLongPress: () => void;
  onSelect: () => void;
  onClick: () => void;
}) {
  const [pressing, setPressing] = useState(false);
  const paidCount = bill.participants.filter(p => p.paid).length;
  const total     = bill.participants.length;
  const allPaid   = paidCount === total;

  const handlers = useLongPress(onLongPress, selectMode ? onSelect : onClick);

  return (
    <div
      {...handlers}
      onPointerDown={e => { setPressing(true); handlers.onPointerDown(e); }}
      onPointerUp={e => { setPressing(false); handlers.onPointerUp(e); }}
      onPointerCancel={e => { setPressing(false); handlers.onPointerCancel(e); }}
      onPointerLeave={e => { setPressing(false); handlers.onPointerLeave(e); }}
      style={{
        width: '100%', padding: '14px 16px',
        background: selected ? 'rgba(251,191,36,0.10)' : 'white',
        border: `1.5px solid ${selected ? 'var(--amber-400)' : 'var(--stone-200)'}`,
        borderRadius: 18, cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
        userSelect: 'none', WebkitUserSelect: 'none',
        transform: pressing ? 'scale(0.98)' : 'scale(1)',
        transition: 'transform .1s ease, border .15s, background .15s',
      }}
    >
      {selectMode && (
        <div style={{
          width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
          border: `2px solid ${selected ? 'var(--amber-400)' : 'var(--stone-300)'}`,
          background: selected ? 'var(--amber-400)' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all .15s',
        }}>
          {selected && <I.Check size={12} stroke={3}/>}
        </div>
      )}

      <div style={{ display: 'flex' }}>
        {bill.participants.slice(0, 3).map((p, i) => (
          <div key={p.id} style={{ marginLeft: i === 0 ? 0 : -10, border: '2px solid white', borderRadius: '50%' }}>
            <Avatar name={p.name} size={28}/>
          </div>
        ))}
        {bill.participants.length > 3 && (
          <div style={{ marginLeft: -10, width: 28, height: 28, borderRadius: '50%', background: 'var(--stone-100)', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, color: 'var(--stone-500)' }}>
            +{bill.participants.length - 3}
          </div>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--stone-900)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {bill.description || `Rolê #${bill.billNumber ?? ''}`}
        </div>
        <div style={{ fontSize: 12, color: 'var(--stone-400)' }}>
          {formatDate(bill.createdAt)} · {formatBRL(bill.totalAmount)}
        </div>
      </div>

      <div style={{ fontSize: 11, fontWeight: 600, padding: '5px 10px', borderRadius: 999, background: allPaid ? 'var(--emerald-50)' : 'rgba(251,191,36,0.16)', color: allPaid ? '#047857' : '#92400e', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.04em', flexShrink: 0 }}>
        {paidCount}/{total}
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div style={{ background: 'white', border: '1px solid var(--stone-200)', borderRadius: 16, padding: '14px 16px' }}>
      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--stone-500)', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{label}</div>
      <div className="serif" style={{ fontSize: 22, color: 'var(--stone-900)', fontWeight: 500, marginTop: 4, letterSpacing: '-0.01em', lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--stone-500)', marginTop: 2 }}>{sub}</div>
    </div>
  );
}

export default function History() {
  const navigate = useNavigate();
  const { bills, deleteBill } = useBills();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const selectMode = selectedIds.size > 0;

  const grouped = bills.reduce<[string, Bill[]][]>((acc, b) => {
    const d   = new Date(b.createdAt);
    const key = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    const existing = acc.find(([k]) => k === key);
    if (existing) existing[1].push(b);
    else acc.push([key, [b]]);
    return acc;
  }, []);

  const totalAll  = bills.reduce((s, b) => s + b.totalAmount, 0);
  const yourShare = bills.reduce((s, b) => {
    const you = b.participants.find(p => p.name === 'Você');
    return s + (you ? you.amount : 0);
  }, 0);

  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function handleLongPress(id: string) {
    setSelectedIds(new Set([id]));
  }

  function handleDelete() {
    selectedIds.forEach(id => deleteBill(id));
    setSelectedIds(new Set());
  }

  const n = selectedIds.size;

  return (
    <div className="screen-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100svh', background: 'var(--stone-100)' }}>
      <TopBar onBack={selectMode ? () => setSelectedIds(new Set()) : () => navigate('/')} title={selectMode ? `${n} selecionado${n > 1 ? 's' : ''}` : 'Histórico'}/>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px', paddingBottom: selectMode ? 100 : 40 }} className="no-scrollbar">
        {bills.length > 0 && !selectMode && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
            <StatCard label="Rolês" value={String(bills.length)} sub="no total"/>
            <StatCard label="Sua parte" value={formatBRL(yourShare)} sub={`de ${formatBRL(totalAll)}`}/>
          </div>
        )}

        {bills.length === 0 ? (
          <div style={{ marginTop: 40, textAlign: 'center', padding: '0 24px' }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, margin: '0 auto 16px', background: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <I.Calendar size={28} stroke={1.5}/>
            </div>
            <p style={{ color: 'var(--stone-500)', fontSize: 14, lineHeight: 1.5, maxWidth: 240, margin: '0 auto' }}>
              Nenhum rolê ainda. Crie um na tela inicial!
            </p>
          </div>
        ) : (
          grouped.map(([month, monthBills]) => (
            <div key={month} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--stone-500)', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", margin: '0 4px 10px' }}>
                {month}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {monthBills.map(b => (
                  <BillRow
                    key={b.id}
                    bill={b}
                    selectMode={selectMode}
                    selected={selectedIds.has(b.id)}
                    onLongPress={() => handleLongPress(b.id)}
                    onSelect={() => toggleSelect(b.id)}
                    onClick={() => navigate(`/role/${b.id}`)}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {selectMode && (
        <div style={{
          position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 430, padding: '12px 20px 28px',
          background: 'linear-gradient(to top, var(--stone-100) 70%, transparent)',
          display: 'flex', gap: 10,
        }}>
          <button
            onClick={() => setSelectedIds(new Set())}
            style={{ flex: 1, padding: '14px', borderRadius: 999, border: '1.5px solid var(--stone-300)', background: 'white', fontSize: 14, fontWeight: 600, color: 'var(--stone-700)', cursor: 'pointer' }}
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            style={{ flex: 2, padding: '14px', borderRadius: 999, border: 0, background: '#dc2626', fontSize: 14, fontWeight: 600, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <I.Trash size={16} stroke={2}/>
            Excluir {n > 1 ? `${n} rolês` : 'rolê'}
          </button>
        </div>
      )}
    </div>
  );
}
