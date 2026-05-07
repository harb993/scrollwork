# ScrollWork — Architecture

---

## 1. System Overview

ScrollWork is a three-tier educational micro-learning platform. Users watch short (~1 min) vertical videos, ask an AI tutor questions about the content, and review flashcards generated from transcripts.

```
┌──────────────────────────────────────────────────────────────┐
│                        USERS                                 │
│                  Mobile (Expo) / Web (HTML)                  │
└──────────────────────┬───────────────────────────────────────┘
                       │
          ┌────────────┼────────────────────┐
          ▼            ▼                    ▼
   ┌──────────┐ ┌──────────┐      ┌────────────────┐
   │  Mobile  │ │   Web    │      │   Backend API   │
   │  (Expo)  │ │ (Vanilla)│      │  FastAPI :8012   │
   └────┬─────┘ └────┬─────┘      └────────┬───────┘
        │            │                      │
        │     ┌──────┘                      │
        ▼     ▼                             ▼
   ┌──────────────────┐           ┌──────────────────┐
   │    Supabase       │           │  Groq API        │
   │  (DB + Storage)   │           │  (AI Inference)   │
   └──────────────────┘           └──────────────────┘
```

---

## 2. Layers

### 2.1 Mobile App (`mobile/`)

**Framework:** React Native 0.81.5 + Expo SDK 54 + Expo Router (file-based routing)

**Screens (7):**

| Route | Screen | Purpose |
|-------|--------|---------|
| `/` | `index.tsx` | Onboarding — field + difficulty selection |
| `/feed` | `feed.tsx` | TikTok-style video feed with snap-scroll, auto-play, concept tracking |
| `/explore` | `explore.tsx` | Category grid + trending content browser |
| `/tutor` | `tutor.tsx` | AI chat with TTS, suggestion chips, flashcard generation |
| `/flashcards` | `flashcards.tsx` | SM-2 spaced repetition review + card browser |
| `/library` | `library.tsx` | Learning stats, concept breakdown, session history |
| `/profile` | `profile.tsx` | User summary, time spent, session reset |

**Navigation:** 5-tab `SWTabBar` — Feed | Explore | Library | Cards | You

**Key Services:**
- `api.ts` — Supabase client (video metadata) + Groq API (chat, flashcard generation)
- `flashcardStore.ts` — SM-2 spaced repetition algorithm, local JSON persistence via `expo-file-system`
- `sessionStore.ts` — Concept counter and time-spent tracking, also local JSON

### 2.2 Web App (`web/index.html`)

**Framework:** Vanilla HTML5 / CSS3 / JavaScript (single file, 1107 lines)

**Layouts:**
- **Mobile** (< 900px): Full-viewport scroll-snap feed with `IntersectionObserver`
- **Desktop** (>= 900px): Three-column — sidebar, center phone-frame video player, right AI panel

**Data:** Direct Supabase queries via JS SDK. No backend dependency.

### 2.3 Backend (`backend/main.py`)

**Framework:** FastAPI (Python), served via Uvicorn on port 8012

| Route | Method | Source | Description |
|-------|--------|--------|-------------|
| `/` | GET | — | Health check |
| `/api/feed` | GET | `data/metadata.csv` | Video feed sorted by difficulty proximity |
| `/api/transcript/{id}` | GET | `data/downloads/transcripts/` | Transcript JSON for a video |
| `/api/chat` | POST | Groq (via LangChain) | AI Tutor with Socratic prompt |

**Status:** Largely unused by frontends. Mobile bypasses it (calls Groq directly). Web doesn't use it at all.

---

## 3. Data Flow

### Feed Loading
```
User → Mobile/Web → Supabase Query (table per field)
                   → Return video metadata + transcript URLs
                   → Render in FlatList (mobile) / scroll container (web)
```

### AI Chat
```
User Question → Mobile → Groq API (llama-3.3-70b-versatile)
                        → System prompt + transcript context + conversation history
                        → Streaming response → Display in chat bubble + TTS
```

### Flashcard Generation
```
User: "Make flash cards" → Mobile → Detect keyword
                                   → Fetch transcript from Supabase
                                   → Groq API (llama-3.3-70b) with flashcard prompt
                                   → Parse JSON response → Save to local storage
                                   → Display preview in chat
```

### Session Tracking
```
View Video → Mobile → recordConcept(category) → sessionStore.json
                     → updateTimeSpent(10s interval) → sessionStore.json
                     → 1-hour limit check → Stop playback if exceeded
```

---

## 4. Data Model

### Supabase Tables (inferred)

**`cs_videos`**, **`med_media`**, **`ee_videos`**, **`aerospace`**

| Column | Type | Notes |
|--------|------|-------|
| `id` | integer | Primary key |
| `video_url` | text | Constructed from filename if null |
| `transcript_url` | text | Constructed from filename if null |
| `video_filename` | text | Used to build storage URL |
| `transcript_filename` | text | Used to build storage URL |
| `category` | text | Concept name (e.g. "Data Structures") |
| `difficulty` | integer | 0–10 scale |
| `field` | text | CS, Medical, EE, Aerospace |
| `original_tiktok_id` | text | Source identifier |

### Supabase Storage Buckets

| Field | Bucket |
|-------|--------|
| Computer Science | `CS-Videos` |
| Medical | `med_media` |
| Electrical Engineering | `ee_media` |
| Aerospace | `as-eng` |

### Local Mobile Storage (JSON files on device)

| File | Data |
|------|------|
| `flashcards.json` | SM-2 card data (ease, interval, repetitions, dueDate) |
| `session_data.json` | Concept counters + time spent seconds |

---

## 5. AI Layer

### Groq API Integration

**Model:** `llama-3.3-70b-versatile`

**Two integration points:**
1. **Mobile (api.ts)** — Raw `fetch()` to `https://api.groq.com/openai/v1/chat/completions`. Key via `EXPO_PUBLIC_GROQ_API_KEY` env var.
2. **Backend (main.py)** — LangChain `ChatGroq` wrapper. Key via `GROQ_API_KEY` env var.

**Prompts:**

| Purpose | Traits |
|---------|--------|
| **AI Tutor** | Socratic method, transcript-bound, no emojis/markdown (TTS-safe), multi-turn context, 2–5 sentences |
| **Flashcards** | Concept-level questions only (no video trivia), JSON output only, SM-2 quality target |

### Prompt Design Evolution

| Version | Model | Location | Notes |
|---------|-------|----------|-------|
| v1 (original) | `minimax-m2.5:cloud` (Ollama) | Backend | First iteration, local LLM |
| v2 (current) | `llama-3.3-70b-versatile` (Groq) | Backend + Mobile | Switched to Groq for speed, mobile went direct |

---

## 6. Design System

### Tokens (`mobile/constants/theme.ts`)

- **Color space:** OKLCH (perceptually uniform)
- **Semantic naming:** `paper`, `card`, `raised`, `ink`, `ink2`, `ink3`, `hairline`
- **Accents:** Peach, Sage, Blush, Iris (each with ink variant)
- **Light/Dark:** Dual palette via `useColorScheme()`

### Components (`mobile/components/`)

| Component | Purpose |
|-----------|---------|
| `SWTabBar` | 5-tab bottom navigation |
| `SWChip` | Pill-shaped tag, 7 tones, 2 sizes |
| `SWLevelBars` | 3-bar difficulty visual (Beginner/Intermediate/Advanced) |
| `SWIcon` | SVG icon library + logo mark |

---

## 7. Integration Gaps

| Gap | Impact |
|-----|--------|
| **Backend is an island** | FastAPI exists with LangChain + Groq, but mobile calls Groq directly and web doesn't use it at all. The backend only serves CSV-based feed/transcript endpoints. |
| **No auth** | Both clients use Supabase's public anon key. "I have an account" button is a no-op. No user isolation. |
| **No cloud sync** | Flashcards and session data are stored locally on device (JSON files). Data loss occurs on app reinstall or device reset. |
| **Web lacks feature parity** | No flashcards, no session tracking, no Groq AI chat on web. Only a video feed. |
| **Duplicate AI prompts** | Mobile and backend have separate Groq prompt implementations with slightly different instructions. No single source of truth. |
| **Duplicated data sources** | Backend reads from CSV; mobile/web read from Supabase. Same data, different schemas, no sync mechanism. |

---

## 8. Key Metrics

| Metric | Value |
|--------|-------|
| Mobile screens | 7 |
| Web app | 1107 lines (single file) |
| Backend | 180 lines (FastAPI) |
| AI model | `llama-3.3-70b-versatile` (Groq) |
| Spaced repetition | SM-2 (Anki algorithm) |
| Ports | Backend: 8012, Web: 8080 |
| Fields | CS, Medical, EE, Aerospace |
| Difficulty scale | 0–10, mapped to Beginner(2) / Intermediate(5) / Advanced(8) |
| Session limit | 1 hour per day (mobile only) |
