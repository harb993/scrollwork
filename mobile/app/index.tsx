import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../constants/theme';
import { SWLevelBars, SWChip } from '../components/SWUI';
import { SWIcon, SWLogoMark } from '../components/SWIcon';

export default function Onboarding() {
  const router = useRouter();
  const { colors, typography, spacing, borderRadius } = useTheme();
  
  const [step, setStep] = useState(1);
  const [field, setField] = useState('CS');
  const [difficulty, setDifficulty] = useState('Beginner');

  const fields = [
    { id: 'CS', name: 'Computer Science', icon: SWIcon.search },
    { id: 'Medical', name: 'Medical', icon: SWIcon.heart },
    { id: 'EE', name: 'Electrical Eng.', icon: SWIcon.sparkle },
    { id: 'Aerospace', name: 'Aerospace', icon: SWIcon.sparkle },
  ];

  const levels = [
    { id: 'Beginner', bars: 1, title: 'Beginner', blurb: 'Brand-new to the topic. Start with the fundamentals.' },
    { id: 'Intermediate', bars: 2, title: 'Intermediate', blurb: 'Comfortable with the basics. Ready to go deeper.' },
    { id: 'Advanced', bars: 3, title: 'Advanced', blurb: 'Experienced. Skip past the introductions.' },
  ];

  const startSession = () => {
    router.push({
      pathname: '/feed',
      params: { field, difficulty }
    });
  };

  if (step === 1) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.paper }}>
        <View style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <View style={{ position: 'absolute', inset: 0, backgroundColor: colors.peach }} />
          <View style={{
            position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <SWLogoMark size={120} />
          </View>
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 24, alignItems: 'center' }}>
            <Text style={{
              fontFamily: typography.fontFamilyMono,
              fontSize: 11,
              letterSpacing: 1.8,
              textTransform: 'uppercase',
              color: colors.peachInk,
              opacity: 0.7,
            }}>ScrollWork</Text>
          </View>
        </View>

        <View style={{ padding: 32, paddingBottom: 48, backgroundColor: colors.paper }}>
          <Text style={{ fontSize: 30, fontFamily: typography.fontFamilyBold, letterSpacing: -0.6, lineHeight: 34, color: colors.ink }}>
            One concept,{'\n'}one minute.
          </Text>
          <Text style={{ marginTop: 12, fontSize: 15, fontFamily: typography.fontFamily, color: colors.ink2, lineHeight: 22 }}>
            Short videos that teach you one thing at a time, paced to where you actually are. Engineering, medicine, and more.
          </Text>

          <View style={{ gap: 10, marginTop: 28 }}>
            <TouchableOpacity onPress={() => setStep(2)} style={{
              height: 54, borderRadius: 27, backgroundColor: colors.ink,
              alignItems: 'center', justifyContent: 'center'
            }}>
              <Text style={{ color: colors.paper, fontFamily: typography.fontFamilyBold, fontSize: 16 }}>Get started</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
              height: 54, borderRadius: 27, backgroundColor: 'transparent',
              alignItems: 'center', justifyContent: 'center'
            }}>
              <Text style={{ color: colors.ink2, fontFamily: typography.fontFamilyMedium, fontSize: 15 }}>I have an account</Text>
            </TouchableOpacity>
          </View>

          <Text style={{ marginTop: 18, fontFamily: typography.fontFamilyMono, fontSize: 10, color: colors.ink3, textAlign: 'center', letterSpacing: 0.5 }}>
            By continuing you agree to our terms.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 88, paddingBottom: 100 }}>
        <Text style={{ fontFamily: typography.fontFamilyMono, fontSize: 11, color: colors.ink3, letterSpacing: 1.5, textTransform: 'uppercase' }}>
          Step 2 of 2
        </Text>
        <Text style={{ marginTop: 12, fontSize: 30, fontFamily: typography.fontFamilyBold, lineHeight: 34, letterSpacing: -0.6, color: colors.ink }}>
          Set your parameters
        </Text>
        <Text style={{ marginTop: 10, fontSize: 15, color: colors.ink2, lineHeight: 22, marginBottom: 32 }}>
          Pick your focus area and current comfort level.
        </Text>

        <Text style={{ fontFamily: typography.fontFamilyMono, fontSize: 12, color: colors.ink3, marginBottom: 12, letterSpacing: 0.5, textTransform: 'uppercase' }}>
          [ Field ]
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
          {fields.map(f => {
            const on = field === f.id;
            return (
              <TouchableOpacity key={f.id} onPress={() => setField(f.id)} style={{
                flexDirection: 'row', alignItems: 'center', gap: 6,
                paddingVertical: 10, paddingHorizontal: 16,
                borderRadius: borderRadius.pill,
                backgroundColor: on ? colors.ink : 'transparent',
                borderWidth: 1.5, borderColor: on ? colors.ink : colors.hairlineStrong,
              }}>
                <Text style={{
                  fontFamily: typography.fontFamilyMedium,
                  fontSize: 14,
                  color: on ? colors.paper : colors.ink
                }}>
                  {f.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={{ fontFamily: typography.fontFamilyMono, fontSize: 12, color: colors.ink3, marginBottom: 12, letterSpacing: 0.5, textTransform: 'uppercase' }}>
          [ Intensity ]
        </Text>
        <View style={{ gap: 12 }}>
          {levels.map(l => {
            const on = difficulty === l.id;
            const levelTone = l.id === 'Beginner' ? colors.sage : l.id === 'Intermediate' ? colors.blush : colors.iris;
            return (
              <TouchableOpacity key={l.id} onPress={() => setDifficulty(l.id)} style={{
                flexDirection: 'row', alignItems: 'center', gap: 16,
                padding: 18, borderRadius: 18,
                backgroundColor: colors.card,
                borderWidth: 1.5, borderColor: on ? colors.ink : colors.hairline,
              }}>
                <View style={{
                  width: 44, height: 44, borderRadius: 12,
                  backgroundColor: levelTone,
                  alignItems: 'center', justifyContent: 'center'
                }}>
                  <SWLevelBars level={l.id} size={22} color={colors.ink} dimColor={colors.hairlineStrong} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 17, fontFamily: typography.fontFamilyBold, letterSpacing: -0.2, color: colors.ink }}>{l.title}</Text>
                  <Text style={{ fontSize: 13, fontFamily: typography.fontFamily, color: colors.ink2, marginTop: 2, lineHeight: 18 }}>{l.blurb}</Text>
                </View>
                <View style={{
                  width: 22, height: 22, borderRadius: 11,
                  borderWidth: 1.5, borderColor: on ? colors.ink : colors.hairlineStrong,
                  backgroundColor: on ? colors.ink : 'transparent',
                  alignItems: 'center', justifyContent: 'center'
                }}>
                  {on && SWIcon.check(14, colors.paper)}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', left: 20, right: 20, bottom: 36 }}>
        <TouchableOpacity onPress={startSession} style={{
          height: 54, borderRadius: 27,
          backgroundColor: colors.ink,
          alignItems: 'center', justifyContent: 'center'
        }}>
          <Text style={{ color: colors.paper, fontFamily: typography.fontFamilyBold, fontSize: 16, letterSpacing: -0.2 }}>Continue to Feed</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
