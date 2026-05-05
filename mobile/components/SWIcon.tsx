import React from 'react';
import Svg, { Path, Circle, Rect, G, Defs, LinearGradient, Stop } from 'react-native-svg';

// The ScrollWork logo mark — squircle with ascending bars + play triangle
export function SWLogoMark({ size = 40 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 180 180">
      <Defs>
        <LinearGradient id="swMark" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#FEE6D8" />
          <Stop offset="100%" stopColor="#DCAE9A" />
        </LinearGradient>
      </Defs>
      {/* Squircle plate */}
      <Rect x="6" y="6" width="168" height="168" rx="44" fill="url(#swMark)" />
      {/* Three ascending bars — difficulty metaphor */}
      <G>
        <Rect x="46" y="98"  width="18" height="44" rx="6" fill="#FAF7F2" opacity={0.55} />
        <Rect x="78" y="76"  width="18" height="66" rx="6" fill="#FAF7F2" opacity={0.78} />
        <Rect x="110" y="50" width="18" height="92" rx="6" fill="#FAF7F2" />
      </G>
      {/* Play triangle nested in the tallest bar */}
      <Path d="M122 96 L122 128 L146 112 Z" fill="#8C4A2A" opacity={0.85} />
    </Svg>
  );
}

export const SWIcon = {
  heart: (s = 22, color = "currentColor", fill = "none") => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="1.6" strokeLinejoin="round">
      <Path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
    </Svg>
  ),
  bookmark: (s = 22, color = "currentColor", fill = "none") => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="1.6" strokeLinejoin="round">
      <Path d="M6 4h12v17l-6-4-6 4z" />
    </Svg>
  ),
  share: (s = 22, color = "currentColor") => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 3v13M7 8l5-5 5 5M5 14v6h14v-6" />
    </Svg>
  ),
  comment: (s = 22, color = "currentColor") => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round">
      <Path d="M4 5h16v12H8l-4 3z" />
    </Svg>
  ),
  sparkle: (s = 18, color = "currentColor") => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6z"/>
      <Path d="M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9z" opacity=".6"/>
    </Svg>
  ),
  search: (s = 20, color = "currentColor") => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <Circle cx="11" cy="11" r="6.5" />
      <Path d="M16 16l4 4" />
    </Svg>
  ),
  home: (s = 22, color = "currentColor", fill = "none") => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="1.6" strokeLinejoin="round">
      <Path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z" />
    </Svg>
  ),
  library: (s = 22, color = "currentColor") => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round">
      <Rect x="4" y="4" width="5" height="16" rx="1" />
      <Rect x="11" y="6" width="5" height="14" rx="1" />
      <Path d="M18 7l3 .8-3 12-3-.8z" />
    </Svg>
  ),
  user: (s = 22, color = "currentColor") => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
      <Circle cx="12" cy="9" r="3.5" />
      <Path d="M5 20c1-4 4-6 7-6s6 2 7 6" strokeLinecap="round" />
    </Svg>
  ),
  mic: (s = 20, color = "currentColor") => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round">
      <Rect x="9" y="3" width="6" height="11" rx="3" />
      <Path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </Svg>
  ),
  send: (s = 20, color = "currentColor") => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill={color}>
      <Path d="M3 12l18-8-7 18-3-7z" />
    </Svg>
  ),
  x: (s = 20, color = "currentColor") => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <Path d="M6 6l12 12M18 6L6 18" />
    </Svg>
  ),
  check: (s = 20, color = "currentColor") => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M5 12l5 5 9-11" />
    </Svg>
  ),
};
