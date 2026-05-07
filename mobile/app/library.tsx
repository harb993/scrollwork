import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '../constants/theme';
import { SWTabBar } from '../components/SWUI';
import { SWIcon } from '../components/SWIcon';
import { useRouter } from 'expo-router';
import { loadSession, SessionData } from '../services/sessionStore';

export default function Library() {
  const { colors, typography } = useTheme();
  const router = useRouter();
  const [session, setSession] = useState<SessionData>({ concepts: {}, timeSpentSeconds: 0 });

  useEffect(() => {
    loadSession().then(setSession);
  }, []);

  const concepts = Object.entries(session.concepts).sort((a, b) => b[1] - a[1]);
  const totalViews = Object.values(session.concepts).reduce((a, b) => a + b, 0);
  const uniqueTopics = concepts.length;
  const minutes = Math.floor(session.timeSpentSeconds / 60);

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <ScrollView contentContainerStyle={{ paddingTop: 70, paddingBottom: 100, paddingHorizontal: 20 }}>
        <Text style={{
          fontFamily: typography.fontFamilyBold, fontSize: 28, color: colors.ink,
          letterSpacing: -0.5, marginBottom: 6
        }}>
          Library
        </Text>
        <Text style={{
          fontFamily: typography.fontFamily, fontSize: 14, color: colors.ink2,
          marginBottom: 28, lineHeight: 20
        }}>
          Your learning progress & session history
        </Text>

        {/* Stats Row */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 28 }}>
          {[
            { label: 'Topics', value: uniqueTopics, emoji: '🧠' },
            { label: 'Views', value: totalViews, emoji: '👁' },
            { label: 'Minutes', value: minutes, emoji: '⏱' },
          ].map((stat) => (
            <View key={stat.label} style={{
              flex: 1, backgroundColor: colors.raised, borderRadius: 16, padding: 16,
              alignItems: 'center', borderWidth: 1, borderColor: colors.hairline
            }}>
              <Text style={{ fontSize: 22, marginBottom: 6 }}>{stat.emoji}</Text>
              <Text style={{
                fontFamily: typography.fontFamilyBold, fontSize: 22, color: colors.ink,
                marginBottom: 2
              }}>
                {stat.value}
              </Text>
              <Text style={{
                fontFamily: typography.fontFamilyMono, fontSize: 10, color: colors.ink3,
                textTransform: 'uppercase', letterSpacing: 0.5
              }}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Concept Breakdown */}
        <Text style={{
          fontFamily: typography.fontFamilyBold, fontSize: 16, color: colors.ink,
          marginBottom: 14, letterSpacing: -0.2
        }}>
          Concepts Explored
        </Text>
        {concepts.length === 0 ? (
          <View style={{
            backgroundColor: colors.raised, borderRadius: 16, padding: 24,
            alignItems: 'center', borderWidth: 1, borderColor: colors.hairline
          }}>
            <Text style={{ fontSize: 32, marginBottom: 10 }}>📚</Text>
            <Text style={{
              fontFamily: typography.fontFamily, fontSize: 14, color: colors.ink2, textAlign: 'center'
            }}>
              Start watching videos to build your concept library!
            </Text>
          </View>
        ) : (
          concepts.map(([name, count]) => {
            const maxCount = concepts[0][1];
            const barWidth = Math.max((count / maxCount) * 100, 15);
            return (
              <View key={name} style={{
                flexDirection: 'row', alignItems: 'center', gap: 12,
                marginBottom: 10
              }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Text style={{
                      fontFamily: typography.fontFamilyBold, fontSize: 13, color: colors.ink
                    }}>
                      {name}
                    </Text>
                    <Text style={{
                      fontFamily: typography.fontFamilyMono, fontSize: 11, color: colors.ink3
                    }}>
                      {count}x
                    </Text>
                  </View>
                  <View style={{
                    height: 6, backgroundColor: colors.raised, borderRadius: 3,
                    overflow: 'hidden'
                  }}>
                    <View style={{
                      height: 6, width: `${barWidth}%`, backgroundColor: colors.brand,
                      borderRadius: 3
                    }} />
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <SWTabBar active="library" onTab={(id) => {
        if (id === 'home') router.dismissTo('/feed');
        else if (id === 'search') router.push('/explore');
        else if (id === 'cards') router.push('/flashcards');
        else if (id === 'profile') router.push('/profile');
      }} />
    </View>
  );
}
