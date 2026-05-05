// ScrollWork — Mobile screens
// Each screen is a 390×844 view (iOS frame inner). Renders inside <IOSDevice>.
// Light/dark via `c` palette prop.

// ─────────────────────────────────────────────────────────────
// Shared mobile pieces
// ─────────────────────────────────────────────────────────────
function SWMobileFrame({ c, dark, children, hideHomeIndicator }) {
  // Replaces IOSDevice content but uses SW palette as bg
  return (
    <div style={{
      position: 'absolute', inset: 0, background: c.paper, color: c.ink,
      fontFamily: SW_FONT, overflow: 'hidden',
    }}>
      {children}
    </div>
  );
}

// Bottom tab bar — paper, hairline border
function SWTabBar({ active = 'home', c, onTab }) {
  const tabs = [
    { id: 'home',    label: 'Feed',    icon: SWIcon.home },
    { id: 'search',  label: 'Explore', icon: SWIcon.search },
    { id: 'library', label: 'Library', icon: SWIcon.library },
    { id: 'profile', label: 'You',     icon: SWIcon.user },
  ];
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      paddingBottom: 28, paddingTop: 10, paddingLeft: 12, paddingRight: 12,
      display: 'flex', justifyContent: 'space-around',
      background: c.paper,
      borderTop: `1px solid ${c.hairline}`,
      zIndex: 5,
    }}>
      {tabs.map(t => {
        const isOn = t.id === active;
        return (
          <button key={t.id} onClick={() => onTab && onTab(t.id)}
            style={{
              border: 'none', background: 'transparent', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              padding: '6px 12px', color: isOn ? c.ink : c.ink3,
              fontFamily: SW_FONT, fontSize: 10, fontWeight: 600, letterSpacing: 0.3,
            }}>
            {t.icon(22)}
            <span style={{ textTransform: 'uppercase' }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 1. ONBOARDING — Level pick (variations)
// ─────────────────────────────────────────────────────────────

// A · Calm three-card stack
function SWOnboardLevelA({ c, dark }) {
  const [picked, setPicked] = React.useState('intermediate');
  const levels = [
    { id: 'beginner',     bars: 1, title: 'Beginner',     blurb: 'Brand-new to the topic. Start with the fundamentals.' },
    { id: 'intermediate', bars: 2, title: 'Intermediate', blurb: 'Comfortable with the basics. Ready to go deeper.' },
    { id: 'advanced',     bars: 3, title: 'Advanced',     blurb: 'Experienced. Skip past the introductions.' },
  ];
  const tones = { beginner: c.sage, intermediate: c.blush, advanced: c.iris };
  return (
    <SWMobileFrame c={c} dark={dark}>
      <div style={{ padding: '88px 24px 32px' }}>
        <div style={{ fontFamily: SW_MONO, fontSize: 11, color: c.ink3, letterSpacing: 1.5, textTransform: 'uppercase' }}>
          Step 2 of 3
        </div>
        <div style={{ marginTop: 12, fontSize: 30, fontWeight: 600, lineHeight: 1.15, letterSpacing: -0.6, textWrap: 'pretty' }}>
          Where are you at,<br/>generally?
        </div>
        <div style={{ marginTop: 10, fontSize: 15, color: c.ink2, lineHeight: 1.45, maxWidth: 300 }}>
          You can change this any time, and per topic later.
        </div>
      </div>

      <div style={{ padding: '8px 20px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {levels.map(l => {
          const on = picked === l.id;
          return (
            <button key={l.id} onClick={() => setPicked(l.id)}
              style={{
                textAlign: 'left', cursor: 'pointer',
                background: on ? c.card : c.card,
                border: `1.5px solid ${on ? c.ink : c.hairline}`,
                borderRadius: 18, padding: '18px 18px',
                display: 'flex', alignItems: 'center', gap: 16,
                fontFamily: SW_FONT, color: c.ink,
                transition: 'border-color .12s, background .12s',
              }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: tones[l.id], display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <SWLevelBars level={l.id} size={22} c={c} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: -0.2 }}>{l.title}</div>
                <div style={{ fontSize: 13, color: c.ink2, marginTop: 2, lineHeight: 1.35 }}>{l.blurb}</div>
              </div>
              <div style={{
                width: 22, height: 22, borderRadius: 11,
                border: `1.5px solid ${on ? c.ink : c.hairlineStrong}`,
                background: on ? c.ink : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, color: c.paper,
              }}>
                {on && SWIcon.check(14)}
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ position: 'absolute', left: 20, right: 20, bottom: 36 }}>
        <button style={{
          width: '100%', height: 54, borderRadius: 27,
          background: c.ink, color: c.paper,
          border: 'none', cursor: 'pointer',
          fontFamily: SW_FONT, fontSize: 16, fontWeight: 600, letterSpacing: -0.2,
        }}>
          Continue
        </button>
      </div>
    </SWMobileFrame>
  );
}

// B · Topic-by-topic level matrix
function SWOnboardLevelB({ c, dark }) {
  const topics = [
    { id: 'cardio', name: 'Cardiology' },
    { id: 'mech',   name: 'Mechanical eng.' },
    { id: 'elec',   name: 'Electrical eng.' },
    { id: 'pharm',  name: 'Pharmacology' },
    { id: 'civil',  name: 'Civil eng.' },
  ];
  const [picks, setPicks] = React.useState({
    cardio: 'beginner', mech: 'intermediate', elec: 'beginner',
    pharm: 'beginner', civil: 'intermediate',
  });
  return (
    <SWMobileFrame c={c} dark={dark}>
      <div style={{ padding: '78px 24px 20px' }}>
        <div style={{ fontFamily: SW_MONO, fontSize: 11, color: c.ink3, letterSpacing: 1.5, textTransform: 'uppercase' }}>
          Step 3 of 3
        </div>
        <div style={{ marginTop: 10, fontSize: 26, fontWeight: 600, lineHeight: 1.15, letterSpacing: -0.4, textWrap: 'pretty' }}>
          Set a level<br/>per topic.
        </div>
        <div style={{ marginTop: 8, fontSize: 14, color: c.ink2 }}>Tap to cycle. We use this to pace your feed.</div>
      </div>

      <div style={{ padding: '4px 20px 0', display: 'flex', flexDirection: 'column' }}>
        {topics.map((t, i) => {
          const lv = picks[t.id];
          const next = { beginner: 'intermediate', intermediate: 'advanced', advanced: 'beginner' };
          const labels = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };
          return (
            <button key={t.id}
              onClick={() => setPicks({ ...picks, [t.id]: next[lv] })}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: '18px 4px', display: 'flex', alignItems: 'center', gap: 14,
                borderTop: i === 0 ? 'none' : `1px solid ${c.hairline}`,
                fontFamily: SW_FONT, color: c.ink, textAlign: 'left',
              }}>
              <div style={{ flex: 1, fontSize: 17, fontWeight: 500, letterSpacing: -0.2 }}>{t.name}</div>
              <SWLevelBars level={lv} size={16} c={c} />
              <div style={{ fontFamily: SW_MONO, fontSize: 11, color: c.ink2, minWidth: 88, textAlign: 'right' }}>
                {labels[lv]}
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ position: 'absolute', left: 20, right: 20, bottom: 36, display: 'flex', gap: 10 }}>
        <button style={{
          flex: 1, height: 54, borderRadius: 27,
          background: 'transparent', color: c.ink2,
          border: `1.5px solid ${c.hairlineStrong}`, cursor: 'pointer',
          fontFamily: SW_FONT, fontSize: 15, fontWeight: 500,
        }}>Skip</button>
        <button style={{
          flex: 2, height: 54, borderRadius: 27,
          background: c.ink, color: c.paper,
          border: 'none', cursor: 'pointer',
          fontFamily: SW_FONT, fontSize: 16, fontWeight: 600, letterSpacing: -0.2,
        }}>Start scrolling</button>
      </div>
    </SWMobileFrame>
  );
}

// C · Welcome / brand
function SWOnboardLevelC({ c, dark }) {
  return (
    <SWMobileFrame c={c} dark={dark}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
        {/* hero */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <SWPlaceholder tone="peach" c={c} style={{ position: 'absolute', inset: 0 }} />
          {/* big typographic glyph */}
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontFamily: SW_FONT, fontWeight: 700, fontSize: 220,
            color: c.peachInk, letterSpacing: -8, opacity: 0.35,
            lineHeight: 1, paddingTop: 40,
          }}>S</div>
          {/* status spacer covered by frame */}
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 24,
            textAlign: 'center', color: c.peachInk,
          }}>
            <div style={{ fontFamily: SW_MONO, fontSize: 11, letterSpacing: 1.8, textTransform: 'uppercase', opacity: 0.7 }}>
              ScrollWork
            </div>
          </div>
        </div>

        <div style={{ padding: '32px 28px 24px', background: c.paper }}>
          <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: -0.6, lineHeight: 1.1, textWrap: 'balance' }}>
            One concept,<br/>one minute.
          </div>
          <div style={{ marginTop: 12, fontSize: 15, color: c.ink2, lineHeight: 1.5, textWrap: 'pretty' }}>
            Short videos that teach you one thing at a time, paced to where you actually are. Engineering, medicine, and more.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 28 }}>
            <button style={{
              height: 54, borderRadius: 27, border: 'none', cursor: 'pointer',
              background: c.ink, color: c.paper,
              fontFamily: SW_FONT, fontSize: 16, fontWeight: 600,
            }}>Get started</button>
            <button style={{
              height: 54, borderRadius: 27, border: 'none', cursor: 'pointer',
              background: 'transparent', color: c.ink2,
              fontFamily: SW_FONT, fontSize: 15, fontWeight: 500,
            }}>I have an account</button>
          </div>

          <div style={{ marginTop: 18, paddingBottom: 24, fontFamily: SW_MONO, fontSize: 10, color: c.ink3, textAlign: 'center', letterSpacing: 0.5 }}>
            By continuing you agree to our terms.
          </div>
        </div>
      </div>
    </SWMobileFrame>
  );
}

Object.assign(window, { SWMobileFrame, SWTabBar, SWOnboardLevelA, SWOnboardLevelB, SWOnboardLevelC });
