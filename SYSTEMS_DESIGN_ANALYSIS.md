# ScrollWork — Systems Design Analysis

---

## 1. What is ScrollWork / What is it not?

| IS | IS NOT |
|----|--------|
| Micro-learning video platform (~1 min per concept) | A full LMS (no assessments, progress tracking, auth) |
| Socratic AI tutor powered by **Groq (llama-3.3-70b)** with multi-turn context | A general-purpose chatbot (locked to current video's transcript) |
| Spaced repetition flashcards (SM-2 algorithm, Anki-like) | A gimmick feature — uses proper scheduling math (ease/interval/repetitions) |
| Cross-platform prototype (mobile + web) | A production app (hardcoded Supabase keys, no auth) |
| TikTok-style vertical feed for education | A social media app (like/save/comment buttons are UI-only, no backend) |
| Session tracking with 1-hour daily limit | A comprehensive analytics platform (local-only, no cloud sync) |
| Multi-field (CS, Medical, EE, Aerospace) | Multi-lingual (English only) |

---

## 2. Zoom In / Zoom Out

### Zoom In — Parts of ScrollWork

```
ScrollWork
├── Mobile App (Expo Router — 7 screens)
│   ├── Onboarding (field + difficulty picker)
│   ├── Feed (FlatList video player, snap-scroll, concept tracking)
│   ├── Explore (category grid + trending)
│   ├── Tutor (chat + TTS + flashcard generation)
│   ├── Flashcards (SM-2 review + card browser)
│   ├── Library (session stats, concept breakdown)
│   └── Profile (user summary, session reset)
│   ├── Services
│   │   ├── api.ts (Supabase client + Groq API)
│   │   ├── flashcardStore.ts (SM-2 engine, local JSON persistence)
│   │   └── sessionStore.ts (concept counter, time tracker)
│   └── Components
│       ├── SWTabBar (5-tab: Feed/Explore/Library/Cards/You)
│       ├── SWChip (7 tones, 2 sizes)
│       ├── SWLevelBars (3-bar difficulty visual)
│       └── SWIcon (SVG library + logo mark)
├── Web App (vanilla HTML — 1107 lines)
│   ├── Mobile layout (scroll-snap feed)
│   └── Desktop layout (3-column: sidebar + player + AI panel)
├── Backend (FastAPI)
│   ├── /api/feed (metadata from CSV, difficulty-sorted)
│   ├── /api/transcript/{id} (transcript JSON)
│   └── /api/chat (LangChain + Groq — Socratic tutor)
├── Data Layer (Supabase)
│   ├── PostgreSQL (cs_videos, med_media, ee_videos, aerospace)
│   └── Storage (videos + transcripts per field bucket)
├── AI Layer
│   ├── Groq API (llama-3.3-70b-versatile) — fast inference
│   ├── LangChain orchestration (backend only)
│   └── System prompts (Socratic, flashcard generation)
└── Design System
    ├── Color tokens (OKLCH, semantic naming, light/dark)
    ├── Typography (Inter UI, JetBrains Mono meta)
    └── Design playground (Figma-like canvas in React)
```

### Zoom Out — What is ScrollWork a part of?

ScrollWork sits at the intersection of:
- **Ed-tech / Micro-learning** (Khan Academy Shorts, Duolingo, Primer, Brilliant)
- **Short-form vertical video** (TikTok, Reels, Shorts — educational use)
- **AI tutoring** (Khanmigo, ChatGPT Edu, Quizlet Q-Chat)
- **Spaced repetition / Active recall** (Anki, RemNote, Memrise)
- **Hackathon prototypes** (rapid-build, not production-grade)

---

## 3. Are the parts related?

| Relationship | Status |
|---|---|
| Mobile ↔ Groq API | **Working** — mobile calls Groq directly for AI chat and flashcard generation |
| Mobile ↔ Backend API | **Disconnected** — backend exists but mobile bypasses it entirely for AI (Groq direct) |
| Web ↔ Backend API | **Disconnected** — web queries Supabase directly, never hits FastAPI |
| Mobile ↔ Web | **Design-only** — share tokens/patterns but zero code reuse (different languages) |
| Mobile ↔ Supabase | **Working** — reads video metadata and transcripts directly |
| Web ↔ Supabase | **Working** — same direct access pattern |
| Flashcards ↔ AI Tutor | **Integrated** — AI generates flashcards from video transcripts; tutor detects "make flash cards" keywords |
| Feed ↔ Session Tracking | **Integrated** — feed records concept views and watching time, updates session store |
| Design System ↔ Code | **Manually synced** — design playground is a separate artifact, no code generation |
| AI ↔ Content | **Video-transcript-bound** — AI only knows about the current video's transcript, no cross-video knowledge |

Key insight: **The backend has become an island** — mobile now calls Groq directly, bypassing the FastAPI middleman. The backend's `/api/chat` endpoint (with LangChain) is unused by both frontends. The architecture is effectively Mobile→Supabase+Groq and Web→Supabase, with FastAPI serving only CSV-based feed/transcript endpoints.

---

## 4. RDS Barbell (How is X related to Y?)

### Video Feed ↔ Flashcards
The feed has no direct integration with the flashcard system. Users must manually trigger "make flash cards" from the AI Tutor. There is no automatic card creation when a video is watched, and no adaptive difficulty based on card review performance.

### AI Tutor ↔ Flashcard Generation
Working integration. The AI generates flashcards from video transcripts using a strict prompt that enforces concept-based questions (not video trivia), outputs JSON, and targets spaced repetition quality.

### Mobile ↔ Backend (historical)
The backend originally used Ollama (`minimax-m2.5:cloud`). The pull replaced it with Groq (`llama-3.3-70b-versatile`) on the backend, but mobile independently adopted Groq directly — so the two implementations of Groq coexist with slightly different prompt designs (backend uses LangChain, mobile uses raw fetch).

### Feed ↔ Session Tracking
Tight integration. Every 10 seconds the feed updates time-spent, and each video view records the concept category. A 1-hour daily limit stops playback with a "Time's Up!" overlay.

### Supabase ↔ Backend CSV
Two competing data sources. The backend reads from `data/metadata.csv` for feed/transcript, while mobile and web query Supabase tables directly. Different schemas, no synchronization.

---

## 5. P-Circle (From what points of view should we look at ScrollWork?)

| Lens | What matters |
|---|---|
| **Student/Learner** | Content quality, UI friction, video loading speed, AI response quality, difficulty matching, flashcard efficacy |
| **Content Creator** | No admin panel exists — videos must be uploaded to Supabase storage + database manually. This is a gap |
| **Engineer** | Three Groq integrations (mobile fetch, backend LangChain, web none) — duplication risk. Supabase keys hardcoded (security risk). Web and mobile share no code. Flashcard/Session data stored locally (no cloud sync = data loss on device reset) |
| **Designer** | Strong visual language (pastels, 3-bar difficulty, glass chips) consistently applied across mobile screens. Web lags behind in feature parity (no flashcards, no session tracking) |
| **Product Manager** | No analytics, no auth, no personalization beyond beginner/intermediate/advanced. Core loop (watch → ask AI → review flashcards) is solid but unmeasured. 1-hour session limit is a unique retention lever |
| **Investor** | Improved since initial. Flashcard SM-2 algorithm + Groq integration are the strongest technical assets. Still no moat (TikTok could replicate), no auth/user lock-in, no content creation pipeline. Strong design and clear educational value proposition |
