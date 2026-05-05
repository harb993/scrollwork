import * as FileSystem from 'expo-file-system/legacy';

const SESSION_FILE = FileSystem.documentDirectory + 'session_data.json';

export interface SessionData {
  concepts: { [key: string]: number };
  timeSpentSeconds: number;
}

export const loadSession = async (): Promise<SessionData> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(SESSION_FILE);
    if (fileInfo.exists) {
      const content = await FileSystem.readAsStringAsync(SESSION_FILE);
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("Failed to load session:", error);
  }
  return { concepts: {}, timeSpentSeconds: 0 };
};

export const saveSession = async (data: SessionData) => {
  try {
    await FileSystem.writeAsStringAsync(SESSION_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Failed to save session:", error);
  }
};

export const recordConcept = async (conceptName: string) => {
  if (!conceptName) return;
  const data = await loadSession();
  if (!data.concepts[conceptName]) {
    data.concepts[conceptName] = 0;
  }
  data.concepts[conceptName]++;
  await saveSession(data);
  console.log(`[Concept Counter] Recorded concept: ${conceptName}. Total concepts seen:`, data.concepts);
};

export const updateTimeSpent = async (secondsToAdd: number): Promise<number> => {
  const data = await loadSession();
  data.timeSpentSeconds += secondsToAdd;
  await saveSession(data);
  return data.timeSpentSeconds;
};
