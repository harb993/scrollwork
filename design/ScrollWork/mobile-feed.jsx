// ScrollWork — Mobile home feed (video player) variations

// Reusable: lock-screen-style video card filling the frame
function SWFeedCard({ c, dark, video, paused = false }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      background: video.tone ? '#000' : c.paper,
    }}>
      {/* video plate */}
      <SWPlaceholder tone={video.tone} c={c}
        style={{ position: 'absolute', inset: 0 }} />

      {/* dark scrim at bottom for legibility */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.55) 100%)',
      }} />

      {/* progress bar (thin, top under nav) */}
      <div style={{
        position: 'absolute', top: 56, left: 16, right: 16,
        display: 'flex', gap: 4,
      }}>
        {video.progress.map((p, i) => (
          <div key={i} style={{
            flex: 1, height: 2.5, borderRadius: 2,
            background: 'rgba(255,255,255,0.25)',
            overflow: 'hidden',
          }}>
            <div style={{ width: `${p * 100}%`, height: '100%', background: '#fff' }} />
          </div>
        ))}
      </div>

      {/* top meta */}
      <div style={{
        position: 'absolute', top: 80, left: 16, right: 16,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <SWChip c={c} tone="glass">
          <SWLevelBars level={video.level} size={10} c={{ ink: '#fff', hairlineStrong: 'rgba(255,255,255,0.4)' }} />
          <span style={{ marginLeft: 2 }}>{video.levelLabel}</span>
        </SWChip>
        <SWChip c={c} tone="glass">{video.topic}</SWChip>
        <div style={{ flex: 1 }} />
        <SWChip c={c} tone="glass">{video.duration}</SWChip>
      </div>

      {/* center play button when paused */}
      {paused && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 76, height: 76, borderRadius: 38,
          background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(14px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="28" height="32" viewBox="0 0 28 32" fill="#fff">
            <path d="M2 2l24 14L2 30z" />
          </svg>
        </div>
      )}

      {/* right rail */}
      <div style={{
        position: 'absolute', right: 12, bottom: 200,
        display: 'flex', flexDirection: 'column', gap: 22,
        color: '#fff', alignItems: 'center',
      }}>
        {[
          { i: SWIcon.heart(28),    n: video.likes,    on: video.liked },
          { i: SWIcon.bookmark(26), n: 'Save',         on: video.saved },
          { i: SWIcon.comment(26),  n: video.comments },
          { i: SWIcon.share(26),    n: 'Share' },
        ].map((a, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              color: a.on ? c.peach : '#fff', filter: a.on ? 'none' : 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))',
            }}>{a.i}</div>
            <div style={{ fontFamily: SW_MONO, fontSize: 10, fontWeight: 500, letterSpacing: 0.3, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{a.n}</div>
          </div>
        ))}
      </div>

      {/* bottom info block */}
      <div style={{
        position: 'absolute', left: 16, right: 88, bottom: 116,
        color: '#fff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 14,
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: SW_FONT, fontWeight: 700, fontSize: 12,
          }}>{video.authorInitial}</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{video.author}</div>
          <div style={{ fontFamily: SW_MONO, fontSize: 11, opacity: 0.7 }}>· follow</div>
        </div>
        <div style={{ fontSize: 19, fontWeight: 600, lineHeight: 1.25, textShadow: '0 1px 6px rgba(0,0,0,0.4)', textWrap: 'pretty' }}>
          {video.title}
        </div>
        <div style={{ marginTop: 6, fontSize: 13, opacity: 0.85, lineHeight: 1.4, textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}>
          {video.subtitle}
        </div>
      </div>

      {/* Ask AI floating button */}
      <button style={{
        position: 'absolute', right: 14, bottom: 116,
        height: 44, padding: '0 16px 0 12px', borderRadius: 22,
        background: c.brand, color: c.brandInk,
        border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 6,
        fontFamily: SW_FONT, fontSize: 14, fontWeight: 600, letterSpacing: -0.1,
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      }}>
        {SWIcon.sparkle(16)}
        Ask AI
      </button>
    </div>
  );
}

// A · Standard reels-style feed
function SWFeedA({ c, dark }) {
  const video = {
    title: 'Why your ECG has five waves, not one',
    subtitle: 'P, Q, R, S, T — each one is a different part of the heartbeat firing.',
    author: 'Dr. Mira Okafor', authorInitial: 'M',
    level: 'beginner', levelLabel: 'Beginner', topic: 'Cardiology',
    duration: '0:48',
    likes: '12.4k', comments: '142', liked: true, saved: false,
    progress: [1, 1, 0.4, 0, 0],
    tone: 'blush',
  };
  return (
    <SWMobileFrame c={c} dark={dark}>
      <SWFeedCard c={c} dark={dark} video={video} />
      <SWTabBar active="home" c={c} />
    </SWMobileFrame>
  );
}

// B · Mid-scroll between two videos (peek of next)
function SWFeedB({ c, dark }) {
  const v1 = {
    title: 'Bernoulli\u2019s principle, in 60 seconds',
    subtitle: 'Faster fluid = lower pressure. That\u2019s really it.',
    author: 'Sam Iyer', authorInitial: 'S',
    level: 'intermediate', levelLabel: 'Intermediate', topic: 'Mech. eng.',
    duration: '1:02',
    likes: '8.1k', comments: '64',
    progress: [1, 0.7, 0, 0],
    tone: 'sage',
  };
  return (
    <SWMobileFrame c={c} dark={dark}>
      <div style={{ position: 'absolute', inset: 0, transform: 'translateY(-90px)' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <SWFeedCard c={c} dark={dark} video={v1} />
        </div>
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, height: 844, marginTop: 8 }}>
          <SWPlaceholder tone="iris" c={c} style={{ position: 'absolute', inset: 0 }} label="next: bandwidth basics" />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 30%)' }} />
        </div>
      </div>
      {/* hint banner */}
      <div style={{
        position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(12px)',
        color: '#fff', padding: '8px 14px', borderRadius: 16,
        fontFamily: SW_MONO, fontSize: 11, letterSpacing: 0.4,
        display: 'flex', alignItems: 'center', gap: 8,
        zIndex: 30,
      }}>
        {SWIcon.sparkle(14)} You're ready for this one
      </div>
      <SWTabBar active="home" c={c} />
    </SWMobileFrame>
  );
}

// C · Paused with mini-quiz overlay
function SWFeedC({ c, dark }) {
  const video = {
    title: 'Wheatstone bridge: spotting tiny resistance changes',
    subtitle: 'Why every strain gauge in the world uses this circuit.',
    author: 'Theo Park', authorInitial: 'T',
    level: 'advanced', levelLabel: 'Advanced', topic: 'Elec. eng.',
    duration: '1:24',
    likes: '3.2k', comments: '88',
    progress: [1, 1, 1, 1, 0.9],
    tone: 'iris',
  };
  const [picked, setPicked] = React.useState(1);
  return (
    <SWMobileFrame c={c} dark={dark}>
      <SWFeedCard c={c} dark={dark} video={video} paused />

      {/* quiz sheet */}
      <div style={{
        position: 'absolute', left: 12, right: 12, bottom: 100,
        background: c.card, color: c.ink,
        borderRadius: 24, padding: '20px 18px 16px',
        boxShadow: '0 16px 40px rgba(0,0,0,0.25)',
        zIndex: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <SWChip c={c} tone="peach"><span>Quick check</span></SWChip>
          <div style={{ flex: 1 }} />
          <div style={{ fontFamily: SW_MONO, fontSize: 11, color: c.ink3 }}>1 / 2</div>
        </div>
        <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: -0.2, lineHeight: 1.3, marginTop: 4, textWrap: 'pretty' }}>
          A bridge is balanced when…
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
          {[
            'All four resistances are equal',
            'The ratio of resistances on each arm is equal',
            'The supply voltage is zero',
          ].map((opt, i) => {
            const on = picked === i;
            return (
              <button key={i} onClick={() => setPicked(i)}
                style={{
                  textAlign: 'left', cursor: 'pointer',
                  background: on ? c.raised : 'transparent',
                  border: `1px solid ${on ? c.hairlineStrong : c.hairline}`,
                  color: c.ink,
                  borderRadius: 14, padding: '12px 14px',
                  fontFamily: SW_FONT, fontSize: 14, lineHeight: 1.35,
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 11,
                  border: `1.5px solid ${on ? c.ink : c.hairlineStrong}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: SW_MONO, fontSize: 11, color: on ? c.ink : c.ink3, flexShrink: 0,
                }}>{['A', 'B', 'C'][i]}</span>
                {opt}
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <button style={{
            flex: 1, height: 44, borderRadius: 22, border: 'none', cursor: 'pointer',
            background: 'transparent', color: c.ink2, fontFamily: SW_FONT, fontSize: 14, fontWeight: 500,
          }}>Skip</button>
          <button style={{
            flex: 2, height: 44, borderRadius: 22, border: 'none', cursor: 'pointer',
            background: c.ink, color: c.paper, fontFamily: SW_FONT, fontSize: 14, fontWeight: 600,
          }}>Check answer</button>
        </div>
      </div>

      <SWTabBar active="home" c={c} />
    </SWMobileFrame>
  );
}

Object.assign(window, { SWFeedCard, SWFeedA, SWFeedB, SWFeedC });
