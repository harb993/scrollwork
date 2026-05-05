// ScrollWork — Web layouts (centered feed + side panels)

// A · Desktop home feed (centered video, right info column, Ask AI side panel)
function SWWebFeedA({ c, dark }) {
  const video = {
    title: 'Why your ECG has five waves, not one',
    subtitle: 'P, Q, R, S, T — each one is a different part of the heartbeat firing.',
    author: 'Dr. Mira Okafor', authorInitial: 'M',
    level: 'beginner', levelLabel: 'Beginner', topic: 'Cardiology',
    duration: '0:48', likes: '12.4k', comments: '142', liked: true,
    progress: [1, 1, 0.4, 0, 0], tone: 'blush',
  };
  return (
    <div style={{
      width: '100%', height: '100%', background: c.paper, color: c.ink,
      fontFamily: SW_FONT, display: 'flex', overflow: 'hidden',
    }}>
      {/* left rail */}
      <div style={{
        width: 240, padding: '24px 18px', flexShrink: 0,
        display: 'flex', flexDirection: 'column', gap: 4,
        borderRight: `1px solid ${c.hairline}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px 22px' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: c.ink, color: c.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SW_FONT, fontSize: 14, fontWeight: 700 }}>S</div>
          <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: -0.3 }}>ScrollWork</div>
        </div>
        {[
          { label: 'Feed',    icon: SWIcon.home,    on: true },
          { label: 'Explore', icon: SWIcon.search,  on: false },
          { label: 'Library', icon: SWIcon.library, on: false },
          { label: 'Profile', icon: SWIcon.user,    on: false },
        ].map((n, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 12,
            background: n.on ? c.raised : 'transparent', color: n.on ? c.ink : c.ink2,
            fontFamily: SW_FONT, fontSize: 14, fontWeight: n.on ? 600 : 500,
          }}>
            {n.icon(20)} {n.label}
          </div>
        ))}
        <div style={{ height: 14 }} />
        <div style={{ fontFamily: SW_MONO, fontSize: 10, color: c.ink3, letterSpacing: 1, textTransform: 'uppercase', padding: '8px 12px 6px' }}>Your level</div>
        {[
          { l: 'Cardiology',     lv: 'beginner' },
          { l: 'Mechanical',     lv: 'intermediate' },
          { l: 'Electrical',     lv: 'beginner' },
          { l: 'Pharmacology',   lv: 'beginner' },
        ].map((t, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 12px', fontSize: 13, color: c.ink2 }}>
            <SWLevelBars level={t.lv} size={11} c={c} />
            <span style={{ flex: 1 }}>{t.l}</span>
          </div>
        ))}
      </div>

      {/* center: video */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 32px' }}>
        <div style={{
          width: 380, height: 676, borderRadius: 22, overflow: 'hidden',
          position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
        }}>
          <SWPlaceholder tone={video.tone} c={c} style={{ position: 'absolute', inset: 0 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%)' }} />
          {/* progress */}
          <div style={{ position: 'absolute', top: 14, left: 14, right: 14, display: 'flex', gap: 4 }}>
            {video.progress.map((p, i) => (
              <div key={i} style={{ flex: 1, height: 2.5, borderRadius: 2, background: 'rgba(255,255,255,0.25)', overflow: 'hidden' }}>
                <div style={{ width: `${p * 100}%`, height: '100%', background: '#fff' }} />
              </div>
            ))}
          </div>
          <div style={{ position: 'absolute', top: 32, left: 14, right: 14, display: 'flex', gap: 8, alignItems: 'center' }}>
            <SWChip c={c} tone="glass">
              <SWLevelBars level={video.level} size={10} c={{ ink: '#fff', hairlineStrong: 'rgba(255,255,255,0.4)' }} />
              <span style={{ marginLeft: 2 }}>{video.levelLabel}</span>
            </SWChip>
            <SWChip c={c} tone="glass">{video.topic}</SWChip>
          </div>
          <div style={{ position: 'absolute', bottom: 24, left: 18, right: 18, color: '#fff' }}>
            <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.2, lineHeight: 1.25, textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}>{video.title}</div>
            <div style={{ marginTop: 6, fontSize: 13, opacity: 0.85 }}>{video.subtitle}</div>
          </div>
          {/* play arrows */}
          <div style={{ position: 'absolute', right: -56, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[true, false].map((up, i) => (
              <button key={i} style={{
                width: 40, height: 40, borderRadius: 20, border: `1px solid ${c.hairline}`,
                background: c.card, color: c.ink2, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={up ? 'M3 9l4-4 4 4' : 'M3 5l4 4 4-4'} />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* action rail */}
        <div style={{ marginLeft: 24, display: 'flex', flexDirection: 'column', gap: 18, color: c.ink2 }}>
          {[
            { i: SWIcon.heart(22),    n: '12.4k', on: true },
            { i: SWIcon.bookmark(22), n: 'Save' },
            { i: SWIcon.comment(22),  n: '142' },
            { i: SWIcon.share(22),    n: 'Share' },
          ].map((a, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 22,
                background: c.card, border: `1px solid ${c.hairline}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: a.on ? c.brand : c.ink,
              }}>{a.i}</div>
              <div style={{ fontFamily: SW_MONO, fontSize: 10, color: c.ink3 }}>{a.n}</div>
            </div>
          ))}
        </div>
      </div>

      {/* right: Ask AI panel */}
      <div style={{
        width: 360, flexShrink: 0, borderLeft: `1px solid ${c.hairline}`,
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '20px 22px', borderBottom: `1px solid ${c.hairline}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 16, background: c.brand, color: c.brandInk, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {SWIcon.sparkle(16)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Ask AI</div>
            <div style={{ fontSize: 11, color: c.ink2, fontFamily: SW_MONO }}>about this video</div>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px' }}>
          <SWAIBubble c={c} role="ai">
            The five letters mark different stages of one heartbeat. <b>P</b> is the atria contracting, <b>QRS</b> is the ventricles firing, <b>T</b> is the ventricles resetting.
          </SWAIBubble>
          <SWAIBubble c={c} role="user">Why is QRS so much taller?</SWAIBubble>
          <SWAIBubble c={c} role="ai">
            The ventricles are bigger and have a lot more muscle than the atria, so when they fire all at once they make a much stronger electrical signal — that's why QRS spikes so high on the trace.
          </SWAIBubble>
        </div>
        <div style={{ padding: '8px 14px 12px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['Real example?', 'Quiz me', 'Simpler please'].map((s, i) => (
            <div key={i} style={{ padding: '7px 12px', borderRadius: 14, background: c.raised, color: c.ink, fontSize: 12, fontWeight: 500 }}>{s}</div>
          ))}
        </div>
        <div style={{ padding: '4px 14px 18px', display: 'flex', gap: 8 }}>
          <div style={{
            flex: 1, height: 40, borderRadius: 20, background: c.raised,
            display: 'flex', alignItems: 'center', padding: '0 14px',
            fontSize: 13, color: c.ink3,
          }}>Ask anything…</div>
          <button style={{
            width: 40, height: 40, borderRadius: 20, border: 'none', cursor: 'pointer',
            background: c.brand, color: c.brandInk, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{SWIcon.mic(18)}</button>
        </div>
      </div>
    </div>
  );
}

// B · Tablet/web Explore — searchable grid
function SWWebExplore({ c, dark }) {
  const cats = ['All', 'Cardiology', 'Mechanical', 'Electrical', 'Pharmacology', 'Civil', 'Materials'];
  const tones = ['blush', 'sage', 'iris', 'peach', 'blush', 'sage', 'iris', 'peach', 'blush', 'sage', 'iris', 'peach'];
  const titles = [
    ['P, Q, R, S, T waves explained', 'Cardiology', 'beginner', '0:48'],
    ['Bernoulli in 60 seconds', 'Mech. eng.', 'intermediate', '1:02'],
    ['Wheatstone bridge: tiny changes', 'Elec. eng.', 'advanced', '1:24'],
    ['How a centrifugal pump works', 'Mech. eng.', 'beginner', '0:54'],
    ['ST elevation: why it matters', 'Cardiology', 'intermediate', '1:11'],
    ['Op-amp golden rules', 'Elec. eng.', 'intermediate', '1:08'],
    ['Beam bending without the math', 'Civil eng.', 'beginner', '0:52'],
    ['First-pass metabolism', 'Pharmacology', 'intermediate', '1:18'],
  ];
  return (
    <div style={{ width: '100%', height: '100%', background: c.paper, color: c.ink, fontFamily: SW_FONT, overflow: 'auto' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '32px 40px 60px' }}>
        {/* search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: c.ink, color: c.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SW_FONT, fontSize: 14, fontWeight: 700, flexShrink: 0 }}>S</div>
          <div style={{
            flex: 1, height: 48, borderRadius: 24, background: c.card,
            border: `1px solid ${c.hairline}`,
            display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px',
            fontSize: 14, color: c.ink3,
          }}>
            <span style={{ color: c.ink2 }}>{SWIcon.search(18)}</span>
            Search a concept, e.g. "fluid dynamics"
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', borderRadius: 24, border: `1px solid ${c.hairline}`, color: c.ink, fontSize: 13, fontWeight: 500 }}>
            {SWIcon.filter(16)} Beginner · Intermediate
          </div>
        </div>

        {/* category chips */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 16, marginBottom: 12 }}>
          {cats.map((cat, i) => (
            <div key={i} style={{
              padding: '8px 14px', borderRadius: 16,
              background: i === 0 ? c.ink : 'transparent',
              color: i === 0 ? c.paper : c.ink2,
              border: i === 0 ? 'none' : `1px solid ${c.hairline}`,
              fontFamily: SW_FONT, fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap',
            }}>{cat}</div>
          ))}
        </div>

        {/* hero row */}
        <div style={{ fontFamily: SW_MONO, fontSize: 11, color: c.ink3, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 12, marginTop: 14 }}>
          Picked for you
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {titles.map((v, i) => (
            <div key={i}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', borderRadius: 14, overflow: 'hidden' }}>
                <SWPlaceholder tone={tones[i]} c={c} style={{ position: 'absolute', inset: 0 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)' }} />
                <div style={{ position: 'absolute', top: 10, left: 10 }}>
                  <SWChip c={c} tone="glass">
                    <SWLevelBars level={v[2]} size={10} c={{ ink: '#fff', hairlineStrong: 'rgba(255,255,255,0.4)' }} />
                  </SWChip>
                </div>
                <div style={{ position: 'absolute', bottom: 10, right: 10, fontFamily: SW_MONO, fontSize: 11, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{v[3]}</div>
                <div style={{ position: 'absolute', bottom: 12, left: 12, right: 50, color: '#fff', fontSize: 14, fontWeight: 600, lineHeight: 1.25, letterSpacing: -0.1 }}>{v[0]}</div>
              </div>
              <div style={{ marginTop: 8, fontFamily: SW_MONO, fontSize: 11, color: c.ink2 }}>{v[1]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SWWebFeedA, SWWebExplore });
