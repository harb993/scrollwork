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
      let tableName = 'cs_videos';
      let bucketName = 'CS-Videos';

      if (field === 'Medical') {
        tableName = 'med_media';
        bucketName = 'med_media';
      } else if (field === 'EE' || field === 'Electrical Engineering') {
        tableName = 'ee_videos';
        bucketName = 'ee_media';
      } else if (field === 'Aerospace') {
        tableName = 'aerospace';
        bucketName = 'as-eng';
      } else if (field === 'Computer Science' || field === 'CS') {
        tableName = 'cs_videos';
        bucketName = 'CS-Videos';
      }

      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      if (!data) return [];

      let targetDiff = 5;
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
      if (!transcriptUrl || transcriptUrl.includes('undefined')) return { text: "" };
      const res = await fetch(transcriptUrl);
      if (!res.ok) return { text: "" };
      const text = await res.text();

      try {
        const json = JSON.parse(text);
        return { text: json.text || "" };
      } catch {
        return { text };
      }
    } catch (e) {
      return { text: "" };
    }
  },

  chat: async (question: string, transcriptUrl?: string, conversationHistory?: { role: 'user' | 'assistant'; content: string }[]): Promise<{ answer: string }> => {
    try {
      let context = "";

      if (transcriptUrl) {
        const transcriptResponse = await api.getTranscript(transcriptUrl);
        if (transcriptResponse && transcriptResponse.text && transcriptResponse.text !== 'Transcript unavailable.') {
          context = transcriptResponse.text;
        }
      }

      // Build the messages array with full conversation history
      const systemMessage = {
        "role": "system",
        "content": `You are Scroll, the AI tutor inside the ScrollWork app. The student is watching a short educational video and asking you questions about it. Your responses are read aloud by a TTS engine, so write naturally.

RULES YOU MUST FOLLOW:
- NEVER use emojis, bullet points, numbered lists, asterisks, markdown, or special characters. The TTS engine reads them literally and it sounds broken. Write in plain flowing sentences only.
- Give DIRECT, SPECIFIC answers. Do not repeat the student's question back to them. Do not use filler phrases like "Great question" or "That is a really interesting point." Just answer.
- Keep answers between 2 to 5 sentences. Be concise but thorough. If the concept is complex, explain it step by step in plain language.
- When the student asks a factual question, answer it directly using the transcript. Only use the Socratic method when they ask a conceptual "why" or "how" question.
- If the student says something vague like "explain" or "tell me more," look at the transcript and identify the main concept being taught, then explain that concept clearly.
- Each response must add NEW information. Never repeat what you already said in a previous message. Check the conversation history and build on it.

HOW TO USE THE TRANSCRIPT:
- The transcript below is a speech-to-text transcription of the video the student is watching right now. It may have minor errors from the transcription process.
- Read the ENTIRE transcript carefully. Identify the key concepts, definitions, examples, and any technical terms mentioned.
- When the student asks a question, find the relevant part of the transcript and explain it in your own words. Quote or reference specific details from the transcript to show you understand the content.
- If the transcript discusses multiple topics, focus on the one most relevant to the student's question.
- If the question cannot be answered from the transcript alone, use your general knowledge but explicitly say "The video does not cover this, but from what I know..." so the student understands the source.

${context ? "VIDEO TRANSCRIPT:\n" + context : "No transcript is available for this video. Answer based on your general knowledge and let the student know the transcript was not available."}`
      };

      const messages: any[] = [systemMessage];

      // Add conversation history for multi-turn context
      if (conversationHistory && conversationHistory.length > 0) {
        // Send last 10 messages max to stay within token limits
        const recent = conversationHistory.slice(-10);
        for (const msg of recent) {
          messages.push({
            "role": msg.role,
            "content": msg.content
          });
        }
      }

      // Add the current question
      messages.push({
        "role": "user",
        "content": question
      });

      // Use Groq API for fast AI tutor responses
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.EXPO_PUBLIC_GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: messages,
          temperature: 0.4,
          max_tokens: 400,
        })
      });

      if (!res.ok) {
        let errorMsg = "I'm sorry, I encountered an error. Please try again.";
        try {
          const errorData = await res.json();
          if (errorData.error && errorData.error.message) {
             errorMsg = "API Error: " + errorData.error.message;
          }
        } catch (e) {}
        console.error('Groq API Error Status:', res.status, errorMsg);
        return { answer: errorMsg };
      }

      const response = await res.json();
      let answer = "";
      if (response?.choices?.[0]?.message?.content) {
        answer = response.choices[0].message.content.trim();
        // Strip emojis, bullets, asterisks, and markdown formatting
        answer = answer.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
        // Remove markdown bold/italic markers
        answer = answer.replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1');
        // Remove numbered list prefixes like "1. " or "2) "
        answer = answer.replace(/^\d+[\.\)]\s+/gm, '');
        // Remove bullet markers
        answer = answer.replace(/^[\-\•]\s+/gm, '');
        // Collapse any double spaces or leading newlines
        answer = answer.replace(/\n{2,}/g, ' ').replace(/\s{2,}/g, ' ').trim();
      } else {
        console.error('Unexpected Groq API response format:', response);
        answer = "I'm sorry, I couldn't process that response.";
      }

      return { answer: answer || "I'm sorry, I couldn't process that response." };

    } catch (e) {
      console.error('Groq Chat Error:', e);
      return { answer: "I'm sorry, I encountered an error connecting to the AI Tutor server." };
    }
  },

  generateFlashcards: async (transcriptUrl: string, count: number = 5): Promise<{ question: string; answer: string }[]> => {
    try {
      let context = "";
      if (transcriptUrl) {
        const transcriptResponse = await api.getTranscript(transcriptUrl);
        if (transcriptResponse && transcriptResponse.text && transcriptResponse.text !== 'Transcript unavailable.') {
          context = transcriptResponse.text;
        }
      }

      if (!context) {
        return [];
      }

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
              "content": `You are an expert educational flash card creator. You will be given a transcript from an educational video. Your job is to extract the CORE ACADEMIC CONCEPTS taught in the video and turn them into flash cards that help students truly learn and retain knowledge.

WHAT TO DO:
- Identify the fundamental concepts, definitions, laws, principles, and relationships explained in the transcript.
- Write questions that test UNDERSTANDING of these concepts, not recall of video-specific details.
- Answers should explain the concept clearly in 1-3 sentences, as if from a textbook.

WHAT TO ABSOLUTELY AVOID:
- NEVER ask about specific numbers, values, or examples used in the video (e.g. "What voltage was used?" or "How many resistors were shown?"). These are irrelevant trivia.
- NEVER ask "What is the main topic of the video?" or "What was discussed in the video?" — these are useless.
- NEVER reference "the video" or "the demonstration" in your questions. The flash cards should stand alone as study material.
- NEVER ask about the video creator, format, or structure.

GOOD EXAMPLES:
- "What is Ohm's Law and how does it relate voltage, current, and resistance?"
- "What happens to current in a circuit when resistance increases, assuming voltage stays constant?"
- "Define electrical resistance and explain what factors affect it."

BAD EXAMPLES (DO NOT DO THIS):
- "What voltage was used in the video?" — This is trivia, not knowledge.
- "What is the main topic of the video?" — This tests nothing.
- "What two resistors were used in the demonstration?" — Irrelevant detail.

Create exactly ${count} flash cards. Each must test a DIFFERENT concept.

You MUST respond in this EXACT JSON format and nothing else:
[{"q":"question text here","a":"answer text here"},{"q":"question text here","a":"answer text here"}]

Do not include any text before or after the JSON array. Only output valid JSON.`
            },
            {
              "role": "user",
              "content": `Generate ${count} flash cards from this transcript:\n\n${context}`
            }
          ],
          temperature: 0.3,
          max_tokens: 1000,
        })
      });

      if (!res.ok) return [];

      const response = await res.json();
      const content = response?.choices?.[0]?.message?.content?.trim() || "";

      // Parse the JSON array from the response
      try {
        // Try to extract JSON array even if there's surrounding text
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (!jsonMatch) return [];

        const parsed = JSON.parse(jsonMatch[0]);
        if (!Array.isArray(parsed)) return [];

        return parsed
          .filter((card: any) => card.q && card.a)
          .map((card: any) => ({
            question: String(card.q).trim(),
            answer: String(card.a).trim(),
          }));
      } catch {
        console.error('Failed to parse flashcard JSON:', content);
        return [];
      }
    } catch (e) {
      console.error('generateFlashcards Error:', e);
      return [];
    }
  }
};
