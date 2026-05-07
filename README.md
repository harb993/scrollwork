# ScrollWork

ScrollWork is an educational platform designed to teach highly technical concepts—like engineering, medicine, and computer science—one concept and one minute at a time. It replaces doom-scrolling with a focused, beautifully designed micro-learning experience that adapts to the user's comprehension level.

---

## Features

- **TikTok-style vertical video feed** — Full-screen educational videos with snap-scrolling, auto-play, and dynamic difficulty metadata
- **AI Tutor ("Ask AI")** — Context-aware chat assistant powered by Groq (llama-3.3-70b-versatile) with multi-turn conversation, Socratic questioning, and TTS via expo-speech
- **Spaced Repetition Flashcards** — SM-2 algorithm (same as Anki) with AI-generated cards from video transcripts, flip-to-reveal, and 4-level rating (Again/Hard/Good/Easy)
- **Session Tracking** — Concepts viewed counter, time spent tracking, 1-hour daily session limit
- **Multi-field Content** — Computer Science, Medical, Electrical Engineering, Aerospace (separate Supabase tables per field)
- **Difficulty-based Personalization** — Beginner / Intermediate / Advanced with a 3-bar visual metaphor
- **Light/Dark Mode** — Study-cozy pastel aesthetic with OKLCH color palettes (Peach, Sage, Blush, Iris)
- **Cross-platform** — Mobile (React Native/Expo) and Web (vanilla HTML/CSS)

---

## 🎨 Design Philosophy

The interface uses a meticulously crafted **study-cozy pastel aesthetic** designed to reduce cognitive overload. It leverages OKLCH color palettes (Peach, Sage, Blush, Iris) and modern typography (Inter for UI, JetBrains Mono for metadata). The design feels premium, soft, and inviting, encouraging deeper exploration into difficult topics.

---

## 📱 Platforms

### 1. `mobile/` (React Native / Expo)

Expo Router app with file-based routing across 5 screens:

| Screen | Route | Description |
|--------|-------|-------------|
| Onboarding | `index.tsx` | 2-step: splash + field/difficulty picker |
| Feed | `feed.tsx` | TikTok-style vertical FlatList, video auto-play, concept tracking |
| Explore | `explore.tsx` | Category grid + trending content |
| Tutor | `tutor.tsx` | AI chat with TTS, suggestion chips, flashcard generation |
| Flashcards | `flashcards.tsx` | SM-2 spaced repetition review + card browser |
| Library | `library.tsx` | Learning stats, session history, concept breakdown |
| Profile | `profile.tsx` | User summary, time spent, session reset |

**Key services:**
- `api.ts` — Supabase client + Groq API integration (chat + flashcard generation)
- `flashcardStore.ts` — SM-2 spaced repetition algorithm with local persistence
- `sessionStore.ts` — Concept counter and time-spent tracking
- `constants/theme.ts` — Design tokens with light/dark mode via `useColorScheme()`
- `components/SWUI.tsx` — SWLevelBars, SWChip, SWTabBar (5-tab: Feed/Explore/Library/Cards/You)
- `components/SWIcon.tsx` — SVG icon library with logo mark

### 2. `web/` (Vanilla HTML/CSS/JS)

A responsive single-file web app (1107 lines) with two layouts:
- **Mobile** (< 900px): Full-screen scroll-snap feed with IntersectionObserver for lazy video loading and auto-play/pause
- **Desktop** (>= 900px): Three-column layout — left sidebar, center phone-frame video player, right AI panel

Directly integrates with Supabase via the JS SDK.

### 3. `backend/` (FastAPI)

A Python backend that supports the AI Tutor (now uses Groq instead of Ollama):

| Route | Method | Description |
|-------|--------|-------------|
| `/` | GET | Health check |
| `/api/feed` | GET | Video feed sorted by difficulty proximity |
| `/api/transcript/{id}` | GET | Full transcript + segments for a video |
| `/api/chat` | POST | AI Tutor with Socratic prompting via LangChain + Groq |

### 4. `design/`

React-based UI design playground for visual prototyping of the ScrollWork component suite.

---

## 🚀 Getting Started

### Prerequisites
- Node.js & npm
- Python 3.9+
- Expo Go (for mobile testing on device)
- Supabase Account
- Groq API Key (set as `EXPO_PUBLIC_GROQ_API_KEY` for mobile, or `GROQ_API_KEY` for backend)

### One-Command Launchers

```bash
./run.sh          # macOS / Linux / WSL
start.bat         # Windows (opens 3 terminals: backend, web, Expo)
```

### Running Individually

```bash
# Mobile
cd mobile && npm install && npx expo start -c

# Backend (port 8012)
cd backend && pip install -r requirements.txt && python main.py

# Web (port 8080)
cd web && python -m http.server 8080
```

---

## 🧠 Architecture

- **Data Layer**: Supabase (PostgreSQL per field + object storage for videos/transcripts)
- **AI Layer**: Groq API (llama-3.3-70b-versatile) with LangChain orchestration
- **Mobile**: Direct Supabase access + Groq API via fetch
- **Web**: Direct Supabase access only (no backend dependency)
- **Backend**: FastAPI middleman with LangChain + Groq (partially used)

---

## 🤝 Contributors

Built with ❤️ for the Hackathon.
