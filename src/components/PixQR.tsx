import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface Props {
  value: string;
  size?: number;
}

export default function PixQR({ value, size = 220 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !value) return;
    QRCode.toCanvas(canvasRef.current, value, {
      width: size,
      margin: 2,
      color: { dark: '#1c1917', light: '#ffffff' },
    }).catch(console.error);
  }, [value, size]);

  return (
    <canvas
      ref={canvasRef}
      style={{ borderRadius: 12, display: 'block' }}
    />
  );
}
