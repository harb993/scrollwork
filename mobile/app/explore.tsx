import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '../constants/theme';
import { SWTabBar } from '../components/SWUI';
import { SWIcon } from '../components/SWIcon';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { name: 'Computer Science', emoji: '💻', count: 24 },
  { name: 'Medical', emoji: '🩺', count: 18 },
  { name: 'Aerospace', emoji: '🚀', count: 12 },
  { name: 'Electrical Engineering', emoji: '⚡', count: 15 },
];

const TRENDING = [
  { title: 'Data Structures 101', views: '12.4k', category: 'CS' },
  { title: 'Heart Anatomy Basics', views: '8.2k', category: 'Medical' },
  { title: 'Circuit Analysis', views: '6.1k', category: 'EE' },
  { title: 'Orbital Mechanics', views: '4.8k', category: 'Aerospace' },
];

export default function Explore() {
  const { colors, typography } = useTheme();
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <ScrollView contentContainerStyle={{ paddingTop: 70, paddingBottom: 100, paddingHorizontal: 20 }}>
        <Text style={{
          fontFamily: typography.fontFamilyBold, fontSize: 28, color: colors.ink,
          letterSpacing: -0.5, marginBottom: 6
        }}>
          Explore
        </Text>
        <Text style={{
          fontFamily: typography.fontFamily, fontSize: 14, color: colors.ink2,
          marginBottom: 28, lineHeight: 20
        }}>
          Discover new topics and trending content
        </Text>

        {/* Categories Grid */}
        <Text style={{
          fontFamily: typography.fontFamilyBold, fontSize: 16, color: colors.ink,
          marginBottom: 14, letterSpacing: -0.2
        }}>
          Categories
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 32 }}>
          {CATEGORIES.map((cat) => (
            <View key={cat.name} style={{
              width: (width - 52) / 2, backgroundColor: colors.raised,
              borderRadius: 16, padding: 16,
              borderWidth: 1, borderColor: colors.hairline
            }}>
              <Text style={{ fontSize: 28, marginBottom: 8 }}>{cat.emoji}</Text>
              <Text style={{
                fontFamily: typography.fontFamilyBold, fontSize: 14, color: colors.ink,
                marginBottom: 4
              }}>
                {cat.name}
              </Text>
              <Text style={{
                fontFamily: typography.fontFamilyMono, fontSize: 11, color: colors.ink3
              }}>
                {cat.count} videos
              </Text>
            </View>
          ))}
        </View>

        {/* Trending */}
        <Text style={{
          fontFamily: typography.fontFamilyBold, fontSize: 16, color: colors.ink,
          marginBottom: 14, letterSpacing: -0.2
        }}>
          Trending Now
        </Text>
        {TRENDING.map((item, i) => (
          <View key={i} style={{
            flexDirection: 'row', alignItems: 'center', gap: 14,
            backgroundColor: colors.raised, borderRadius: 14, padding: 14,
            marginBottom: 10, borderWidth: 1, borderColor: colors.hairline
          }}>
            <View style={{
              width: 40, height: 40, borderRadius: 12,
              backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center'
            }}>
              <Text style={{ fontFamily: typography.fontFamilyBold, fontSize: 16, color: colors.brandInk }}>
                {i + 1}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontFamily: typography.fontFamilyBold, fontSize: 14, color: colors.ink,
                marginBottom: 2
              }}>
                {item.title}
              </Text>
              <Text style={{
                fontFamily: typography.fontFamilyMono, fontSize: 11, color: colors.ink3
              }}>
                {item.views} views · {item.category}
              </Text>
            </View>
            {SWIcon.sparkle(16, colors.ink3)}
          </View>
        ))}
      </ScrollView>

      <SWTabBar active="search" onTab={(id) => {
        if (id === 'home') router.back();
        else if (id === 'library') router.push('/library');
        else if (id === 'profile') router.push('/profile');
      }} />
    </View>
  );
}
