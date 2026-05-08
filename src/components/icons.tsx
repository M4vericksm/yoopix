import type { ReactNode } from 'react';
const Icon = ({ children, size = 20, stroke = 2 }: { children: ReactNode; size?: number; stroke?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

type IconProps = { size?: number; stroke?: number };

export const I = {
  Plus:     (p: IconProps) => <Icon {...p}><path d="M12 5v14M5 12h14"/></Icon>,
  Minus:    (p: IconProps) => <Icon {...p}><path d="M5 12h14"/></Icon>,
  Back:     (p: IconProps) => <Icon {...p}><path d="M19 12H5M12 19l-7-7 7-7"/></Icon>,
  Close:    (p: IconProps) => <Icon {...p}><path d="M18 6L6 18M6 6l12 12"/></Icon>,
  Copy:     (p: IconProps) => <Icon {...p}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></Icon>,
  Share:    (p: IconProps) => <Icon {...p}><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/></Icon>,
  Check:    (p: IconProps) => <Icon {...p}><path d="M20 6L9 17l-5-5"/></Icon>,
  Trash:    (p: IconProps) => <Icon {...p}><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></Icon>,
  History:  (p: IconProps) => <Icon {...p}><path d="M3 12a9 9 0 1018 0 9 9 0 00-18 0M3 12h3M12 7v5l3 2"/></Icon>,
  Receipt:  (p: IconProps) => <Icon {...p}><path d="M4 2h16v20l-3-2-2 2-3-2-3 2-2-2-3 2V2zM8 7h8M8 11h8M8 15h5"/></Icon>,
  Users:    (p: IconProps) => <Icon {...p}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></Icon>,
  Whatsapp: (p: IconProps) => <Icon {...p}><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></Icon>,
  ChevronR: (p: IconProps) => <Icon {...p}><path d="M9 18l6-6-6-6"/></Icon>,
  ChevronL: (p: IconProps) => <Icon {...p}><path d="M15 18l-6-6 6-6"/></Icon>,
  Calendar: (p: IconProps) => <Icon {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></Icon>,
  Pix:      (p: IconProps) => <Icon {...p}><path d="M12 2L3 11l9 9 9-9-9-9z"/><path d="M7.5 11l4.5 4.5L16.5 11"/></Icon>,
  Coins:    (p: IconProps) => <Icon {...p}><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1110.34 18M7 6h1v4M16.71 13.88l.7.71-2.82 2.82"/></Icon>,
};
