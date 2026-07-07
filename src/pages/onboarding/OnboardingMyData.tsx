// src/screens/OnboardingMyData.tsx — Screen 5: 마이데이터 연동
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';
import tw from '@/shared/lib/tailwind';
import { COLORS } from '@/shared/config/theme';

interface OnboardingMyDataProps {
  onConsent: (consent: boolean) => void;
}

// Lock icon component
function LockIcon() {
  return (
    <View
      style={tw`w-12 h-12 rounded-2xl bg-[${COLORS.primaryLight}] items-center justify-center mb-4`}
    >
      <Svg width={20} height={22} viewBox="0 0 20 22" fill="none">
        <Rect x="1" y="10" width="18" height="11" rx="3" stroke={COLORS.primary} strokeWidth={2} />
        <Path
          d="M5 10V6C5 3.23858 7.23858 1 10 1C12.7614 1 15 3.23858 15 6V10"
          stroke={COLORS.primary}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <View />
      </Svg>
    </View>
  );
}

export default function OnboardingMyData({ onConsent }: OnboardingMyDataProps) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={tw`flex-1 bg-[rgba(0,0,0,0.4)]`}>
      <View style={tw`flex-1 justify-center px-6`}>
        {/* Center Modal Card */}
        <View
          style={[
            tw`bg-white rounded-3xl px-6 pt-8 pb-6 shadow-lg`,
          ]}
        >
          {/* Lock Icon */}
          <View style={tw`items-center`}>
            <LockIcon />
          </View>

          {/* Title */}
          <Text style={tw`text-gray-900 text-xl font-bold text-center mb-3`}>
            맞는 길 찾는 데만 쓸게.
          </Text>

          {/* Subtitle */}
          <Text style={tw`text-gray-500 text-sm text-center leading-relaxed mb-8`}>
            마이데이터 연동하면{'\n'}너한테 맞는 지원·일거리를 더 잘 골라줄 수 있어.
          </Text>

          {/* Buttons Row */}
          <View style={tw`flex-row gap-x-3`}>
            {/* Skip Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onConsent(false)}
              style={tw`flex-1 py-4 rounded-3xl bg-gray-100 items-center`}
            >
              <Text style={tw`text-gray-700 font-bold text-base`}>
                다음에 할게
              </Text>
            </TouchableOpacity>

            {/* Consent Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onConsent(true)}
              style={tw`flex-1 py-4 rounded-3xl bg-[${COLORS.primary}] items-center shadow-md`}
            >
              <Text style={tw`text-white font-bold text-base`}>
                연동할게
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
