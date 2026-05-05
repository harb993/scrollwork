// ScrollWork — Mobile Ask AI chat variations

// Suggested chips above input
function SWAISuggestions({ c, items }) {
  return (
    <div style={{
      display: 'flex', gap: 8, padding: '8px 16px 12px',
      overflowX: 'auto', whiteSpace: 'nowrap',
    }}>
      {items.map((s, i) => (
        <button key={i} style={{
          flexShrink: 0, padding: '9px 14px', borderRadius: 18,
          background: c.raised, color: c.ink,
          border: `1px solid ${c.hairline}`, cursor: 'pointer',
          fontFamily: SW_FONT, fontSize: 13, fontWeight: 500,
        }}>{s}</button>
      ))}
    </div>
  );
}

function SWAIBubble({ c, role, children }) {
  const isUser = role === 'user';
  return (
    <div style={{
      display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 10,
    }}>
      <div style={{
        maxWidth: '82%',
        background: isUser ? c.ink : c.card,
        color: isUser ? c.paper : c.ink,
        padding: '11px 14px',
        borderRadius: 18,
        borderBottomRightRadius: isUser ? 6 : 18,
        borderBottomLeftRadius: isUser ? 18 : 6,
        fontFamily: SW_FONT, fontSize: 14.5, lineHeight: 1.45,
        border: isUser ? 'none' : `1px solid ${c.hairline}`,
        boxShadow: isUser ? 'none' : '0 1px 2px rgba(0,0,0,0.03)',
      }}>{children}</div>
    </div>
  );
}

// Bottom-sheet chat (pulled up over feed)
function SWChatSheet({ c, dark, expanded = true, voiceMode = false, suggestionsOnly = false }) {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      top: expanded ? 90 : 540,
      background: c.paper,
      borderTopLeftRadius: 28, borderTopRightRadius: 28,
      boxShadow: '0 -10px 30px rgba(0,0,0,0.15)',
      display: 'flex', flexDirection: 'column',
      zIndex: 30,
    }}>
      {/* grabber */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 6px' }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: c.hairlineStrong }} />
      </div>

      {/* header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '6px 16px 12px',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 16,
          background: c.brand, color: c.brandInk,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{SWIcon.sparkle(16)}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.2 }}>Ask AI</div>
          <div style={{ fontSize: 11, color: c.ink2, fontFamily: SW_MONO, letterSpacing: 0.2 }}>about “ECG: P, Q, R, S, T waves”</div>
        </div>
        <button style={{
          width: 32, height: 32, borderRadius: 16, border: 'none',
          background: c.raised, color: c.ink2, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{SWIcon.x(16)}</button>
      </div>

      {/* messages */}
      <div style={{ flex: 1, overflow: 'auto', padding: '4px 14px 0' }}>
        {!suggestionsOnly && (
          <>
            <SWAIBubble c={c} role="ai">
              The five letters mark different stages of one heartbeat. <b>P</b> is the atria contracting, <b>QRS</b> is the ventricles firing, <b>T</b> is the ventricles resetting.
            </SWAIBubble>
            <SWAIBubble c={c} role="user">Why is QRS so much taller?</SWAIBubble>
            <SWAIBubble c={c} role="ai">
              The ventricles are bigger and have a lot more muscle than the atria, so when they fire all at once they make a much stronger electrical signal — that’s why QRS spikes so high on the trace.
            </SWAIBubble>
          </>
        )}
        {suggestionsOnly && (
          <div style={{ padding: '24px 4px 12px' }}>
            <div style={{ fontSize: 13, color: c.ink2, fontFamily: SW_MONO, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 12 }}>
              I can help with…
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Explain this video like I’m new to it',
                'Give me a real-world example',
                'Quiz me on what was covered',
                'How does this connect to last video?',
              ].map((s, i) => (
                <button key={i} style={{
                  textAlign: 'left', cursor: 'pointer', padding: '14px 16px', borderRadius: 16,
                  background: c.card, border: `1px solid ${c.hairline}`,
                  color: c.ink, fontFamily: SW_FONT, fontSize: 14.5, fontWeight: 500,
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <span style={{ color: c.brand }}>{SWIcon.sparkle(14)}</span>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* suggestions */}
      {!suggestionsOnly && !voiceMode && (
        <SWAISuggestions c={c} items={['Real example?', 'Quiz me', 'Simpler please', 'Next concept']} />
      )}

      {/* input */}
      {!voiceMode ? (
        <div style={{
          padding: '8px 14px 28px', display: 'flex', alignItems: 'center', gap: 10,
          borderTop: `1px solid ${c.hairline}`,
        }}>
          <div style={{
            flex: 1, height: 44, borderRadius: 22, background: c.raised,
            display: 'flex', alignItems: 'center', padding: '0 16px',
            fontFamily: SW_FONT, fontSize: 14, color: c.ink3,
          }}>
            Ask anything about this video…
          </div>
          <button style={{
            width: 44, height: 44, borderRadius: 22, border: 'none', cursor: 'pointer',
            background: c.raised, color: c.ink, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{SWIcon.mic(20)}</button>
        </div>
      ) : (
        <div style={{ padding: '20px 14px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, borderTop: `1px solid ${c.hairline}` }}>
          {/* voice waveform */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 60 }}>
            {[18, 30, 46, 58, 40, 22, 48, 36, 26, 50, 32, 18, 42, 28, 20].map((h, i) => (
              <div key={i} style={{
                width: 4, height: h, borderRadius: 2,
                background: c.brand, opacity: 0.3 + (i % 3) * 0.25,
              }} />
            ))}
          </div>
          <div style={{ fontFamily: SW_MONO, fontSize: 12, color: c.ink2, letterSpacing: 0.3 }}>
            Listening… "explain why qrs is taller"
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 4 }}>
            <button style={{
              width: 56, height: 56, borderRadius: 28, border: 'none', cursor: 'pointer',
              background: c.raised, color: c.ink, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{SWIcon.x(20)}</button>
            <button style={{
              width: 76, height: 56, borderRadius: 28, border: 'none', cursor: 'pointer',
              background: c.brand, color: c.brandInk, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{SWIcon.send(20)}</button>
          </div>
        </div>
      )}
    </div>
  );
}

// A · Chat with messages
function SWChatA({ c, dark }) {
  const video = {
    title: 'Why your ECG has five waves, not one',
    subtitle: '',
    author: 'Dr. Mira Okafor', authorInitial: 'M',
    level: 'beginner', levelLabel: 'Beginner', topic: 'Cardiology',
    duration: '0:48', likes: '12.4k', comments: '142', liked: true,
    progress: [1, 1, 0.4, 0, 0], tone: 'blush',
  };
  return (
    <SWMobileFrame c={c} dark={dark}>
      <SWFeedCard c={c} dark={dark} video={video} paused />
      <div style={{ position: 'absolute', inset: 0, background: c.scrim, zIndex: 25 }} />
      <SWChatSheet c={c} dark={dark} expanded />
    </SWMobileFrame>
  );
}

// B · Initial state — suggestion menu
function SWChatB({ c, dark }) {
  const video = {
    title: 'Bernoulli\u2019s principle, in 60 seconds', subtitle: '',
    author: 'Sam Iyer', authorInitial: 'S',
    level: 'intermediate', levelLabel: 'Intermediate', topic: 'Mech. eng.',
    duration: '1:02', likes: '8.1k', comments: '64',
    progress: [1, 0.7, 0, 0], tone: 'sage',
  };
  return (
    <SWMobileFrame c={c} dark={dark}>
      <SWFeedCard c={c} dark={dark} video={video} paused />
      <div style={{ position: 'absolute', inset: 0, background: c.scrim, zIndex: 25 }} />
      <SWChatSheet c={c} dark={dark} expanded suggestionsOnly />
    </SWMobileFrame>
  );
}

// C · Voice mode
function SWChatC({ c, dark }) {
  const video = {
    title: 'Wheatstone bridge: spotting tiny resistance changes', subtitle: '',
    author: 'Theo Park', authorInitial: 'T',
    level: 'advanced', levelLabel: 'Advanced', topic: 'Elec. eng.',
    duration: '1:24', likes: '3.2k', comments: '88',
    progress: [1, 1, 1, 1, 0.9], tone: 'iris',
  };
  return (
    <SWMobileFrame c={c} dark={dark}>
      <SWFeedCard c={c} dark={dark} video={video} paused />
      <div style={{ position: 'absolute', inset: 0, background: c.scrim, zIndex: 25 }} />
      <SWChatSheet c={c} dark={dark} expanded voiceMode />
    </SWMobileFrame>
  );
}

Object.assign(window, { SWChatSheet, SWChatA, SWChatB, SWChatC });
