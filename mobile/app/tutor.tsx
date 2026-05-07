import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useTheme } from '../constants/theme';
import { api } from '../services/api';
import { SWIcon } from '../components/SWIcon';
import { addFlashcard } from '../services/flashcardStore';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'system';
  flashcards?: { question: string; answer: string }[];
}

const { height, width } = Dimensions.get('window');

// Keywords that indicate user wants flash cards
const FLASHCARD_KEYWORDS = [
  'flash card', 'flashcard', 'flash cards', 'flashcards',
  'make card', 'make cards', 'create card', 'create cards',
  'study card', 'study cards', 'review card', 'review cards',
  'generate card', 'generate cards',
];

function isFlashcardRequest(text: string): boolean {
  const lower = text.toLowerCase();
  return FLASHCARD_KEYWORDS.some(kw => lower.includes(kw));
}

export default function Tutor() {
  const { videoId, transcriptUrl } = useLocalSearchParams();
  const router = useRouter();
  const { colors, typography } = useTheme();
  
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'How can I help you understand this concept? You can also ask me to make flash cards from this video.', sender: 'system' }
  ]);
  const [input, setInput] = useState('');
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [savingCards, setSavingCards] = useState<Set<string>>(new Set());
  const listRef = useRef<FlatList>(null);

  const suggestions = ['Make flash cards', 'Quiz me', 'Simpler please', 'Real example?'];

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), text, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    
    const typingId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: typingId, text: '...', sender: 'system' }]);

    // Check if user is asking for flash cards
    if (isFlashcardRequest(text)) {
      // Generate flash cards from transcript
      setMessages(prev => prev.map(m => m.id === typingId ? { ...m, text: 'Generating flash cards from the video...' } : m));

      const cards = await api.generateFlashcards(transcriptUrl as string, 5);

      if (cards.length === 0) {
        setMessages(prev => prev.filter(m => m.id !== typingId).concat({
          id: Date.now().toString(),
          text: 'I could not generate flash cards for this video. The transcript might not be available.',
          sender: 'system',
        }));
        return;
      }

      // Save all cards automatically
      for (const card of cards) {
        await addFlashcard(card.question, card.answer);
      }

      setMessages(prev => prev.filter(m => m.id !== typingId).concat({
        id: Date.now().toString(),
        text: `Done! I created ${cards.length} flash cards from this video. You can find them in the Cards tab.`,
        sender: 'system',
        flashcards: cards,
      }));

      if (ttsEnabled) {
        Speech.stop();
        Speech.speak(`Done! I created ${cards.length} flash cards from this video. You can find them in the Cards tab.`, { rate: 1.0, pitch: 1.0 });
      }
      return;
    }

    // Normal chat
    const response = await api.chat(
      userMsg.text,
      transcriptUrl as string,
      messages
        .filter(m => m.text !== '...' && !m.text.startsWith('Generating flash cards'))
        .map(m => ({
          role: m.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: m.text,
        }))
    );
    
    setMessages(prev => prev.filter(m => m.id !== typingId).concat({
      id: Date.now().toString(),
      text: response.answer,
      sender: 'system'
    }));

    if (ttsEnabled) {
      Speech.stop();
      Speech.speak(response.answer, { rate: 1.0, pitch: 1.0 });
    }
  };

  const renderFlashcardPreview = (cards: { question: string; answer: string }[]) => (
    <View style={{ marginTop: 10 }}>
      {cards.map((card, i) => (
        <View key={i} style={{
          backgroundColor: colors.raised, borderRadius: 12, padding: 12, marginTop: 8,
          borderWidth: 1, borderColor: colors.hairline,
        }}>
          <Text style={{
            fontFamily: typography.fontFamilyMono, fontSize: 9.5, color: colors.peachInk,
            letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 4,
          }}>
            Card {i + 1}
          </Text>
          <Text style={{
            fontFamily: typography.fontFamilyMedium, fontSize: 13.5, color: colors.ink,
            lineHeight: 18, marginBottom: 6,
          }}>
            {card.question}
          </Text>
          <View style={{ height: 1, backgroundColor: colors.hairline, marginBottom: 6 }} />
          <Text style={{
            fontFamily: typography.fontFamily, fontSize: 12.5, color: colors.ink2,
            lineHeight: 17,
          }}>
            {card.answer}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    const isTyping = item.text === '...' || item.text.startsWith('Generating flash cards');
    return (
      <View style={{
        flexDirection: 'row',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: 10,
      }}>
        <View style={{
          maxWidth: '82%',
          backgroundColor: isUser ? colors.ink : colors.card,
          paddingVertical: 11,
          paddingHorizontal: 14,
          borderRadius: 18,
          borderBottomRightRadius: isUser ? 6 : 18,
          borderBottomLeftRadius: isUser ? 18 : 6,
          borderWidth: isUser ? 0 : 1,
          borderColor: colors.hairline,
          shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: isUser ? 0 : 0.03, shadowRadius: 2,
        }}>
          <Text style={{
            fontFamily: typography.fontFamily,
            fontSize: 14.5,
            lineHeight: 20,
            color: isUser ? colors.paper : colors.ink
          }}>
            {item.text}
          </Text>
          {/* Show flash card previews inline */}
          {item.flashcards && item.flashcards.length > 0 && renderFlashcardPreview(item.flashcards)}
          {/* Show "View Cards" button on flash card messages */}
          {item.flashcards && item.flashcards.length > 0 && (
            <TouchableOpacity
              onPress={() => router.push('/flashcards')}
              style={{
                flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
                marginTop: 12, paddingVertical: 10, borderRadius: 12,
                backgroundColor: colors.brand,
              }}
            >
              {SWIcon.cards(14, colors.brandInk)}
              <Text style={{
                fontFamily: typography.fontFamilyBold, fontSize: 13,
                color: colors.brandInk,
              }}>
                View All Cards
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.paper }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 10,
        paddingTop: 60, paddingHorizontal: 16, paddingBottom: 12,
        borderBottomWidth: 1, borderBottomColor: colors.hairline
      }}>
        <View style={{
          width: 32, height: 32, borderRadius: 16,
          backgroundColor: colors.brand,
          alignItems: 'center', justifyContent: 'center'
        }}>
          {SWIcon.sparkle(16, colors.brandInk)}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: typography.fontFamilyBold, fontSize: 15, letterSpacing: -0.2, color: colors.ink }}>
            Ask AI
          </Text>
          <Text style={{ fontFamily: typography.fontFamilyMono, fontSize: 11, letterSpacing: 0.2, color: colors.ink2 }}>
            about this concept
          </Text>
        </View>
        <TouchableOpacity 
          onPress={() => { setTtsEnabled(!ttsEnabled); if(ttsEnabled) Speech.stop(); }} 
          style={{
            width: 32, height: 32, borderRadius: 16, backgroundColor: ttsEnabled ? colors.brand : colors.raised,
            alignItems: 'center', justifyContent: 'center'
          }}
        >
          {SWIcon.mic(16, ttsEnabled ? colors.brandInk : colors.ink2)}
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={{
            width: 32, height: 32, borderRadius: 16, backgroundColor: colors.raised,
            alignItems: 'center', justifyContent: 'center'
          }}
        >
          {SWIcon.x(16, colors.ink2)}
        </TouchableOpacity>
      </View>

      {/* Chat Area */}
      <FlatList
        ref={listRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 14, paddingTop: 16 }}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Suggestions */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={suggestions}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSend(item)} style={{
              paddingVertical: 9, paddingHorizontal: 14, borderRadius: 18,
              backgroundColor: colors.raised,
              borderWidth: 1, borderColor: colors.hairline,
              marginRight: 8
            }}>
              <Text style={{ fontFamily: typography.fontFamilyMedium, fontSize: 13, color: colors.ink }}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Input */}
      <View style={{
        paddingHorizontal: 14, paddingVertical: 8, paddingBottom: 28,
        flexDirection: 'row', alignItems: 'center', gap: 10,
        borderTopWidth: 1, borderTopColor: colors.hairline
      }}>
        <View style={{
          flex: 1, height: 44, borderRadius: 22, backgroundColor: colors.raised,
          paddingHorizontal: 16, justifyContent: 'center'
        }}>
          <TextInput
            style={{ fontFamily: typography.fontFamily, fontSize: 14, color: colors.ink, flex: 1 }}
            value={input}
            onChangeText={setInput}
            placeholder="Ask anything about this video..."
            placeholderTextColor={colors.ink3}
            onSubmitEditing={() => handleSend(input)}
          />
        </View>
        <TouchableOpacity onPress={() => handleSend(input)} style={{
          width: 44, height: 44, borderRadius: 22, backgroundColor: colors.raised,
          alignItems: 'center', justifyContent: 'center'
        }}>
          {SWIcon.send(20, colors.ink)}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
