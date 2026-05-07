import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Animated, Alert, Dimensions
} from 'react-native';
import { useTheme } from '../constants/theme';
import { SWTabBar } from '../components/SWUI';
import { SWIcon } from '../components/SWIcon';
import { useRouter, useFocusEffect } from 'expo-router';
import {
  loadFlashcards, deleteFlashcard, reviewCard, getDueCards, getNextDueLabel,
  Flashcard, Rating
} from '../services/flashcardStore';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;

// ─── Review Card with Flip ──────────────────────────────────────────
function ReviewCard({ card, colors, typography, onRate }: {
  card: Flashcard;
  colors: any;
  typography: any;
  onRate: (rating: Rating) => void;
}) {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [revealed, setRevealed] = useState(false);

  const flipToFront = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  const flipToBack = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const handleReveal = () => {
    if (revealed) return;
    Animated.spring(flipAnim, {
      toValue: 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setRevealed(true);
  };

  const RATINGS: { key: Rating; label: string; color: string; bg: string }[] = [
    { key: 'again', label: 'Again', color: '#DC2626', bg: '#FEE2E2' },
    { key: 'hard',  label: 'Hard',  color: '#D97706', bg: '#FEF3C7' },
    { key: 'good',  label: 'Good',  color: '#059669', bg: '#D1FAE5' },
    { key: 'easy',  label: 'Easy',  color: '#2563EB', bg: '#DBEAFE' },
  ];

  return (
    <View style={{ alignItems: 'center' }}>
      <TouchableOpacity activeOpacity={0.95} onPress={handleReveal} style={{ marginBottom: 24 }}>
        <View style={{ width: CARD_WIDTH, height: 260 }}>
          {/* Front — Question */}
          <Animated.View style={{
            position: 'absolute', width: '100%', height: '100%',
            backfaceVisibility: 'hidden',
            transform: [{ rotateY: flipToFront }],
          }}>
            <View style={{
              flex: 1, backgroundColor: colors.card, borderRadius: 24,
              padding: 28, justifyContent: 'space-between',
              borderWidth: 1, borderColor: colors.hairline,
              shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08, shadowRadius: 16, elevation: 4,
            }}>
              <View>
                <View style={{
                  backgroundColor: colors.peach, paddingHorizontal: 10, paddingVertical: 5,
                  borderRadius: 8, alignSelf: 'flex-start', marginBottom: 18,
                }}>
                  <Text style={{
                    fontFamily: typography.fontFamilyMono, fontSize: 10,
                    color: colors.peachInk, letterSpacing: 0.4, textTransform: 'uppercase',
                  }}>
                    Question
                  </Text>
                </View>
                <Text style={{
                  fontFamily: typography.fontFamilyMedium, fontSize: 17,
                  color: colors.ink, lineHeight: 24,
                }}>
                  {card.question}
                </Text>
              </View>
              <Text style={{
                fontFamily: typography.fontFamily, fontSize: 13,
                color: colors.ink3, textAlign: 'center',
              }}>
                Tap to reveal answer
              </Text>
            </View>
          </Animated.View>

          {/* Back — Answer */}
          <Animated.View style={{
            position: 'absolute', width: '100%', height: '100%',
            backfaceVisibility: 'hidden',
            transform: [{ rotateY: flipToBack }],
          }}>
            <View style={{
              flex: 1, backgroundColor: colors.brand, borderRadius: 24,
              padding: 28, justifyContent: 'space-between',
              shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1, shadowRadius: 16, elevation: 4,
            }}>
              <View>
                <View style={{
                  backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 10, paddingVertical: 5,
                  borderRadius: 8, alignSelf: 'flex-start', marginBottom: 18,
                }}>
                  <Text style={{
                    fontFamily: typography.fontFamilyMono, fontSize: 10,
                    color: colors.brandInk, letterSpacing: 0.4, textTransform: 'uppercase',
                  }}>
                    Answer
                  </Text>
                </View>
                <Text style={{
                  fontFamily: typography.fontFamily, fontSize: 15.5,
                  color: colors.brandInk, lineHeight: 22,
                }}>
                  {card.answer}
                </Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </TouchableOpacity>

      {/* Rating Buttons — only shown after revealing */}
      {revealed && (
        <View>
          <Text style={{
            fontFamily: typography.fontFamilyMedium, fontSize: 13, color: colors.ink2,
            textAlign: 'center', marginBottom: 12,
          }}>
            How well did you know this?
          </Text>
          <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center' }}>
            {RATINGS.map(r => (
              <TouchableOpacity
                key={r.key}
                onPress={() => onRate(r.key)}
                style={{
                  paddingVertical: 12, paddingHorizontal: 16, borderRadius: 14,
                  backgroundColor: r.bg, minWidth: 72, alignItems: 'center',
                }}
              >
                <Text style={{
                  fontFamily: typography.fontFamilyBold, fontSize: 13, color: r.color,
                }}>
                  {r.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

// ─── Browse Card (smaller, for the list view) ───────────────────────
function BrowseCard({ card, colors, typography, onDelete }: {
  card: Flashcard;
  colors: any;
  typography: any;
  onDelete: (id: string) => void;
}) {
  const dueLabel = getNextDueLabel(card);
  const isNew = card.lastReviewed === null;
  const isDue = card.dueDate <= Date.now();

  return (
    <View style={{
      backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 10,
      borderWidth: 1, borderColor: colors.hairline,
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={{
            fontFamily: typography.fontFamilyMedium, fontSize: 14, color: colors.ink,
            lineHeight: 19,
          }} numberOfLines={2}>
            {card.question}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => Alert.alert('Delete Card', 'Remove this flash card?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => onDelete(card.id) },
          ])}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {SWIcon.x(14, colors.ink3)}
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={{
          paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
          backgroundColor: isNew ? colors.iris : isDue ? colors.peach : colors.sage,
        }}>
          <Text style={{
            fontFamily: typography.fontFamilyMono, fontSize: 9.5,
            color: isNew ? colors.irisInk : isDue ? colors.peachInk : colors.sageInk,
            letterSpacing: 0.3,
          }}>
            {isNew ? 'NEW' : isDue ? 'DUE' : dueLabel}
          </Text>
        </View>
        {card.repetitions > 0 && (
          <Text style={{
            fontFamily: typography.fontFamilyMono, fontSize: 10, color: colors.ink3,
          }}>
            {card.repetitions} reviews
          </Text>
        )}
        <Text style={{
          fontFamily: typography.fontFamilyMono, fontSize: 10, color: colors.ink3,
        }}>
          ease {card.ease.toFixed(1)}
        </Text>
      </View>
    </View>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────
export default function Flashcards() {
  const { colors, typography } = useTheme();
  const router = useRouter();
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [dueCards, setDueCards] = useState<Flashcard[]>([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [mode, setMode] = useState<'overview' | 'review'>('overview');
  const [reviewedCount, setReviewedCount] = useState(0);

  const refresh = async () => {
    const data = await loadFlashcards();
    setCards(data);
    setDueCards(getDueCards(data));
  };

  // Refresh cards every time the page is focused
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [])
  );

  const handleDelete = async (id: string) => {
    await deleteFlashcard(id);
    setCards(prev => prev.filter(c => c.id !== id));
    setDueCards(prev => prev.filter(c => c.id !== id));
  };

  const startReview = () => {
    if (dueCards.length === 0) return;
    setCurrentReviewIndex(0);
    setReviewedCount(0);
    setMode('review');
  };

  const handleRate = async (rating: Rating) => {
    const card = dueCards[currentReviewIndex];
    await reviewCard(card.id, rating);
    setReviewedCount(prev => prev + 1);

    if (currentReviewIndex + 1 < dueCards.length) {
      setCurrentReviewIndex(prev => prev + 1);
    } else {
      // Session complete — refresh and go back to overview
      await refresh();
      setMode('overview');
    }
  };

  // ─── REVIEW MODE ──────────────────────────────────────────────────
  if (mode === 'review') {
    const card = dueCards[currentReviewIndex];
    const progress = `${currentReviewIndex + 1} / ${dueCards.length}`;

    return (
      <View style={{ flex: 1, backgroundColor: colors.paper }}>
        {/* Review Header */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: 64, paddingHorizontal: 20, paddingBottom: 16,
        }}>
          <TouchableOpacity onPress={() => { setMode('overview'); refresh(); }}>
            {SWIcon.x(20, colors.ink2)}
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <Text style={{
              fontFamily: typography.fontFamilyBold, fontSize: 15, color: colors.ink,
            }}>
              Review Session
            </Text>
            <Text style={{
              fontFamily: typography.fontFamilyMono, fontSize: 11, color: colors.ink3,
              marginTop: 2,
            }}>
              {progress}
            </Text>
          </View>
          <View style={{ width: 20 }} />
        </View>

        {/* Progress Bar */}
        <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
          <View style={{
            height: 4, backgroundColor: colors.raised, borderRadius: 2, overflow: 'hidden',
          }}>
            <View style={{
              height: 4,
              width: `${((currentReviewIndex) / dueCards.length) * 100}%`,
              backgroundColor: colors.brand, borderRadius: 2,
            }} />
          </View>
        </View>

        {/* Review Card */}
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
          <ReviewCard
            key={card.id}
            card={card}
            colors={colors}
            typography={typography}
            onRate={handleRate}
          />
        </View>
      </View>
    );
  }

  // ─── OVERVIEW MODE ────────────────────────────────────────────────
  const newCards = cards.filter(c => c.lastReviewed === null);
  const reviewedCards = cards.filter(c => c.lastReviewed !== null);

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <ScrollView contentContainerStyle={{ paddingTop: 70, paddingBottom: 100, paddingHorizontal: 20 }}>
        <Text style={{
          fontFamily: typography.fontFamilyBold, fontSize: 28, color: colors.ink,
          letterSpacing: -0.5, marginBottom: 6,
        }}>
          Flash Cards
        </Text>
        <Text style={{
          fontFamily: typography.fontFamily, fontSize: 14, color: colors.ink2,
          marginBottom: 24, lineHeight: 20,
        }}>
          Spaced repetition to lock in what you learn
        </Text>

        {/* Stats Row */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Due', value: dueCards.length, bg: colors.peach, fg: colors.peachInk },
            { label: 'New', value: newCards.length, bg: colors.iris, fg: colors.irisInk },
            { label: 'Total', value: cards.length, bg: colors.raised, fg: colors.ink },
          ].map(stat => (
            <View key={stat.label} style={{
              flex: 1, backgroundColor: stat.bg, borderRadius: 16, padding: 14,
              alignItems: 'center',
            }}>
              <Text style={{
                fontFamily: typography.fontFamilyBold, fontSize: 24, color: stat.fg,
                marginBottom: 2,
              }}>
                {stat.value}
              </Text>
              <Text style={{
                fontFamily: typography.fontFamilyMono, fontSize: 10, color: stat.fg,
                textTransform: 'uppercase', letterSpacing: 0.4, opacity: 0.8,
              }}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Study Button */}
        {dueCards.length > 0 ? (
          <TouchableOpacity
            onPress={startReview}
            style={{
              backgroundColor: colors.brand, borderRadius: 16, padding: 18,
              alignItems: 'center', marginBottom: 28,
              shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.12, shadowRadius: 12, elevation: 4,
            }}
          >
            <Text style={{
              fontFamily: typography.fontFamilyBold, fontSize: 16, color: colors.brandInk,
              marginBottom: 4,
            }}>
              Study Now
            </Text>
            <Text style={{
              fontFamily: typography.fontFamilyMono, fontSize: 11, color: colors.brandInk,
              opacity: 0.7,
            }}>
              {dueCards.length} card{dueCards.length !== 1 ? 's' : ''} to review
            </Text>
          </TouchableOpacity>
        ) : cards.length > 0 ? (
          <View style={{
            backgroundColor: colors.sage, borderRadius: 16, padding: 18,
            alignItems: 'center', marginBottom: 28,
          }}>
            <Text style={{
              fontFamily: typography.fontFamilyBold, fontSize: 15, color: colors.sageInk,
              marginBottom: 4,
            }}>
              All caught up!
            </Text>
            <Text style={{
              fontFamily: typography.fontFamily, fontSize: 13, color: colors.sageInk,
              opacity: 0.8,
            }}>
              No cards due right now. Check back later.
            </Text>
          </View>
        ) : null}

        {/* Card List */}
        {cards.length === 0 ? (
          <View style={{
            backgroundColor: colors.raised, borderRadius: 20, padding: 32,
            alignItems: 'center', borderWidth: 1, borderColor: colors.hairline,
          }}>
            {SWIcon.sparkle(32, colors.ink3)}
            <Text style={{
              fontFamily: typography.fontFamilyBold, fontSize: 16, color: colors.ink,
              marginTop: 16, marginBottom: 8,
            }}>
              No flash cards yet
            </Text>
            <Text style={{
              fontFamily: typography.fontFamily, fontSize: 14, color: colors.ink2,
              textAlign: 'center', lineHeight: 20,
            }}>
              Ask the AI Tutor to "make flash cards" while watching a video and they will appear here.
            </Text>
          </View>
        ) : (
          <View>
            <Text style={{
              fontFamily: typography.fontFamilyBold, fontSize: 16, color: colors.ink,
              marginBottom: 12, letterSpacing: -0.2,
            }}>
              All Cards ({cards.length})
            </Text>
            {cards.map(card => (
              <BrowseCard
                key={card.id}
                card={card}
                colors={colors}
                typography={typography}
                onDelete={handleDelete}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <SWTabBar active="cards" onTab={(id) => {
        if (id === 'home') router.dismissTo('/feed');
        else if (id === 'search') router.push('/explore');
        else if (id === 'library') router.push('/library');
        else if (id === 'profile') router.push('/profile');
      }} />
    </View>
  );
}
