import { Stack } from 'expo-router';
import { 
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold
} from '@expo-google-fonts/inter';
import { 
  useFonts as useJBFonts,
  JetBrainsMono_400Regular 
} from '@expo-google-fonts/jetbrains-mono';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../constants/theme';
import { View } from 'react-native';

export default function Layout() {
  const [interLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });
  
  const [jbLoaded] = useJBFonts({
    JetBrainsMono_400Regular,
  });

  const { colors, isDark } = useTheme();

  if (!interLoaded || !jbLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.paper },
          animation: 'fade',
        }}
      />
    </View>
  );
}
