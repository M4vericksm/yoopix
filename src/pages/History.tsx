import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBills } from '@/hooks/useBills';
import { formatBRL, formatDate } from '@/lib/format';
import TopBar from '@/components/TopBar';
import { Avatar } from '@/components/ui/primitives';
import { I } from '@/components/icons';
import type { Bill } from '@/types';

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

function BillRow({ bill, onClick }: { bill: Bill; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  const paidCount = bill.participants.filter(p => p.paid).length;
  const total = bill.participants.length;
  const allPaid = paidCount === total;

  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
      width: '100%', padding: '14px 16px',
      background: 'white', border: `1px solid ${hover ? 'var(--stone-300)' : 'var(--stone-200)'}`,
      borderRadius: 18, cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 12, transition: 'border .15s', textAlign: 'left',
    }}>
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
          {bill.description || 'Rolê'}
        </div>
        <div style={{ fontSize: 12, color: 'var(--stone-400)' }}>
          {formatDate(bill.createdAt)} · {formatBRL(bill.totalAmount)}
        </div>
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, padding: '5px 10px', borderRadius: 999, background: allPaid ? 'var(--emerald-50)' : 'rgba(251,191,36,0.16)', color: allPaid ? '#047857' : '#92400e', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.04em', flexShrink: 0 }}>
        {paidCount}/{total}
      </div>
    </button>
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
  const { bills } = useBills();

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

  return (
    <div className="screen-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100svh', background: 'var(--stone-100)' }}>
      <TopBar onBack={() => navigate('/')} title="Histórico"/>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 40px' }} className="no-scrollbar">
        {bills.length > 0 && (
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
                {monthBills.map(b => <BillRow key={b.id} bill={b} onClick={() => navigate(`/role/${b.id}`)}/>)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
