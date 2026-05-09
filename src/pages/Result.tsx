import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBills } from '@/hooks/useBills';
import { formatBRL } from '@/lib/format';
import { generateBRCode } from '@/lib/pix';
import PixQR from '@/components/PixQR';
import TopBar from '@/components/TopBar';
import { Button, Sheet, Toast, Avatar } from '@/components/ui/primitives';
import { I } from '@/components/icons';
import type { Bill, Participant } from '@/types';

function PersonChip({ p, selected, onClick }: { p: Participant; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 14px 8px 8px', borderRadius: 999,
      background: selected ? 'var(--stone-900)' : 'white',
      border: `1px solid ${selected ? 'var(--stone-900)' : 'var(--stone-200)'}`,
      cursor: 'pointer', flexShrink: 0, transition: 'all .15s',
    }}>
      <Avatar name={p.name} size={24} paid={p.paid}/>
      <span style={{ fontSize: 13, fontWeight: 500, color: selected ? 'white' : p.paid ? 'var(--stone-400)' : 'var(--stone-700)', textDecoration: p.paid ? 'line-through' : 'none' }}>
        {p.name}
      </span>
      {p.paid && !selected && <I.Check size={12} stroke={2.5}/>}
    </button>
  );
}

function ParticipantRow({ p, onToggle }: { p: Participant; onToggle: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--stone-100)' }}>
      <Avatar name={p.name} size={36} paid={p.paid}/>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: p.paid ? 'var(--stone-400)' : 'var(--stone-900)', textDecoration: p.paid ? 'line-through' : 'none' }}>
          {p.name}
        </div>
        <div className="serif" style={{ fontSize: 16, color: p.paid ? 'var(--stone-300)' : 'var(--stone-700)', fontWeight: 500 }}>
          {formatBRL(p.amount)}
        </div>
      </div>
      <button onClick={onToggle} style={{
        width: 32, height: 32, borderRadius: 10,
        border: `1.5px solid ${p.paid ? 'var(--emerald)' : 'var(--stone-300)'}`,
        background: p.paid ? 'var(--emerald)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: 'white', transition: 'all .15s', flexShrink: 0,
      }}>
        {p.paid && <I.Check size={14} stroke={3}/>}
      </button>
    </div>
  );
}

export default function Result() {
  const navigate = useNavigate();
  const { id }   = useParams<{ id: string }>();
  const { bills, saveBill, deleteBill } = useBills();

  const bill = useMemo(() => bills.find(b => b.id === id), [bills, id]);

  const [selected, setSelected]       = useState<string | null>(null);
  const [copied, setCopied]           = useState(false);
  const [detailOpen, setDetailOpen]   = useState(false);
  const [confirmDel, setConfirmDel]   = useState(false);

  if (!bill) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <p style={{ color: 'var(--stone-500)' }}>Rolê não encontrado.</p>
        <Button onClick={() => navigate('/')}>Voltar</Button>
      </div>
    );
  }

  const unpaid = bill.participants.filter(p => !p.paid);
  const selectedId = selected ?? (unpaid[0]?.id ?? bill.participants[0]?.id);
  const selectedP  = bill.participants.find(p => p.id === selectedId) ?? bill.participants[0];

  const billRef = bill!;

  function normalizePixKey(type: string, value: string) {
    if (type === 'phone') return `+55${value.replace(/\D/g, '')}`;
    return value;
  }

  const brCode = useMemo(() => {
    try {
      return generateBRCode({
        pixKey: selectedP.amount > 0 ? normalizePixKey(billRef.receiver.pixKey.type, billRef.receiver.pixKey.value) : '',
        amount: selectedP.amount,
        receiverName: billRef.receiver.name,
        city: billRef.receiver.city,
        txid: billRef.id.replace(/-/g, '').slice(0, 25),
      });
    } catch {
      return '';
    }
  }, [selectedP, billRef]);

  function handleCopy() {
    navigator.clipboard.writeText(brCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  }

  function handleWhatsapp() {
    const message = brCode;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  }

  function togglePaid(pid: string) {
    const updated: Bill = {
      ...billRef,
      participants: billRef.participants.map(p => p.id === pid ? { ...p, paid: !p.paid } : p),
    };
    saveBill(updated);
  }

  function handleDelete() {
    deleteBill(billRef.id);
    navigate('/', { replace: true });
  }

  const paidCount  = billRef.participants.filter(p => p.paid).length;
  const pct        = billRef.totalAmount > 0 ? (billRef.participants.filter(p => p.paid).reduce((s, p) => s + p.amount, 0) / billRef.totalAmount) * 100 : 0;

  return (
    <div className="screen-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100svh', background: 'var(--stone-100)' }}>
      <TopBar
        onBack={() => navigate('/')}
        title="Compartilhar QR"
        right={
          <button onClick={() => setDetailOpen(true)} style={{
            padding: '7px 12px', borderRadius: 18, background: 'white', border: '1px solid var(--stone-200)',
            color: 'var(--stone-700)', fontSize: 12, fontWeight: 500, cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
          }}>
            ver conta
          </button>
        }
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 120px' }} className="no-scrollbar">
        <p style={{ color: 'var(--stone-500)', fontSize: 14, margin: '0 0 16px', padding: '0 4px' }}>
          Cada participante escaneia e paga sua parte
        </p>

        {/* Person picker */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: 16 }} className="no-scrollbar">
          {bill.participants.map(p => (
            <PersonChip key={p.id} p={p} selected={p.id === selectedId} onClick={() => setSelected(p.id)}/>
          ))}
        </div>

        {/* QR card */}
        <div style={{ background: 'white', borderRadius: 24, padding: '20px 20px 24px', border: '1px solid var(--stone-200)' }}>
          {/* Receipt header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 14, borderBottom: '1px dashed var(--stone-200)' }}>
            <div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--stone-400)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, marginBottom: 4 }}>
                Cobrança Pix
              </div>
              <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--stone-900)' }}>
                {bill.receiver.name || 'Pagador'}
              </div>
            </div>
            <div className="serif" style={{ fontSize: 26, fontWeight: 500, color: 'var(--stone-900)', letterSpacing: '-0.01em' }}>
              {formatBRL(selectedP.amount)}
            </div>
          </div>

          {/* QR */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            {selectedP.paid ? (
              <div style={{ width: 220, height: 220, borderRadius: 12, background: 'var(--emerald-50)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <I.Check size={48} stroke={2}/>
                <span style={{ fontSize: 14, color: '#047857', fontWeight: 500 }}>Pago</span>
              </div>
            ) : brCode ? (
              <div style={{ padding: 12, background: 'white', border: '1px solid var(--stone-200)', borderRadius: 16 }}>
                <PixQR value={brCode} size={196}/>
              </div>
            ) : (
              <div style={{ width: 220, height: 220, borderRadius: 12, background: 'var(--stone-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'var(--stone-400)', fontSize: 13 }}>Valor inválido</span>
              </div>
            )}
          </div>

          {/* Pix key info */}
          <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--stone-400)' }}>
            {bill.receiver.pixKey.type.toUpperCase()} · <span style={{ color: 'var(--stone-600)', fontFamily: "'JetBrains Mono', monospace" }}>{bill.receiver.pixKey.value}</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, padding: '12px 20px 28px', background: 'linear-gradient(to top, var(--stone-100) 80%, transparent)', display: 'flex', gap: 8 }}>
        <Button onClick={handleCopy} variant="secondary" icon={<I.Copy size={16}/>} style={{ flex: 1 }}>
          {copied ? 'Copiado!' : 'Copiar código'}
        </Button>
        <Button onClick={handleWhatsapp} variant="accent" icon={<I.Whatsapp size={16}/>} style={{ flex: 1 }}>
          WhatsApp
        </Button>
      </div>

      <Toast message="Código Pix copiado" visible={copied}/>

      {/* Detail sheet */}
      <Sheet open={detailOpen} onClose={() => setDetailOpen(false)}>
        <div style={{ padding: '0 20px' }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--stone-900)', fontFamily: "'Fraunces', serif", letterSpacing: '-0.01em' }}>
              {bill.description || 'Rolê'}
            </div>
            <div style={{ fontSize: 13, color: 'var(--stone-500)', marginTop: 2 }}>
              {formatBRL(bill.totalAmount)} · {bill.participants.length} pessoas
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--stone-500)', marginBottom: 6 }}>
              <span>{paidCount}/{bill.participants.length} pagaram</span>
              <span>{Math.round(pct)}%</span>
            </div>
            <div style={{ height: 6, background: 'var(--stone-200)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: pct === 100 ? 'var(--emerald)' : 'var(--amber-400)', borderRadius: 999, width: `${pct}%`, transition: 'width .3s ease' }}/>
            </div>
          </div>

          {/* Participant rows */}
          <div style={{ marginBottom: 20 }}>
            {bill.participants.map(p => (
              <ParticipantRow key={p.id} p={p} onToggle={() => togglePaid(p.id)}/>
            ))}
          </div>

          {/* Delete */}
          {confirmDel ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="secondary" fullWidth onClick={() => setConfirmDel(false)}>Cancelar</Button>
              <Button variant="ghost" fullWidth style={{ color: 'var(--rose)' }} onClick={handleDelete}>Confirmar exclusão</Button>
            </div>
          ) : (
            <Button variant="ghost" fullWidth icon={<I.Trash size={16}/>} style={{ color: 'var(--stone-500)' }} onClick={() => setConfirmDel(true)}>
              Excluir rolê
            </Button>
          )}
        </div>
      </Sheet>
    </div>
  );
}
