import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrefs } from '@/hooks/usePrefs';
import { parseBRL } from '@/lib/format';
import { Button, Input } from '@/components/ui/primitives';
import TopBar from '@/components/TopBar';
import type { BillDraft, PixKeyType } from '@/types';

const PIX_TYPES: { id: PixKeyType; label: string; placeholder: string }[] = [
  { id: 'phone',  label: 'Telefone',  placeholder: '11999998888' },
  { id: 'email',  label: 'E-mail',    placeholder: 'joao@email.com' },
  { id: 'cpf',    label: 'CPF',       placeholder: '000.000.000-00' },
  { id: 'random', label: 'Aleatória', placeholder: 'xxxxxxxx-xxxx-...' },
];

function formatAmountInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 9);
  if (!digits) return '';
  const n = parseInt(digits, 10);
  return (n / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export default function NewBill() {
  const navigate = useNavigate();
  const { prefs, savePrefs } = usePrefs();

  const [amountDisplay, setAmountDisplay] = useState('');
  const [description, setDescription]     = useState('');
  const [name, setName]                   = useState(prefs.defaultName ?? '');
  const [pixType, setPixType]             = useState<PixKeyType>(prefs.defaultPixKey?.type ?? 'phone');
  const [pixKey, setPixKey]               = useState(prefs.defaultPixKey?.value ?? '');
  const [errors, setErrors]               = useState<Record<string, string>>({});

  const amountCents = parseBRL(amountDisplay);

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '');
    setAmountDisplay(formatAmountInput(digits));
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!amountCents || amountCents < 1) errs.amount = 'Informe o valor total';
    if (!pixKey.trim()) errs.pixKey = 'Informe a chave Pix';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleNext() {
    if (!validate()) return;
    savePrefs({ defaultName: name.trim() || undefined, defaultPixKey: { type: pixType, value: pixKey.trim() } });
    const draft: BillDraft = {
      totalAmount: amountCents,
      description: description.trim(),
      receiver: { name: name.trim() || undefined, city: 'BRASIL', pixKey: { type: pixType, value: pixKey.trim() } },
    };
    navigate('/novo/dividir', { state: { draft } });
  }

  return (
    <div className="screen-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100svh', background: 'var(--stone-100)' }}>
      <TopBar onBack={() => navigate('/')} step="Passo 1 de 2"/>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 120px' }} className="no-scrollbar">
        {/* Amount hero */}
        <div style={{ textAlign: 'center', padding: '24px 0 32px' }}>
          <div style={{ fontSize: 13, color: 'var(--stone-500)', marginBottom: 12, fontWeight: 500 }}>Quanto rolou?</div>
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
            <span style={{ fontSize: 28, color: 'var(--stone-400)', fontFamily: "'Fraunces', serif", marginRight: 6, lineHeight: 1 }}>R$</span>
            <input
              type="text"
              inputMode="numeric"
              autoFocus
              value={amountDisplay}
              onChange={handleAmountChange}
              placeholder="0,00"
              style={{
                fontSize: 52, fontFamily: "'Fraunces', serif", fontWeight: 500,
                color: amountCents > 0 ? 'var(--stone-900)' : 'var(--stone-300)',
                background: 'transparent', border: 0, outline: 0,
                width: Math.max(80, amountDisplay.length * 30 + 40),
                letterSpacing: '-0.02em', caretColor: 'var(--amber-400)',
              }}
            />
          </div>
          {errors.amount && <div style={{ fontSize: 12, color: 'var(--rose)', marginTop: 4 }}>{errors.amount}</div>}
        </div>

        {/* Form fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input
            label="Descrição"
            optional
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Ex: Churrasco, Bar, Viagem..."
          />

          {/* Pix key type */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--stone-600)', marginBottom: 8 }}>Tipo de chave Pix</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {PIX_TYPES.map(t => {
                const active = t.id === pixType;
                return (
                  <button key={t.id} onClick={() => setPixType(t.id)} style={{
                    padding: '9px 4px', border: 0,
                    borderRadius: 10,
                    background: active ? 'var(--stone-900)' : 'var(--stone-100)',
                    color: active ? 'white' : 'var(--stone-600)',
                    fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all .15s',
                    fontFamily: "'Inter', sans-serif",
                  }}>{t.label}</button>
                );
              })}
            </div>
          </div>

          <Input
            label="Chave Pix"
            value={pixKey}
            onChange={e => setPixKey(e.target.value)}
            placeholder={PIX_TYPES.find(t => t.id === pixType)?.placeholder}
            error={errors.pixKey}
          />

          <div style={{ background: 'white', borderRadius: 16, padding: '16px', border: '1px solid var(--stone-200)' }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--stone-500)', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", marginBottom: 14 }}>
              Quem recebe
            </div>
            <Input
              label="Seu nome"
              optional
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="João Silva"
            />
            <div style={{ fontSize: 11, color: 'var(--stone-400)', marginTop: 8, lineHeight: 1.4 }}>
              Recomendado pra galera te reconhecer na cobrança
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, padding: '12px 20px 28px', background: 'linear-gradient(to top, var(--stone-100) 70%, transparent)' }}>
        <Button fullWidth size="lg" onClick={handleNext}>
          Continuar
        </Button>
      </div>
    </div>
  );
}
