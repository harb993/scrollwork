import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useTheme } from '../constants/theme';
import { api } from '../services/api';
import { SWIcon } from '../components/SWIcon';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'system';
}

const { height, width } = Dimensions.get('window');

export default function Tutor() {
  const { videoId, transcriptUrl } = useLocalSearchParams();
  const router = useRouter();
  const { colors, typography } = useTheme();
  
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'How can I help you understand this concept?', sender: 'system' }
  ]);
  const [input, setInput] = useState('');
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const listRef = useRef<FlatList>(null);

  const suggestions = ['Real example?', 'Quiz me', 'Simpler please', 'Next concept'];

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
    
    // Simulate typing
    const typingId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: typingId, text: '...', sender: 'system' }]);

    const response = await api.chat(userMsg.text, videoId as string, transcriptUrl as string);
    
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

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
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
