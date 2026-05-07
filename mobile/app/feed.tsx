import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import { useTheme } from '../constants/theme';
import { api, VideoData } from '../services/api';
import { SWChip, SWTabBar, SWLevelBars } from '../components/SWUI';
import { SWIcon } from '../components/SWIcon';
import { LinearGradient } from 'expo-linear-gradient';
import { recordConcept, updateTimeSpent, loadSession } from '../services/sessionStore';

const { height, width } = Dimensions.get('window');

export default function Feed() {
  const router = useRouter();
  const { field, difficulty } = useLocalSearchParams();
  const [isFocused, setIsFocused] = useState(true);
  const { colors, typography } = useTheme();

  // Properly track screen focus — pauses all videos when leaving, resumes when coming back
  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => {
        setIsFocused(false);
      };
    }, [])
  );

  const [videos, setVideos] = useState<VideoData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLimitReached, setTimeLimitReached] = useState(false);
  const [isPausedByUser, setIsPausedByUser] = useState(false);
  const [conceptCount, setConceptCount] = useState(0);
  const [sessionMinutes, setSessionMinutes] = useState(0);

  useEffect(() => {
    loadFeed();
    // Load initial session data
    loadSession().then((session) => {
      setConceptCount(Object.keys(session.concepts).length);
      setSessionMinutes(Math.floor(session.timeSpentSeconds / 60));
    });

    const interval = setInterval(async () => {
      const totalSeconds = await updateTimeSpent(10);
      setSessionMinutes(Math.floor(totalSeconds / 60));
      if (totalSeconds >= 3600) {
        setTimeLimitReached(true);
      }
      // Refresh concept count
      const session = await loadSession();
      setConceptCount(Object.keys(session.concepts).length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const loadFeed = async () => {
    const data = await api.getFeed(field as string, difficulty as string);
    setVideos(data);
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setCurrentIndex(index);

      const visibleItem = viewableItems[0].item;
      if (visibleItem) {
        const concept = visibleItem.category || `${field} Concept`;
        recordConcept(concept).then(() => {
          loadSession().then((session) => {
            setConceptCount(Object.keys(session.concepts).length);
          });
        });
      }
    }
  }).current;

  const renderItem = ({ item, index }: { item: VideoData, index: number }) => {
    const isActive = index === currentIndex;
    return (
      <Pressable onPress={() => setIsPausedByUser(!isPausedByUser)} style={{ height, width, backgroundColor: '#000' }}>
        <Video
          source={{ uri: item.video_url }}
          style={StyleSheet.absoluteFill}
          resizeMode={ResizeMode.COVER}
          shouldPlay={isActive && !timeLimitReached && isFocused && !isPausedByUser}
          isLooping
        />

        {isPausedByUser && (
          <View style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)', pointerEvents: 'none'
          }}>
            {SWIcon.play(72, 'rgba(255,255,255,0.8)')}
          </View>
        )}

        {/* Scrim for legibility */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.65)']}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 350 }}
        />

        {/* Top Meta */}
        <View style={{ position: 'absolute', top: 60, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <SWChip tone="glass" size="sm">
              <SWLevelBars level={difficulty as string} size={10} color="#fff" dimColor="rgba(255,255,255,0.4)" />
              <Text style={{ fontFamily: typography.fontFamilyMono, fontSize: 11, color: '#fff', marginLeft: 4 }}>
                {difficulty}
              </Text>
            </SWChip>
            <SWChip tone="glass" size="sm">
              {field}
            </SWChip>
          </View>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <View style={{
              backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 5,
              flexDirection: 'row', alignItems: 'center', gap: 4,
              borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)'
            }}>
              <Text style={{ fontSize: 12 }}>🧠</Text>
              <Text style={{ fontFamily: typography.fontFamilyMono, fontSize: 11, color: '#fff' }}>
                {conceptCount}
              </Text>
            </View>
            <View style={{
              backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 5,
              flexDirection: 'row', alignItems: 'center', gap: 4,
              borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)'
            }}>
              <Text style={{ fontSize: 12 }}>⏱</Text>
              <Text style={{ fontFamily: typography.fontFamilyMono, fontSize: 11, color: '#fff' }}>
                {sessionMinutes}m
              </Text>
            </View>
          </View>
        </View>

        {/* Right Rail */}
        <View style={{ position: 'absolute', right: 12, bottom: 180, gap: 22, alignItems: 'center' }}>
          {[
            { icon: SWIcon.heart(28, '#fff', 'none'), label: '12.4k' },
            { icon: SWIcon.bookmark(26, '#fff', 'none'), label: 'Save' },
            { icon: SWIcon.comment(26, '#fff', 'none'), label: '142' },
            { icon: SWIcon.share(26, '#fff', 'none'), label: 'Share' }
          ].map((action, i) => (
            <TouchableOpacity key={i} style={{ alignItems: 'center', gap: 4 }}>
              <View style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 8 }}>
                {action.icon}
              </View>
              <Text style={{
                fontFamily: typography.fontFamilyMono, fontSize: 10, color: '#fff',
                textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4
              }}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom Info Block */}
        <View style={{ position: 'absolute', left: 16, right: 88, bottom: 116 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <View style={{
              width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center', justifyContent: 'center'
            }}>
              <Text style={{ fontFamily: typography.fontFamilyBold, fontSize: 12, color: '#fff' }}>S</Text>
            </View>
            <Text style={{ fontFamily: typography.fontFamilyBold, fontSize: 13, color: '#fff' }}>ScrollWork Creator</Text>
            <Text style={{ fontFamily: typography.fontFamilyMono, fontSize: 11, color: '#fff', opacity: 0.7 }}>· follow</Text>
          </View>
          <Text style={{
            fontFamily: typography.fontFamilyBold, fontSize: 19, color: '#fff',
            lineHeight: 24, textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 6
          }}>
            {item.category || `${field} Concept`}
          </Text>
          <Text style={{
            fontFamily: typography.fontFamily, fontSize: 13, color: '#fff', opacity: 0.85,
            marginTop: 6, lineHeight: 18, textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 6
          }}>
            A highly technical breakdown of the concepts within {item.category}.
          </Text>
        </View>

        {/* Ask AI Floating Button */}
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/tutor', params: { videoId: item.id, transcriptUrl: item.transcript_url } })}
          style={{
            position: 'absolute', right: 14, bottom: 116,
            height: 44, paddingLeft: 12, paddingRight: 16, borderRadius: 22,
            backgroundColor: colors.brand,
            flexDirection: 'row', alignItems: 'center', gap: 6,
            shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 24
          }}
        >
          {SWIcon.sparkle(16, colors.brandInk)}
          <Text style={{ fontFamily: typography.fontFamilyBold, fontSize: 14, color: colors.brandInk, letterSpacing: -0.1 }}>
            Ask AI
          </Text>
        </TouchableOpacity>
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <FlatList
        data={videos}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      />
      <SWTabBar active="home" onTab={(id) => {
        if (id === 'search') router.push('/explore');
        else if (id === 'library') router.push('/library');
        else if (id === 'cards') router.push('/flashcards');
        else if (id === 'profile') router.push('/profile');
      }} />

      {timeLimitReached && (
        <View style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.95)',
          alignItems: 'center', justifyContent: 'center', padding: 32, zIndex: 100
        }}>
          {SWIcon.lock(48, colors.peach)}
          <Text style={{
            fontFamily: typography.fontFamilyBold, fontSize: 24, color: '#fff',
            marginTop: 24, textAlign: 'center'
          }}>Time's Up!</Text>
          <Text style={{
            fontFamily: typography.fontFamily, fontSize: 16, color: 'rgba(255,255,255,0.7)',
            marginTop: 12, textAlign: 'center', lineHeight: 22
          }}>
            You have reached your 1-hour session limit. Take a break, review your notes, and come back later to learn more concepts!
          </Text>
        </View>
      )}
    </View>
  );
}
