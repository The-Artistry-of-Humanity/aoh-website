import { useEffect, useId, useRef, useState } from 'react';

// The Five Pillars pentagon, ported from the old site's PentagonDiagram.
// Same geometry (radius 0.35 of size, five grid rings, axes, score polygon and
// dots); restyled for the new site, with two-line labels sized to stay legible
// on a phone. Scores are 0 to 100, one per pillar, in pillar order.

interface Props {
  scores?: number[];
  size?: number;
  showLabels?: boolean;
  /** Overall score shown in the centre (results view only). */
  centre?: number;
  /** Illustrative shape (start screen): the label for screen readers names the pillars only. */
  sample?: boolean;
  className?: string;
}

const LABELS: { lines: [string, string]; anchor: 'middle' | 'start' | 'end' }[] = [
  { lines: ['Health &', 'Fitness'], anchor: 'middle' },
  { lines: ['Internal', 'Work'], anchor: 'start' },
  { lines: ['Love &', 'Relationships'], anchor: 'middle' },
  { lines: ['Social', 'Connections'], anchor: 'middle' },
  { lines: ['Work &', 'Life Flow'], anchor: 'end' },
];

const LIME = '#D9EA6E';
const ON_DARK = '#F6F4E9';
const GRID = 'rgba(228,240,214,.14)';

const PentagonDiagram = ({ scores = [80, 65, 70, 55, 75], size = 320, showLabels = true, centre, sample = false, className = '' }: Props) => {
  const gid = 'pg' + useId().replace(/[^a-zA-Z0-9]/g, '');
  const ref = useRef<SVGSVGElement>(null);
  const [shown, setShown] = useState<number[]>(scores.map(() => 0));
  const [visible, setVisible] = useState(false);
  const shownRef = useRef(shown);
  shownRef.current = shown;

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) { setVisible(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Grow the polygon from where it is to the new scores.
  const key = scores.join(',');
  useEffect(() => {
    if (!visible) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setShown(scores); return; }
    const from = shownRef.current.slice();
    let raf = 0;
    let start = 0;
    const step = (t: number) => {
      if (!start) start = t;
      const k = Math.min(1, (t - start) / 1000);
      const e = 1 - Math.pow(1 - k, 3);
      setShown(scores.map((s, i) => (from[i] ?? 0) + (s - (from[i] ?? 0)) * e));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    const timer = setTimeout(() => { raf = requestAnimationFrame(step); }, 100);
    return () => { clearTimeout(timer); cancelAnimationFrame(raf); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, key]);

  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.35;
  const pt = (i: number, r: number) => {
    const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };
  const poly = (r: (i: number) => number) => Array.from({ length: 5 }, (_, i) => pt(i, r(i)));
  const path = (ps: { x: number; y: number }[]) => ps.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ') + ' Z';

  const outer = poly(() => R);
  const scored = poly((i) => R * ((shown[i] ?? 0) / 100));

  const fs = size * 0.05;
  // Room around the pentagon for the labels; without labels, just the shape.
  const vb = showLabels ? [-size * 0.135, -size * 0.02, size * 1.27, size * 0.955] : [size * 0.15, size * 0.13, size * 0.7, size * 0.67];
  const names = LABELS.map((l) => l.lines.join(' '));
  const aria = sample || !showLabels
    ? 'The Five Pillars: ' + names.join(', ')
    : 'Your Five Pillars: ' + names.map((n, i) => `${n} ${Math.round(scores[i] ?? 0)}`).join(', ');

  return (
    <svg ref={ref} viewBox={vb.map((n) => n.toFixed(1)).join(' ')} className={className} role="img"
      aria-label={aria}
      style={{ display: 'block', width: '100%', height: 'auto', overflow: 'visible' }}>
      {[0.2, 0.4, 0.6, 0.8, 1].map((s) => (
        <polygon key={s} points={poly(() => R * s).map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')} fill="none" stroke={GRID} strokeWidth="0.75" />
      ))}
      {outer.map((p, i) => <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={GRID} strokeWidth="0.75" />)}
      <path d={path(outer)} fill="none" stroke="rgba(228,240,214,.36)" strokeWidth="1.5" />
      <path d={path(scored)} fill="rgba(217,234,110,.2)" stroke={LIME} strokeWidth="2" strokeLinejoin="round" />
      {centre !== undefined && (
        <>
          <defs>
            <radialGradient id={gid}>
              <stop offset="0" stopColor="#0F2015" stopOpacity="0.86" />
              <stop offset="0.6" stopColor="#0F2015" stopOpacity="0.6" />
              <stop offset="1" stopColor="#0F2015" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx={cx} cy={cy + size * 0.01} r={size * 0.17} fill={`url(#${gid})`} />
        </>
      )}
      {scored.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill={LIME} />)}

      {showLabels && LABELS.map((l, i) => {
        const v = outer[i];
        // Side labels sit just outside their corner; top and bottom ones on the label ring.
        const at = l.anchor === 'middle' ? pt(i, size * 0.44) : { x: v.x + (l.anchor === 'start' ? 12 : -12), y: v.y };
        const lh = fs * 1.12;
        return (
          <text key={i} x={at.x} y={at.y} textAnchor={l.anchor} fill={ON_DARK} fillOpacity="0.86" fontSize={fs} fontWeight={500}
            fontFamily="'DM Sans', system-ui, sans-serif" aria-hidden="true">
            <tspan x={at.x} y={at.y - lh / 2 + fs * 0.35}>{l.lines[0]}</tspan>
            <tspan x={at.x} y={at.y + lh / 2 + fs * 0.35}>{l.lines[1]}</tspan>
          </text>
        );
      })}

      {centre !== undefined && (
        <g aria-hidden="true" style={{ paintOrder: 'stroke' }}>
          <text x={cx} y={cy - 4 + size * 0.16 * 0.34} textAnchor="middle" fill={LIME} fontSize={size * 0.16}
            fontFamily="'DM Serif Display', Georgia, serif" stroke="#0F2015" strokeWidth="5" strokeOpacity="0.55" strokeLinejoin="round">{centre}</text>
          <text x={cx} y={cy + size * 0.09 + size * 0.034 * 0.35} textAnchor="middle" fill={ON_DARK} fillOpacity="0.72" fontSize={size * 0.034}
            fontWeight={600} letterSpacing={size * 0.006} fontFamily="'DM Sans', system-ui, sans-serif" stroke="#0F2015" strokeWidth="3" strokeOpacity="0.5">FULFILMENT</text>
        </g>
      )}
    </svg>
  );
};

export default PentagonDiagram;
