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
from langchain_community.chat_models import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

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


# --- LLM Setup ---
llm = ChatOllama(model="minimax-m2.5:cloud")

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an academic AI tutor for the ScrollWork learning platform. Your goal is to guide the student toward understanding the material through Socratic questioning and clear, concise explanations. Do not just give away the answer directly if it's a conceptual question; encourage the student to think. Use the following transcript from the current video as context to answer the student's question. If the answer cannot be found in or inferred from the transcript, rely on your general academic knowledge but keep it relevant to the topic.\n\nVideo Transcript Context:\n{context}"),
    ("human", "{question}")
])

chain = prompt | llm | StrOutputParser()

@app.post("/api/chat")
def chat(req: ChatRequest):
    context = req.transcript_snippet
    
    # If no snippet provided, try to fetch the full transcript
    if not context and req.video_id:
        transcript_data = get_transcript(req.video_id)
        context = transcript_data.get("text", "")
        
    if not context:
        context = "No specific transcript context available."

    try:
        answer = chain.invoke({
            "context": context,
            "question": req.question
        })
    except Exception as e:
        answer = f"I'm sorry, I encountered an error while thinking about your question. ({str(e)})"

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
