// ScrollWork — design tokens
// Soft, calm pastels. Study-cozy. Light + dark.
// Type: Inter for UI, JetBrains Mono for tags/meta.

const SW_LIGHT = {
  // surfaces — warm paper-like whites
  paper:    '#FAF7F2',  // app background
  card:     '#FFFFFF',  // raised
  raised:   '#F3EFE7',  // recessed pill / chip
  scrim:    'rgba(28,24,20,0.55)',

  // ink
  ink:      '#1F1B17',
  ink2:     '#5A544C',
  ink3:     '#8C857B',
  hairline: 'rgba(28,24,20,0.08)',
  hairlineStrong: 'rgba(28,24,20,0.14)',

  // accents (oklch — same chroma 0.09, lightness 0.78; vary hue)
  // peach (warm), sage (cool), lavender (cool)
  peach:    'oklch(0.86 0.07 55)',    // primary warm
  peachInk: 'oklch(0.42 0.10 50)',
  sage:     'oklch(0.86 0.06 155)',   // beginner
  sageInk:  'oklch(0.40 0.07 155)',
  blush:    'oklch(0.84 0.08 25)',    // intermediate
  blushInk: 'oklch(0.40 0.10 25)',
  iris:     'oklch(0.80 0.09 285)',   // advanced
  irisInk:  'oklch(0.38 0.12 285)',

  // brand accent (also Ask AI)
  brand:    'oklch(0.72 0.10 50)',    // muted clay
  brandInk: '#FFFFFF',
};

const SW_DARK = {
  paper:    '#15130F',
  card:     '#1E1B16',
  raised:   '#2A2620',
  scrim:    'rgba(0,0,0,0.6)',

  ink:      '#F2EEE6',
  ink2:     '#B8B0A2',
  ink3:     '#7C7468',
  hairline: 'rgba(255,247,230,0.08)',
  hairlineStrong: 'rgba(255,247,230,0.14)',

  peach:    'oklch(0.55 0.07 55)',
  peachInk: 'oklch(0.92 0.05 55)',
  sage:     'oklch(0.50 0.06 155)',
  sageInk:  'oklch(0.92 0.05 155)',
  blush:    'oklch(0.55 0.07 25)',
  blushInk: 'oklch(0.92 0.05 25)',
  iris:     'oklch(0.52 0.08 285)',
  irisInk:  'oklch(0.92 0.05 285)',

  brand:    'oklch(0.78 0.10 50)',
  brandInk: '#1A1612',
};

const SW_FONT = '"Inter", -apple-system, "Segoe UI", system-ui, sans-serif';
const SW_MONO = '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace';

// Difficulty bar metaphor — three ascending bars
function SWLevelBars({ level = 'beginner', size = 14, c }) {
  // level: beginner (1 bar), intermediate (2), advanced (3)
  const filled = { beginner: 1, intermediate: 2, advanced: 3 }[level] || 1;
  const fg = c.ink;
  const dim = c.hairlineStrong;
  const w = size * 0.18;
  const gap = w * 0.55;
  const heights = [size * 0.45, size * 0.72, size * 1];
  return (
    <svg width={size * 1.1} height={size} viewBox={`0 0 ${size * 1.1} ${size}`} style={{ display: 'block' }}>
      {heights.map((h, i) => (
        <rect key={i}
          x={i * (w + gap) + 1} y={size - h}
          width={w} height={h}
          rx={w * 0.4}
          fill={i < filled ? fg : dim}
        />
      ))}
    </svg>
  );
}

// Generic small icons (stroke-only, current color)
const SWIcon = {
  heart: (s = 22) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
    </svg>
  ),
  bookmark: (s = 22) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M6 4h12v17l-6-4-6 4z" />
    </svg>
  ),
  share: (s = 22) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v13M7 8l5-5 5 5M5 14v6h14v-6" />
    </svg>
  ),
  comment: (s = 22) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M4 5h16v12H8l-4 3z" />
    </svg>
  ),
  sparkle: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6z"/>
      <path d="M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9z" opacity=".6"/>
    </svg>
  ),
  search: (s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4 4" />
    </svg>
  ),
  home: (s = 22) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z" />
    </svg>
  ),
  library: (s = 22) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <rect x="4" y="4" width="5" height="16" rx="1" />
      <rect x="11" y="6" width="5" height="14" rx="1" />
      <path d="M18 7l3 .8-3 12-3-.8z" />
    </svg>
  ),
  user: (s = 22) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="9" r="3.5" />
      <path d="M5 20c1-4 4-6 7-6s6 2 7 6" strokeLinecap="round" />
    </svg>
  ),
  mic: (s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </svg>
  ),
  send: (s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 12l18-8-7 18-3-7z" />
    </svg>
  ),
  x: (s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ),
  plus: (s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  check: (s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12l5 5 9-11" />
    </svg>
  ),
  more: (s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="1.7" /><circle cx="12" cy="12" r="1.7" /><circle cx="19" cy="12" r="1.7" />
    </svg>
  ),
  filter: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  ),
};

// Small striped placeholder used for video thumbnails / illustrations
function SWPlaceholder({ tone = 'peach', label, c, style = {}, children }) {
  const tones = {
    peach: c.peach, sage: c.sage, blush: c.blush, iris: c.iris, raised: c.raised,
  };
  const fill = tones[tone] || c.raised;
  // subtle diagonal stripes
  const stripe = `repeating-linear-gradient(135deg, rgba(255,255,255,0.07) 0 8px, rgba(0,0,0,0) 8px 18px)`;
  return (
    <div style={{
      background: fill, position: 'relative', overflow: 'hidden',
      ...style,
    }}>
      <div style={{ position: 'absolute', inset: 0, background: stripe }} />
      {label && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: SW_MONO, fontSize: 10, color: 'rgba(0,0,0,0.45)', letterSpacing: 0.4,
          textTransform: 'uppercase',
        }}>{label}</div>
      )}
      {children}
    </div>
  );
}

// Small typed pill — reused everywhere for tags / meta
function SWChip({ children, c, tone = 'raised', size = 'sm' }) {
  const palette = {
    raised:    { bg: c.raised, fg: c.ink2 },
    beginner:  { bg: c.sage,   fg: c.sageInk },
    intermediate: { bg: c.blush, fg: c.blushInk },
    advanced:  { bg: c.iris,   fg: c.irisInk },
    peach:     { bg: c.peach,  fg: c.peachInk },
    ghost:     { bg: 'transparent', fg: c.ink2 },
    glass:     { bg: 'rgba(255,255,255,0.18)', fg: '#fff' },
  }[tone];
  const py = size === 'sm' ? 4 : 7;
  const px = size === 'sm' ? 10 : 14;
  const fz = size === 'sm' ? 11 : 13;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: `${py}px ${px}px`, borderRadius: 999,
      background: palette.bg, color: palette.fg,
      fontFamily: SW_MONO, fontSize: fz, fontWeight: 500,
      letterSpacing: 0.2, lineHeight: 1, whiteSpace: 'nowrap',
      border: tone === 'ghost' ? `1px solid ${c.hairlineStrong}` : 'none',
    }}>{children}</span>
  );
}

Object.assign(window, { SW_LIGHT, SW_DARK, SW_FONT, SW_MONO, SWLevelBars, SWIcon, SWPlaceholder, SWChip });
