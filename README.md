# ScrollWork

ScrollWork is an educational platform designed to teach highly technical concepts—like engineering, medicine, and computer science—one concept and one minute at a time. By replacing the traditional doom-scrolling feed with a highly-focused, beautifully designed learning experience, ScrollWork paces learning to the user's actual comprehension level using a dynamic matrix of complexity.

## 🎨 Design Philosophy

ScrollWork uses a meticulously crafted **study-cozy pastel aesthetic**, featuring both Light and Dark modes. The interface is specifically designed to reduce cognitive overload and maximize focus, utilizing carefully curated OKLCH color palettes (such as *Peach*, *Sage*, *Blush*, and *Iris*) and modern typography (`Inter` and `JetBrains Mono`). 

The UI feels premium, soft, and inviting, encouraging deeper exploration into difficult topics.

## 📱 Platforms

The codebase is split into three main components:

### 1. `mobile/` (React Native / Expo)
The core mobile application built with React Native and Expo. It features:
- A multi-step Onboarding flow to configure the user's focus area and starting difficulty.
- An immersive TikTok-style video feed (`SWFeedCard`) with lazy loading and dynamic metadata tagging.
- An integrated **Ask AI** Tutor (`SWChatSheet`) that allows users to ask context-aware questions about the current video's transcript.

### 2. `web/` (Vanilla Web App)
A highly optimized, pure HTML/CSS implementation of the ScrollWork feed.
- Uses `IntersectionObserver` to manage video playback and lazy loading effortlessly.
- Integrates directly with Supabase for data fetching.
- Mirrors the soft, pastel UI architecture of the mobile app via native CSS variables.

### 3. `backend/` (FastAPI)
A lightweight Python backend that powers the AI Tutor.
- Connects to LLMs via LangChain to provide context-aware chat assistance based on the video transcripts.
- Exposes RESTful endpoints consumed by the mobile app.

### 4. `design/`
The raw React UI playground and design files used to architect the `ScrollWork` component suite.

## 🚀 Getting Started

### Prerequisites
- Node.js & npm
- Python 3.9+
- Expo Go (for mobile testing)
- Supabase Account

### Running the Mobile App
```bash
cd mobile
npm install
npx expo start -c
```

### Running the Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Running the Web App
Simply serve the `web/` directory using any local HTTP server:
```bash
cd web
python -m http.server 8080
# Navigate to http://localhost:8080 in your browser
```

## 🧠 Database Architecture
We use **Supabase** for our database and video storage. The data is partitioned by focus areas (e.g., `cs_videos`, `med_media`, `ee_videos`, `aerospace`), and videos are categorized by dynamic difficulty levels.

## 🤝 Contributors
Built with ❤️ for the Hackathon.
