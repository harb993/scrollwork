import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { useTheme } from '../constants/theme';
import { SWIcon } from './SWIcon';

export function SWLevelBars({ level = 'Beginner', size = 14, color, dimColor }: { level: string, size?: number, color: string, dimColor: string }) {
  const filled = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 }[level] || 1;
  const w = size * 0.18;
  const gap = w * 0.55;
  const heights = [size * 0.45, size * 0.72, size * 1];

  return (
    <Svg width={size * 1.1} height={size}>
      {heights.map((h, i) => (
        <Rect
          key={i}
          x={i * (w + gap) + 1}
          y={size - h}
          width={w}
          height={h}
          rx={w * 0.4}
          fill={i < filled ? color : dimColor}
        />
      ))}
    </Svg>
  );
}

export function SWChip({ children, tone = 'raised', size = 'sm', style }: { children: React.ReactNode, tone?: 'raised' | 'beginner' | 'intermediate' | 'advanced' | 'peach' | 'ghost' | 'glass', size?: 'sm' | 'md', style?: any }) {
  const { colors } = useTheme();

  const getPalette = () => {
    switch (tone) {
      case 'raised': return { bg: colors.raised, fg: colors.ink2, border: 'transparent' };
      case 'beginner': return { bg: colors.sage, fg: colors.sageInk, border: 'transparent' };
      case 'intermediate': return { bg: colors.blush, fg: colors.blushInk, border: 'transparent' };
      case 'advanced': return { bg: colors.iris, fg: colors.irisInk, border: 'transparent' };
      case 'peach': return { bg: colors.peach, fg: colors.peachInk, border: 'transparent' };
      case 'ghost': return { bg: 'transparent', fg: colors.ink2, border: colors.hairlineStrong };
      case 'glass': return { bg: 'rgba(255,255,255,0.18)', fg: '#fff', border: 'transparent' };
      default: return { bg: colors.raised, fg: colors.ink2, border: 'transparent' };
    }
  };

  const palette = getPalette();
  const py = size === 'sm' ? 4 : 7;
  const px = size === 'sm' ? 10 : 14;
  const fz = size === 'sm' ? 11 : 13;

  return (
    <View style={[{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: py,
      paddingHorizontal: px,
      borderRadius: 999,
      backgroundColor: palette.bg,
      borderWidth: tone === 'ghost' ? 1 : 0,
      borderColor: palette.border,
    }, style]}>
      <Text style={{
        fontFamily: 'JetBrainsMono_400Regular',
        fontSize: fz,
        color: palette.fg,
        letterSpacing: 0.2,
      }}>
        {children}
      </Text>
    </View>
  );
}

export function SWTabBar({ active = 'home', onTab }: { active: string, onTab?: (id: string) => void }) {
  const { colors } = useTheme();
  const tabs = [
    { id: 'home',    label: 'Feed',    icon: SWIcon.home },
    { id: 'search',  label: 'Explore', icon: SWIcon.search },
    { id: 'library', label: 'Library', icon: SWIcon.library },
    { id: 'cards',   label: 'Cards',   icon: SWIcon.cards },
    { id: 'profile', label: 'You',     icon: SWIcon.user },
  ];

  return (
    <View style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      paddingBottom: 28, paddingTop: 10, paddingHorizontal: 12,
      flexDirection: 'row', justifyContent: 'space-around',
      backgroundColor: colors.paper,
      borderTopWidth: 1, borderTopColor: colors.hairline,
      zIndex: 5,
    }}>
      {tabs.map(t => {
        const isOn = t.id === active;
        const color = isOn ? colors.ink : colors.ink3;
        return (
          <TouchableOpacity key={t.id} onPress={() => onTab && onTab(t.id)} style={{ alignItems: 'center', gap: 4, padding: 6 }}>
            {t.icon(22, color, isOn ? color : 'none')}
            <Text style={{
              color: color,
              fontFamily: 'Inter_600SemiBold',
              fontSize: 10,
              letterSpacing: 0.3,
              textTransform: 'uppercase',
            }}>
              {t.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
