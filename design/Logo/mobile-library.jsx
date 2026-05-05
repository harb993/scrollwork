// ScrollWork — Mobile Saved/Library variations

// Reusable: small video thumbnail card
function SWLibThumb({ c, video, size = 'lg' }) {
  const w = size === 'lg' ? 156 : 112;
  const h = size === 'lg' ? 208 : 150;
  return (
    <div style={{ width: w, flexShrink: 0 }}>
      <div style={{ position: 'relative', width: w, height: h, borderRadius: 14, overflow: 'hidden' }}>
        <SWPlaceholder tone={video.tone} c={c} style={{ position: 'absolute', inset: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)' }} />
        <div style={{ position: 'absolute', top: 8, left: 8 }}>
          <SWChip c={c} tone="glass">
            <SWLevelBars level={video.level} size={9} c={{ ink: '#fff', hairlineStrong: 'rgba(255,255,255,0.4)' }} />
          </SWChip>
        </div>
        <div style={{ position: 'absolute', bottom: 8, left: 10, right: 10, color: '#fff', fontSize: 12, fontWeight: 600, lineHeight: 1.25 }}>
          {video.title}
        </div>
        <div style={{ position: 'absolute', bottom: 8, right: 10, fontFamily: SW_MONO, fontSize: 10, color: 'rgba(255,255,255,0.85)' }}>{video.duration}</div>
      </div>
      <div style={{ marginTop: 6, fontSize: 11, color: c.ink2, fontFamily: SW_MONO, letterSpacing: 0.2 }}>{video.topic}</div>
    </div>
  );
}

// Playlist hero card
function SWPlaylistCard({ c, p }) {
  return (
    <div style={{
      borderRadius: 18, overflow: 'hidden', position: 'relative',
      background: c.card, border: `1px solid ${c.hairline}`,
    }}>
      <div style={{ position: 'relative', height: 120, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
        {p.tones.map((t, i) => (
          <SWPlaceholder key={i} tone={t} c={c} style={{ width: '100%', height: '100%' }} />
        ))}
      </div>
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.2 }}>{p.title}</div>
        <div style={{ marginTop: 4, fontFamily: SW_MONO, fontSize: 11, color: c.ink2, display: 'flex', gap: 10 }}>
          <span>{p.count} videos</span>
          <span>·</span>
          <span>{p.duration}</span>
        </div>
      </div>
    </div>
  );
}

// A · Playlist grid (default library view)
function SWLibraryA({ c, dark }) {
  const playlists = [
    { title: 'Cardiology basics', count: 12, duration: '14 min', tones: ['blush','peach','sage'] },
    { title: 'Fluids I keep forgetting', count: 8, duration: '9 min', tones: ['sage','iris','blush'] },
    { title: 'Circuits in the wild', count: 21, duration: '24 min', tones: ['iris','peach','sage'] },
    { title: 'Quick anatomy', count: 5, duration: '6 min', tones: ['peach','blush','iris'] },
  ];
  return (
    <SWMobileFrame c={c} dark={dark}>
      {/* header */}
      <div style={{ padding: '64px 20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: SW_MONO, fontSize: 11, color: c.ink3, letterSpacing: 1.5, textTransform: 'uppercase' }}>Library</div>
            <div style={{ marginTop: 4, fontSize: 28, fontWeight: 600, letterSpacing: -0.5 }}>Saved</div>
          </div>
          <button style={{
            width: 40, height: 40, borderRadius: 20, border: `1px solid ${c.hairlineStrong}`,
            background: 'transparent', color: c.ink, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{SWIcon.plus(20)}</button>
        </div>
      </div>

      {/* segmented */}
      <div style={{ padding: '0 20px 16px', display: 'flex', gap: 6 }}>
        {[{ l: 'Playlists', on: true }, { l: 'All saves', on: false }, { l: 'History', on: false }].map((s, i) => (
          <div key={i} style={{
            padding: '8px 14px', borderRadius: 16,
            background: s.on ? c.ink : 'transparent',
            color: s.on ? c.paper : c.ink2,
            border: s.on ? 'none' : `1px solid ${c.hairline}`,
            fontFamily: SW_FONT, fontSize: 13, fontWeight: 600, letterSpacing: -0.1,
          }}>{s.l}</div>
        ))}
      </div>

      {/* grid */}
      <div style={{
        padding: '0 20px 120px', display: 'grid',
        gridTemplateColumns: '1fr 1fr', gap: 12,
        overflowY: 'auto', position: 'absolute', top: 168, left: 0, right: 0, bottom: 80,
      }}>
        {playlists.map((p, i) => <SWPlaylistCard key={i} c={c} p={p} />)}
      </div>

      <SWTabBar active="library" c={c} />
    </SWMobileFrame>
  );
}

// B · Playlist detail
function SWLibraryB({ c, dark }) {
  const items = [
    { title: 'P, Q, R, S, T waves explained', topic: 'Cardiology', level: 'beginner', duration: '0:48', tone: 'blush' },
    { title: 'Heart blocks: the three you must know', topic: 'Cardiology', level: 'intermediate', duration: '1:14', tone: 'peach' },
    { title: 'Why ST elevation matters', topic: 'Cardiology', level: 'intermediate', duration: '1:02', tone: 'sage' },
    { title: 'Atrial vs ventricular: telling them apart', topic: 'Cardiology', level: 'beginner', duration: '0:55', tone: 'iris' },
    { title: 'Reading lead aVR — the lonely one', topic: 'Cardiology', level: 'advanced', duration: '1:22', tone: 'blush' },
  ];
  return (
    <SWMobileFrame c={c} dark={dark}>
      {/* hero band */}
      <div style={{ position: 'relative', height: 220 }}>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
          {['blush','peach','sage'].map((t, i) => (
            <SWPlaceholder key={i} tone={t} c={c} style={{ width: '100%', height: '100%' }} />
          ))}
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 60%, ' + c.paper + ' 100%)' }} />
        {/* back */}
        <div style={{ position: 'absolute', top: 56, left: 16, width: 40, height: 40, borderRadius: 20, background: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={c.ink} strokeWidth="2" strokeLinecap="round"><path d="M9 2L3 7l6 5"/></svg>
        </div>
      </div>

      <div style={{ padding: '4px 20px 0' }}>
        <div style={{ fontFamily: SW_MONO, fontSize: 11, color: c.ink3, letterSpacing: 1.5, textTransform: 'uppercase' }}>Playlist · 12 videos</div>
        <div style={{ marginTop: 4, fontSize: 26, fontWeight: 600, letterSpacing: -0.5 }}>Cardiology basics</div>
        <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
          <button style={{
            height: 38, padding: '0 16px', borderRadius: 19, border: 'none',
            background: c.ink, color: c.paper, cursor: 'pointer',
            fontFamily: SW_FONT, fontSize: 13, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <svg width="11" height="13" viewBox="0 0 11 13" fill={c.paper}><path d="M0 0v13l11-6.5z"/></svg>
            Resume — 4/12
          </button>
          <button style={{
            width: 38, height: 38, borderRadius: 19, border: `1px solid ${c.hairlineStrong}`,
            background: 'transparent', color: c.ink, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{SWIcon.share(16)}</button>
          <div style={{ flex: 1 }} />
          <button style={{
            width: 38, height: 38, borderRadius: 19, border: 'none',
            background: 'transparent', color: c.ink2, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{SWIcon.more(20)}</button>
        </div>
      </div>

      {/* list */}
      <div style={{ position: 'absolute', top: 360, left: 0, right: 0, bottom: 80, overflowY: 'auto', padding: '8px 20px 16px' }}>
        {items.map((v, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 0', borderTop: i === 0 ? 'none' : `1px solid ${c.hairline}`,
          }}>
            <div style={{ position: 'relative', width: 64, height: 88, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
              <SWPlaceholder tone={v.tone} c={c} style={{ position: 'absolute', inset: 0 }} />
              <div style={{ position: 'absolute', bottom: 4, right: 6, fontFamily: SW_MONO, fontSize: 9, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>{v.duration}</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3, letterSpacing: -0.1 }}>{v.title}</div>
              <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                <SWLevelBars level={v.level} size={11} c={c} />
                <div style={{ fontFamily: SW_MONO, fontSize: 11, color: c.ink2 }}>{v.topic}</div>
              </div>
            </div>
            {i < 3 && (
              <div style={{ color: c.brand }}>{SWIcon.check(20)}</div>
            )}
          </div>
        ))}
      </div>

      <SWTabBar active="library" c={c} />
    </SWMobileFrame>
  );
}

// C · Empty / first-time state with AI suggestion
function SWLibraryC({ c, dark }) {
  return (
    <SWMobileFrame c={c} dark={dark}>
      <div style={{ padding: '64px 20px 16px' }}>
        <div style={{ fontFamily: SW_MONO, fontSize: 11, color: c.ink3, letterSpacing: 1.5, textTransform: 'uppercase' }}>Library</div>
        <div style={{ marginTop: 4, fontSize: 28, fontWeight: 600, letterSpacing: -0.5 }}>Saved</div>
      </div>

      <div style={{ padding: '0 20px 16px', display: 'flex', gap: 6 }}>
        {['Playlists', 'All saves', 'History'].map((l, i) => (
          <div key={i} style={{
            padding: '8px 14px', borderRadius: 16,
            background: i === 1 ? c.ink : 'transparent',
            color: i === 1 ? c.paper : c.ink2,
            border: i === 1 ? 'none' : `1px solid ${c.hairline}`,
            fontFamily: SW_FONT, fontSize: 13, fontWeight: 600,
          }}>{l}</div>
        ))}
      </div>

      {/* recent saves */}
      <div style={{ padding: '4px 20px 12px' }}>
        <div style={{ fontFamily: SW_MONO, fontSize: 10, color: c.ink3, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>This week</div>
      </div>
      <div style={{ padding: '0 20px 18px', display: 'flex', gap: 12, overflowX: 'auto' }}>
        {[
          { title: 'P, Q, R, S, T waves explained', topic: 'Cardiology', level: 'beginner', duration: '0:48', tone: 'blush' },
          { title: 'Bernoulli in 60 seconds', topic: 'Mech. eng.', level: 'intermediate', duration: '1:02', tone: 'sage' },
          { title: 'Wheatstone bridge', topic: 'Elec. eng.', level: 'advanced', duration: '1:24', tone: 'iris' },
        ].map((v, i) => <SWLibThumb key={i} c={c} video={v} size="lg" />)}
      </div>

      {/* AI suggestion card */}
      <div style={{ padding: '8px 20px 0' }}>
        <div style={{
          background: c.card, border: `1px solid ${c.hairline}`,
          borderRadius: 18, padding: '16px 16px 14px',
          display: 'flex', gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 18, background: c.brand,
            color: c.brandInk, display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>{SWIcon.sparkle(18)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: -0.1 }}>Make a playlist of these?</div>
            <div style={{ marginTop: 2, fontSize: 13, color: c.ink2, lineHeight: 1.4 }}>
              Six saves cluster around <b>cardiology basics</b>. I can group them and queue what’s next.
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <button style={{
                height: 36, padding: '0 14px', borderRadius: 18, border: 'none',
                background: c.ink, color: c.paper, cursor: 'pointer',
                fontFamily: SW_FONT, fontSize: 12.5, fontWeight: 600,
              }}>Create playlist</button>
              <button style={{
                height: 36, padding: '0 14px', borderRadius: 18,
                background: 'transparent', color: c.ink2,
                border: `1px solid ${c.hairlineStrong}`, cursor: 'pointer',
                fontFamily: SW_FONT, fontSize: 12.5, fontWeight: 500,
              }}>Not now</button>
            </div>
          </div>
        </div>
      </div>

      <SWTabBar active="library" c={c} />
    </SWMobileFrame>
  );
}

Object.assign(window, { SWLibThumb, SWPlaylistCard, SWLibraryA, SWLibraryB, SWLibraryC });
