import * as FileSystem from 'expo-file-system/legacy';

const FLASHCARD_FILE = FileSystem.documentDirectory + 'flashcards.json';

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  createdAt: number;
  category?: string;
  // --- Spaced Repetition (SM-2) Fields ---
  ease: number;        // Ease factor, starts at 2.5
  interval: number;    // Days until next review
  repetitions: number; // How many times reviewed successfully
  dueDate: number;     // Timestamp when card is next due
  lastReviewed: number | null;
}

// SM-2 quality ratings
export type Rating = 'again' | 'hard' | 'good' | 'easy';

/**
 * SM-2 Spaced Repetition Algorithm (same as Anki)
 * Returns updated card fields based on the user's rating.
 */
export function calculateNextReview(card: Flashcard, rating: Rating): Partial<Flashcard> {
  const now = Date.now();
  let { ease, interval, repetitions } = card;

  // Map rating to SM-2 quality score (0-5)
  const qualityMap: Record<Rating, number> = {
    'again': 1,
    'hard': 2,
    'good': 4,
    'easy': 5,
  };
  const quality = qualityMap[rating];

  if (quality < 3) {
    // Failed — reset repetitions, short interval
    repetitions = 0;
    interval = rating === 'again' ? 0.00694 : 0.04167; // again = 10 min, hard = 1 hour (in days)
  } else {
    // Passed
    if (repetitions === 0) {
      interval = 0.04167; // 1 hour
    } else if (repetitions === 1) {
      interval = 1; // 1 day
    } else if (repetitions === 2) {
      interval = 3; // 3 days
    } else {
      interval = Math.round(interval * ease);
    }
    repetitions += 1;
  }

  // Update ease factor (never below 1.3)
  ease = Math.max(1.3, ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

  // Bonus for easy
  if (rating === 'easy' && repetitions > 1) {
    interval = Math.round(interval * 1.3);
  }

  const dueDate = now + interval * 24 * 60 * 60 * 1000;

  return {
    ease: Math.round(ease * 100) / 100,
    interval,
    repetitions,
    dueDate,
    lastReviewed: now,
  };
}

function createDefaultCard(question: string, answer: string, category?: string): Flashcard {
  return {
    id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
    question: question.trim(),
    answer: answer.trim(),
    createdAt: Date.now(),
    category,
    ease: 2.5,
    interval: 0,
    repetitions: 0,
    dueDate: Date.now(), // Due immediately (new card)
    lastReviewed: null,
  };
}

export const loadFlashcards = async (): Promise<Flashcard[]> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(FLASHCARD_FILE);
    if (fileInfo.exists) {
      const content = await FileSystem.readAsStringAsync(FLASHCARD_FILE);
      const cards = JSON.parse(content) as Flashcard[];
      // Migrate old cards that don't have SRS fields
      return cards.map(card => ({
        ...card,
        ease: card.ease ?? 2.5,
        interval: card.interval ?? 0,
        repetitions: card.repetitions ?? 0,
        dueDate: card.dueDate ?? Date.now(),
        lastReviewed: card.lastReviewed ?? null,
      }));
    }
  } catch (error) {
    console.error("Failed to load flashcards:", error);
  }
  return [];
};

export const saveFlashcards = async (cards: Flashcard[]) => {
  try {
    await FileSystem.writeAsStringAsync(FLASHCARD_FILE, JSON.stringify(cards, null, 2));
  } catch (error) {
    console.error("Failed to save flashcards:", error);
  }
};

export const addFlashcard = async (question: string, answer: string, category?: string): Promise<Flashcard> => {
  const cards = await loadFlashcards();
  const newCard = createDefaultCard(question, answer, category);
  cards.unshift(newCard);
  await saveFlashcards(cards);
  return newCard;
};

export const reviewCard = async (id: string, rating: Rating): Promise<void> => {
  const cards = await loadFlashcards();
  const idx = cards.findIndex(c => c.id === id);
  if (idx === -1) return;

  const updates = calculateNextReview(cards[idx], rating);
  cards[idx] = { ...cards[idx], ...updates };
  await saveFlashcards(cards);
};

export const deleteFlashcard = async (id: string): Promise<void> => {
  const cards = await loadFlashcards();
  const filtered = cards.filter(c => c.id !== id);
  await saveFlashcards(filtered);
};

/**
 * Get cards that are due for review right now.
 */
export const getDueCards = (cards: Flashcard[]): Flashcard[] => {
  const now = Date.now();
  return cards
    .filter(c => c.dueDate <= now)
    .sort((a, b) => a.dueDate - b.dueDate);
};

/**
 * Get a human-readable string for when a card is next due.
 */
export const getNextDueLabel = (card: Flashcard): string => {
  if (card.lastReviewed === null) return 'New';

  const now = Date.now();
  const diff = card.dueDate - now;

  if (diff <= 0) return 'Due now';

  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;
  const months = Math.floor(days / 30);
  return `${months}mo`;
};
