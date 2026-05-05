import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../constants/theme';
import { SWTabBar } from '../components/SWUI';
import { SWIcon } from '../components/SWIcon';
import { useRouter } from 'expo-router';
import { loadSession, saveSession, SessionData } from '../services/sessionStore';

export default function Profile() {
  const { colors, typography } = useTheme();
  const router = useRouter();
  const [session, setSession] = useState<SessionData>({ concepts: {}, timeSpentSeconds: 0 });

  useEffect(() => {
    loadSession().then(setSession);
  }, []);

  const totalViews = Object.values(session.concepts).reduce((a, b) => a + b, 0);
  const uniqueTopics = Object.keys(session.concepts).length;
  const minutes = Math.floor(session.timeSpentSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  const handleResetSession = async () => {
    await saveSession({ concepts: {}, timeSpentSeconds: 0 });
    setSession({ concepts: {}, timeSpentSeconds: 0 });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <ScrollView contentContainerStyle={{ paddingTop: 70, paddingBottom: 100, paddingHorizontal: 20 }}>

        {/* Avatar & Name */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <View style={{
            width: 72, height: 72, borderRadius: 36,
            backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center',
            marginBottom: 14
          }}>
            <Text style={{ fontFamily: typography.fontFamilyBold, fontSize: 28, color: colors.brandInk }}>
              A
            </Text>
          </View>
          <Text style={{
            fontFamily: typography.fontFamilyBold, fontSize: 20, color: colors.ink,
            letterSpacing: -0.3, marginBottom: 4
          }}>
            Admin
          </Text>
          <Text style={{
            fontFamily: typography.fontFamilyMono, fontSize: 12, color: colors.ink3,
            letterSpacing: 0.3
          }}>
            ScrollWork Learner
          </Text>
        </View>

        {/* Session Summary */}
        <View style={{
          backgroundColor: colors.raised, borderRadius: 20, padding: 20,
          borderWidth: 1, borderColor: colors.hairline, marginBottom: 20
        }}>
          <Text style={{
            fontFamily: typography.fontFamilyBold, fontSize: 15, color: colors.ink,
            marginBottom: 16, letterSpacing: -0.2
          }}>
            Session Summary
          </Text>
          {[
            { label: 'Unique Topics Explored', value: `${uniqueTopics}`, icon: '🧠' },
            { label: 'Total Video Views', value: `${totalViews}`, icon: '📺' },
            { label: 'Time Spent Learning', value: hours > 0 ? `${hours}h ${remainingMinutes}m` : `${minutes}m`, icon: '⏱' },
            { label: 'Session Limit', value: `${60 - minutes > 0 ? 60 - minutes : 0}m remaining`, icon: '⏳' },
          ].map((item, i) => (
            <View key={i} style={{
              flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
              paddingVertical: 12,
              borderTopWidth: i > 0 ? 1 : 0, borderTopColor: colors.hairline
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                <Text style={{
                  fontFamily: typography.fontFamily, fontSize: 14, color: colors.ink
                }}>
                  {item.label}
                </Text>
              </View>
              <Text style={{
                fontFamily: typography.fontFamilyBold, fontSize: 14, color: colors.ink
              }}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Admin Actions */}
        <View style={{
          backgroundColor: colors.raised, borderRadius: 20, padding: 20,
          borderWidth: 1, borderColor: colors.hairline, marginBottom: 20
        }}>
          <Text style={{
            fontFamily: typography.fontFamilyBold, fontSize: 15, color: colors.ink,
            marginBottom: 16, letterSpacing: -0.2
          }}>
            Admin Controls
          </Text>
          <TouchableOpacity
            onPress={handleResetSession}
            style={{
              backgroundColor: '#FEE2E2', borderRadius: 12, padding: 14,
              flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8
            }}
          >
            <Text style={{
              fontFamily: typography.fontFamilyBold, fontSize: 14, color: '#DC2626'
            }}>
              Reset Session Data
            </Text>
          </TouchableOpacity>
          <Text style={{
            fontFamily: typography.fontFamily, fontSize: 11, color: colors.ink3,
            textAlign: 'center', marginTop: 8
          }}>
            Clears all concept counts and resets the session timer
          </Text>
        </View>

        {/* App Info */}
        <View style={{ alignItems: 'center', marginTop: 12 }}>
          <Text style={{
            fontFamily: typography.fontFamilyMono, fontSize: 11, color: colors.ink3
          }}>
            ScrollWork v1.0 · Powered by Groq
          </Text>
        </View>
      </ScrollView>

      <SWTabBar active="profile" onTab={(id) => {
        if (id === 'home') router.back();
        else if (id === 'search') router.push('/explore');
        else if (id === 'library') router.push('/library');
      }} />
    </View>
  );
}
