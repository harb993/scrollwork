import { useColorScheme } from 'react-native';

const SW_LIGHT = {
  paper:    '#FAF7F2',
  card:     '#FFFFFF',
  raised:   '#F3EFE7',
  scrim:    'rgba(28,24,20,0.55)',

  ink:      '#1F1B17',
  ink2:     '#5A544C',
  ink3:     '#8C857B',
  hairline: 'rgba(28,24,20,0.08)',
  hairlineStrong: 'rgba(28,24,20,0.14)',

  peach:    '#FEE6D8', // approximated from oklch(0.86 0.07 55)
  peachInk: '#B44E18', // approximated
  sage:     '#DDF2DF', // approximated
  sageInk:  '#2E653A',
  blush:    '#FCE1DB',
  blushInk: '#B43D31',
  iris:     '#EBDDFB',
  irisInk:  '#693DB5',

  brand:    '#DCAE9A',
  brandInk: '#FFFFFF',
};

const SW_DARK = {
  paper:    '#15130F',
  card:     '#1E1B16',
  raised:   '#2A2620',
  scrim:    'rgba(0,0,0,0.6)',

  ink:      '#F2EEE6',
  ink2:     '#B8B0A2',
  ink3:     '#7C7468',
  hairline: 'rgba(255,247,230,0.08)',
  hairlineStrong: 'rgba(255,247,230,0.14)',

  peach:    '#9C5F35',
  peachInk: '#FFEBDC',
  sage:     '#3D7248',
  sageInk:  '#E1F3E3',
  blush:    '#9D483A',
  blushInk: '#FCE3DF',
  iris:     '#6646A1',
  irisInk:  '#ECDEFB',

  brand:    '#EBB9A3',
  brandInk: '#1A1612',
};

// Hook to get the active theme based on device settings
export const useTheme = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? SW_DARK : SW_LIGHT;

  return {
    isDark,
    colors,
    typography: {
      fontFamily: 'Inter_400Regular',
      fontFamilyMedium: 'Inter_500Medium',
      fontFamilyBold: 'Inter_600SemiBold',
      fontFamilyMono: 'JetBrainsMono_400Regular',
    },
    spacing: {
      xs: 4,
      s: 8,
      m: 16,
      l: 24,
      xl: 32,
      xxl: 48,
    },
    borderRadius: {
      s: 8,
      m: 16,
      l: 24,
      pill: 999,
    }
  };
};
