import os
import json
import random
import time
import socket
from pathlib import Path

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd

app = FastAPI(title="Tik-Transcrip API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Paths ---
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
METADATA_CSV = DATA_DIR / "metadata.csv"
TRANSCRIPTS_DIR = DATA_DIR / "downloads" / "transcripts"

# --- Supabase Config ---
SUPABASE_URL = "https://iurpjzlajsefupcyluqy.supabase.co"
SUPABASE_BUCKET = "CS-Videos"

def get_video_url(filename: str) -> str:
    return f"{SUPABASE_URL}/storage/v1/object/public/{SUPABASE_BUCKET}/videos/{filename}"

def get_transcript_url(filename: str) -> str:
    return f"{SUPABASE_URL}/storage/v1/object/public/{SUPABASE_BUCKET}/transcripts/{filename}"


def load_metadata():
    if not METADATA_CSV.exists():
        return []
    df = pd.read_csv(METADATA_CSV)
    return df.to_dict("records")


# --- Models ---
class ChatRequest(BaseModel):
    question: str
    video_id: str = ""
    transcript_snippet: str = ""


# --- Routes ---
@app.get("/")
def health():
    return {"status": "ok", "service": "tik-transcrip-api"}


@app.get("/api/feed")
def get_feed(field: str = "CS", difficulty: int = 0):
    data = load_metadata()
    filtered = [r for r in data if r.get("field") == field]
    filtered.sort(key=lambda x: abs(int(x.get("difficulty", 0)) - difficulty))

    feed = []
    for row in filtered:
        feed.append({
            "id": str(row["original_tiktok_id"]),
            "video_url": get_video_url(row["video_filename"]),
            "transcript_url": get_transcript_url(row["transcript_filename"]),
            "category": row.get("category", "Unknown"),
            "difficulty": int(row.get("difficulty", 0)),
            "video_filename": row["video_filename"],
        })

    top = feed[:10]
    random.shuffle(top)
    return top + feed[10:]


@app.get("/api/transcript/{video_id}")
def get_transcript(video_id: str):
    # Try to find the transcript file by matching original_tiktok_id or filename
    data = load_metadata()
    row = next((r for r in data if str(r["original_tiktok_id"]) == video_id), None)

    if row is None:
        # Try matching by cs_N pattern
        row = next((r for r in data if r["video_filename"].replace(".mp4", "") == video_id), None)

    if row is None:
        return {"text": "Transcript not available."}

    transcript_path = TRANSCRIPTS_DIR / row["transcript_filename"]
    if transcript_path.exists():
        with open(transcript_path, "r") as f:
            content = json.load(f)
            return {"text": content.get("text", ""), "segments": content.get("segments", [])}

    return {"text": "Transcript not available."}


@app.post("/api/chat")
def chat(req: ChatRequest):
    question = req.question.lower()

    # Socratic-style responses — guides the student rather than just answering
    socratic = [
        "Interesting question. What do you think would happen if we doubled the input size? How would that change the number of operations?",
        "Before I answer that — can you tell me what you already understand about this concept? Let's build from there.",
        "That's the right instinct. Try thinking about it this way: if you had to explain this to a 5-year-old, what analogy would you use?",
        "Good question. Let me flip it: why do you think this approach was chosen over the alternatives? What trade-offs do you see?",
        "You're on the right track. Consider: what's the simplest possible case of this problem? Start there and work upward.",
    ]

    if "why" in question:
        answer = "That's the key question. Think about what problem this solves — if we didn't use this approach, what would break? The 'why' often reveals the constraint we're working around."
    elif "what" in question:
        answer = "Let me answer your question with a question: based on what you just watched, how would you define this concept in your own words? I'll help refine your understanding."
    elif "how" in question:
        answer = "Great 'how' question. Try to decompose it: what are the individual steps? If you can identify step 1, I can help you connect the rest."
    elif "explain" in question:
        answer = "Sure. Think of it like this: the core idea is about breaking a big problem into smaller, identical sub-problems. Each sub-problem is easier to solve, and the solutions combine into the final answer."
    else:
        answer = random.choice(socratic)

    return {"answer": answer}


def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"


if __name__ == "__main__":
    import uvicorn
    local_ip = get_local_ip()
    print(f"\n{'='*50}")
    print(f"  Tik-Transcrip API")
    print(f"  Local:   http://127.0.0.1:8000")
    print(f"  Network: http://{local_ip}:8000")
    print(f"  Use the Network URL in your Expo app!")
    print(f"{'='*50}\n")
    uvicorn.run(app, host="0.0.0.0", port=8000)
