import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { I } from '@/components/icons';

// ─── Button ───────────────────────────────────────────────
type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'success';
type BtnSize    = 'sm' | 'md' | 'lg';

const BTN_VARIANTS: Record<BtnVariant, { bg: string; color: string; hoverBg: string; border: string }> = {
  primary:   { bg: 'var(--stone-900)', color: 'var(--stone-50)',  hoverBg: 'var(--stone-800)', border: 'transparent' },
  secondary: { bg: 'var(--stone-100)', color: 'var(--stone-900)', hoverBg: 'var(--stone-200)', border: 'var(--stone-200)' },
  ghost:     { bg: 'transparent',      color: 'var(--stone-700)', hoverBg: 'var(--stone-100)', border: 'transparent' },
  accent:    { bg: 'var(--amber-400)', color: 'var(--stone-900)', hoverBg: 'var(--amber-300)', border: 'transparent' },
  success:   { bg: 'var(--emerald)',   color: 'white',            hoverBg: '#047857',          border: 'transparent' },
};
const BTN_SIZES = {
  sm: { py: 9,  px: 14, fs: 13 },
  md: { py: 14, px: 20, fs: 15 },
  lg: { py: 16, px: 22, fs: 16 },
};

export function Button({
  children, onClick, variant = 'primary', disabled, icon, size = 'md', style = {}, fullWidth,
}: {
  children?: ReactNode; onClick?: () => void; variant?: BtnVariant; disabled?: boolean;
  icon?: ReactNode; size?: BtnSize; style?: React.CSSProperties; fullWidth?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const v = BTN_VARIANTS[variant];
  const sz = BTN_SIZES[size];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: `${sz.py}px ${sz.px}px`,
        borderRadius: 16,
        fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: sz.fs,
        background: hover && !disabled ? v.hoverBg : v.bg,
        color: v.color,
        border: `1px solid ${v.border}`,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'all .15s ease',
        letterSpacing: '-0.01em',
        width: fullWidth ? '100%' : undefined,
        ...style,
      }}>
      {icon}{children}
    </button>
  );
}

// ─── Input ────────────────────────────────────────────────
export function Input({
  label, value, onChange, placeholder, type = 'text', autoFocus, optional, suffix, prefix, inputMode, error,
}: {
  label?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; type?: string; autoFocus?: boolean; optional?: boolean;
  suffix?: string; prefix?: string; inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  error?: string;
}) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--stone-600)', display: 'flex', alignItems: 'center', gap: 6, letterSpacing: '-0.005em' }}>
          {label}
          {optional && <span style={{ color: 'var(--stone-400)', fontWeight: 400, fontSize: 11 }}>opcional</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {prefix && <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--stone-400)', fontSize: 14, pointerEvents: 'none' }}>{prefix}</span>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          inputMode={inputMode}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            width: '100%',
            padding: `13px 14px 13px ${prefix ? 36 : 14}px`,
            paddingRight: suffix ? 40 : 14,
            background: focus ? 'white' : 'var(--stone-50)',
            border: `1px solid ${error ? 'var(--rose)' : focus ? 'var(--stone-900)' : 'var(--stone-200)'}`,
            borderRadius: 14,
            outline: 'none',
            fontSize: 15, fontFamily: "'Inter', sans-serif",
            color: 'var(--stone-900)',
            transition: 'all .15s',
            boxSizing: 'border-box',
          }}/>
        {suffix && <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--stone-400)', fontSize: 14 }}>{suffix}</span>}
      </div>
      {error && <span style={{ fontSize: 12, color: 'var(--rose)', marginTop: -2 }}>{error}</span>}
    </div>
  );
}

// ─── Segmented ────────────────────────────────────────────
export function Segmented({
  value, onChange, options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { id: string; label: string; icon?: ReactNode }[];
}) {
  return (
    <div style={{ background: 'var(--stone-150)', padding: 4, borderRadius: 14, display: 'flex', gap: 0 }}>
      {options.map(opt => {
        const active = opt.id === value;
        return (
          <button key={opt.id} onClick={() => onChange(opt.id)} style={{
            flex: 1, border: 0, padding: '10px 12px', borderRadius: 10,
            background: active ? 'white' : 'transparent',
            color: active ? 'var(--stone-900)' : 'var(--stone-500)',
            fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500,
            cursor: 'pointer', transition: 'all .15s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            boxShadow: active ? '0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)' : 'none',
          }}>
            {opt.icon}{opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Sheet (bottom drawer) ────────────────────────────────
const SWIPE_CLOSE_THRESHOLD = 120;

export function Sheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  const [dragY, setDragY]     = useState(0);
  const [dragging, setDragging] = useState(false);
  const [closing, setClosing]  = useState(false);
  const startY = useRef(0);

  useEffect(() => {
    if (!open) { setDragY(0); setClosing(false); }
  }, [open]);

  function onPointerDown(e: React.PointerEvent) {
    startY.current = e.clientY;
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    setDragY(Math.max(0, e.clientY - startY.current));
  }

  function onPointerUp() {
    setDragging(false);
    if (dragY > SWIPE_CLOSE_THRESHOLD) {
      setClosing(true);
      setDragY(window.innerHeight);
      setTimeout(onClose, 280);
    } else {
      setDragY(0);
    }
  }

  if (!open && !closing) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: `rgba(28,25,23,${Math.max(0, 0.4 - dragY / 800)})`,
        backdropFilter: 'blur(2px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 430, background: 'white',
          borderTopLeftRadius: 28, borderTopRightRadius: 28,
          maxHeight: '85dvh',
          display: 'flex', flexDirection: 'column',
          transform: `translateY(${dragY}px)`,
          transition: dragging ? 'none' : 'transform .28s cubic-bezier(.2,.7,.3,1)',
          animation: dragY === 0 && !dragging && !closing ? 'slideUp .3s cubic-bezier(.2,.7,.3,1)' : 'none',
        }}
      >
        {/* drag handle */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{ padding: '20px 0 20px', flexShrink: 0, cursor: 'grab', touchAction: 'none', userSelect: 'none' }}
        >
          <div style={{ width: 36, height: 4, background: 'var(--stone-300)', borderRadius: 2, margin: '0 auto' }}/>
        </div>

        <div style={{ overflowY: 'auto', paddingBottom: 32 }} className="no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────
export function Toast({ message, visible }: { message: string; visible: boolean }) {
  if (!visible) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 100, left: '50%', transform: 'translateX(-50%)',
      background: 'var(--stone-900)', color: 'white',
      padding: '11px 18px', borderRadius: 999,
      fontSize: 13, fontWeight: 500,
      animation: 'screenIn .25s',
      zIndex: 60,
      display: 'flex', alignItems: 'center', gap: 8,
      boxShadow: '0 8px 24px rgba(0,0,0,.18)',
      whiteSpace: 'nowrap',
    }}>
      <I.Check size={15} stroke={2.5}/>{message}
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────
const AVATAR_COLORS: [string, string][] = [
  ['#fde68a', '#92400e'],
  ['#fed7aa', '#9a3412'],
  ['#fbcfe8', '#9d174d'],
  ['#bbf7d0', '#14532d'],
  ['#bae6fd', '#075985'],
  ['#ddd6fe', '#5b21b6'],
  ['#fecaca', '#991b1b'],
  ['#a7f3d0', '#065f46'],
];

function avatarColor(name: string): [string, string] {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffffff;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function initials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({ name, size = 36, paid }: { name: string; size?: number; paid?: boolean }) {
  const [bg, fg] = avatarColor(name || '?');
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: paid ? 'var(--emerald-50)' : bg,
      color: paid ? 'var(--emerald)' : fg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36, fontWeight: 600,
      fontFamily: "'Inter', sans-serif",
      flexShrink: 0,
      transition: 'all .2s',
    }}>
      {paid ? <I.Check size={size * 0.45} stroke={2.5}/> : initials(name)}
    </div>
  );
}
