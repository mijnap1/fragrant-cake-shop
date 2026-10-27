import { useMemo } from 'react';

const COLORS = ['#ffc1d3', '#ffe0ea', '#ffc1d3', '#d8c8f5'];

export function Petals({ count = 16 }: { count?: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${Math.random() * 100}%`,
        dx: `${Math.random() * 160 - 80}px`,
        duration: `${9 + Math.random() * 9}s`,
        delay: `${-Math.random() * 18}s`,
        color: COLORS[i % COLORS.length],
      })),
    [count],
  );
  return (
    <div className="petals" aria-hidden>
      {petals.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={{ left: p.left, background: p.color, animationDuration: p.duration, animationDelay: p.delay, ['--dx' as string]: p.dx }}
        />
      ))}
    </div>
  );
}
