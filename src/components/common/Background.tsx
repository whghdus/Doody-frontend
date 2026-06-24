// src/components/common/Background.tsx
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';
import BackgroundSvg from '../../assets/backgrounds/background.svg';
import DarkBackgroundSvg from '../../assets/backgrounds/darkbackground.svg';

interface BackgroundProps {
  children?: React.ReactNode;
  theme?: 'day' | 'night';
}

// Memoize the background SVG layer to avoid expensive vector redraws on screen changes
const StaticBackground = React.memo(({ theme }: { theme: 'day' | 'night' }) => {
  const ActiveBackground = theme === 'night' ? DarkBackgroundSvg : BackgroundSvg;
  return (
    <View style={StyleSheet.absoluteFillObject}>
      <ActiveBackground
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
      />
    </View>
  );
});

export default function Background({ children, theme = 'day' }: BackgroundProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={tw`flex-1 bg-white`}>
      <StaticBackground theme={theme} />
      <View style={[
        tw`flex-1`,
        Platform.OS === 'android' && {
          paddingTop: insets.top,
        }
      ]}>
        {children}
      </View>
    </View>
  );
}
