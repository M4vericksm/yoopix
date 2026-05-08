import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBills } from '@/hooks/useBills';
import { formatBRL, formatDate } from '@/lib/format';
import { I } from '@/components/icons';
import { Avatar } from '@/components/ui/primitives';
import type { Bill } from '@/types';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

function HeroCard({ onClick }: { onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
      width: '100%', border: 0, padding: 0, cursor: 'pointer',
      background: 'var(--stone-900)', borderRadius: 28,
      textAlign: 'left', overflow: 'hidden', position: 'relative',
      transform: hover ? 'scale(1.01)' : 'scale(1)',
      transition: 'transform .18s ease, box-shadow .18s ease',
      boxShadow: hover ? '0 8px 32px rgba(0,0,0,.18)' : '0 2px 8px rgba(0,0,0,.1)',
    }}>
      <div style={{ position: 'absolute', top: -20, right: -20, width: 160, height: 160, background: 'var(--amber-400)', borderRadius: '50%', opacity: 0.18 }}/>
      <div style={{ position: 'absolute', top: 10, right: 10, width: 80, height: 80, background: 'var(--amber-400)', borderRadius: '50%', opacity: 0.28 }}/>
      <div style={{ position: 'relative', padding: '28px 28px 32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 14, background: 'var(--amber-400)', marginBottom: 16 }}>
          <I.Pix size={22} stroke={2}/>
        </div>
        <div style={{ fontSize: 22, fontWeight: 500, color: 'white', fontFamily: "'Fraunces', serif", letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 6 }}>
          Novo rolê
        </div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>
          Divida a conta e gere QR Pix automático
        </div>
        <div style={{ marginTop: 22, display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--amber-400)', color: 'var(--stone-900)', padding: '9px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>
          <I.Plus size={14} stroke={2.5}/> Criar
        </div>
      </div>
    </button>
  );
}

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

export default function Home() {
  const navigate = useNavigate();
  const { bills } = useBills();
  const recent = bills.slice(0, 3);

  return (
    <div className="screen-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100svh', background: 'var(--stone-100)' }}>
      <header style={{ padding: '56px 24px 16px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div className="serif" style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 10 }}>
            <span style={{ color: 'var(--stone-900)' }}>Yoo</span><span style={{ color: 'var(--amber-500)' }}>pix</span>
          </div>
          <h1 className="serif" style={{ fontSize: 34, lineHeight: 1.05, color: 'var(--stone-900)', margin: 0, fontWeight: 500, letterSpacing: '-0.02em' }}>
            {greeting()},<br/>
            <em style={{ fontStyle: 'italic', color: 'var(--stone-500)', fontWeight: 400 }}>vamo dividir essa conta?</em>
          </h1>
        </div>
        <button onClick={() => navigate('/historico')} style={{ width: 44, height: 44, borderRadius: 22, background: 'white', border: '1px solid var(--stone-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--stone-700)', flexShrink: 0 }}>
          <I.History size={19}/>
        </button>
      </header>

      <div style={{ padding: '16px 24px 40px', flex: 1 }} className="no-scrollbar">
        <HeroCard onClick={() => navigate('/novo')}/>

        {recent.length > 0 ? (
          <div style={{ marginTop: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h2 style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--stone-500)', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", margin: 0 }}>
                Recentes
              </h2>
              <button onClick={() => navigate('/historico')} style={{ fontSize: 12, color: 'var(--stone-500)', background: 'none', border: 0, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
                ver todos
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recent.map(b => <BillRow key={b.id} bill={b} onClick={() => navigate(`/role/${b.id}`)}/>)}
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 40, textAlign: 'center', padding: '0 24px' }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, margin: '0 auto 16px', background: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <I.Receipt size={28} stroke={1.5}/>
            </div>
            <p style={{ color: 'var(--stone-500)', fontSize: 14, lineHeight: 1.5, maxWidth: 240, margin: '0 auto' }}>
              Crie seu primeiro rolê pra rachar uma conta
            </p>
          </div>
        )}
      </div>

      <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--stone-400)', margin: '0 0 24px', fontFamily: "'JetBrains Mono', monospace" }}>
        dados salvos só neste dispositivo
      </p>
    </div>
  );
}
