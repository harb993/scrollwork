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
  
  chat: async (question: string, videoId: string): Promise<{ answer: string }> => {
    question = question.toLowerCase();
    await new Promise(r => setTimeout(r, 1200)); 
    
    const socratic = [
        "Interesting question. What do you think would happen if we doubled the input size?",
        "Before I answer that — can you tell me what you already understand about this concept?",
        "That's the right instinct. Try thinking about it this way: if you had to explain this to a 5-year-old, what analogy would you use?",
        "Good question. Let me flip it: why do you think this approach was chosen over the alternatives?",
    ];

    let answer = socratic[Math.floor(Math.random() * socratic.length)];
    if (question.includes("why")) answer = "That's the key question. Think about what problem this solves — if we didn't use this approach, what would break?";
    else if (question.includes("what")) answer = "Let me answer your question with a question: based on what you just watched, how would you define this concept in your own words?";
    else if (question.includes("how")) answer = "Great 'how' question. Try to decompose it: what are the individual steps?";

    return { answer };
  }
};
