import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://iurpjzlajsefupcyluqy.supabase.co';
const SUPABASE_KEY = 'sb_publishable_6PrktCe9nmZEMkuu116nmQ_EG9am4LS';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export interface VideoData {
  id: string;
  video_url: string;
  transcript_url: string;
  category: string;
  difficulty: number;
}

export const api = {
  getFeed: async (field: string, difficulty: string): Promise<VideoData[]> => {
    try {
      // Map the field string from Onboarding to the correct Supabase Table and Bucket
      let tableName = 'cs_videos';
      let bucketName = 'CS-Videos';

      if (field === 'Medical') {
        tableName = 'med_media'; // The user specified med_media is the table name
        bucketName = 'med_media';
      } else if (field === 'EE' || field === 'Electrical Engineering') {
        tableName = 'ee_videos';
        bucketName = 'ee_media';
      } else if (field === 'Aerospace') {
        tableName = 'aerospace'; // The user specified aerospace is the table name
        bucketName = 'as-eng';
      }

      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      if (!data) return [];

      // Map string difficulty to numerical threshold for sorting
      let targetDiff = 5; // default Intermediate
      if (difficulty === 'Beginner') targetDiff = 2;
      else if (difficulty === 'Advanced') targetDiff = 8;

      const sorted = [...data].sort((a, b) => 
        Math.abs(Number(a.difficulty) - targetDiff) - Math.abs(Number(b.difficulty) - targetDiff)
      );

      return sorted.map((vid: any) => ({
        id: String(vid.id),
        video_url: vid.video_url || `${SUPABASE_URL}/storage/v1/object/public/${bucketName}/videos/${vid.video_filename}`,
        transcript_url: vid.transcript_url || `${SUPABASE_URL}/storage/v1/object/public/${bucketName}/transcripts/${vid.transcript_filename}`,
        category: vid.category || 'Unknown',
        difficulty: Number(vid.difficulty) || 0
      }));
    } catch (e) {
      console.error('getFeed Error:', e);
      return [];
    }
  },
  
  getTranscript: async (transcriptUrl: string): Promise<{ text: string }> => {
    try {
      const res = await fetch(transcriptUrl);
      if (!res.ok) throw new Error('Network error');
      const text = await res.text();
      
      try {
        const json = JSON.parse(text);
        return { text: json.text || "Transcript available." };
      } catch {
        return { text };
      }
    } catch (e) {
      console.error('getTranscript Error:', e);
      return { text: 'Transcript unavailable.' };
    }
  },
  
  chat: async (question: string, transcriptUrl?: string): Promise<{ answer: string }> => {
    try {
      let context = "No specific transcript context available.";
      
      if (transcriptUrl) {
        const transcriptResponse = await api.getTranscript(transcriptUrl);
        if (transcriptResponse && transcriptResponse.text) {
          context = transcriptResponse.text;
        }
      }

      // Use Groq API for fast AI tutor responses
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.EXPO_PUBLIC_GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              "role": "system",
              "content": `You are "Scroll," the AI tutor built into the ScrollWork learning platform. You have a warm, encouraging personality — think of yourself as a brilliant grad-student mentor who genuinely loves teaching.

PERSONALITY & TONE:
• Friendly, upbeat, and concise — never robotic or dry.
• Use casual-academic language: smart but approachable. Emojis are okay sparingly (🧠, 💡, ✅).
• Celebrate the student's curiosity: "Great question!" / "Love that you're digging deeper."
• Keep answers SHORT (3-5 sentences max) unless the student asks you to elaborate.

TEACHING METHOD:
1. ANCHOR to the transcript — always tie your answer back to what the student just watched.
2. SOCRATIC FIRST — when a student asks a conceptual "what/why" question, respond with a guiding question before giving the full answer. Example: "Before I explain, what do YOU think happens when…?"
3. ANALOGIES — use real-world analogies to make abstract concepts click.
4. MICRO-QUIZ — after explaining, end with a quick check: "Quick check: can you tell me…?" or "True or false:…"
5. If the student is stuck, give progressively more direct hints rather than the full answer immediately.

BOUNDARIES:
• Stay on-topic to the video's subject matter. If asked something unrelated, gently redirect: "That's outside this video's scope, but here's a quick pointer…"
• Never fabricate facts. If unsure, say so honestly.
• Never produce harmful, biased, or inappropriate content.

VIDEO TRANSCRIPT CONTEXT:
${context}`
            },
            {
              "role": "user",
              "content": question
            }
          ]
        })
      });

      const response = await res.json();
      let answer = "";
      if (response && response.choices && response.choices.length > 0) {
        answer = response.choices[0]?.message?.content || "";
      } else {
        answer = "I'm sorry, I couldn't process that response.";
      }

      return { answer: answer || "I'm sorry, I couldn't process that response." };
      
    } catch (e) {
      console.error('Groq Chat Error:', e);
      return { answer: "I'm sorry, I encountered an error connecting to the AI Tutor server." };
    }
  }
};
