import { Image } from 'expo-image';
// src/screens/MorningCheckInScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Platform,
} from 'react-native';
import tw from '@/shared/lib/tailwind';
import CloseButton from '@/shared/ui/CloseButton';

// SVG Assets
import DoodySvg from '@/shared/assets/doody/Doody.webp';
import Background from '@/shared/ui/Background';

interface MorningCheckInScreenProps {
  onClose: () => void;
  onComplete: (mood: number) => void;
}

export default function MorningCheckInScreen({ onClose, onComplete }: MorningCheckInScreenProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  const moodLabels = ['아주 별로', '별로', '그럭저럭', '좋음', '아주 좋음'];

  const handleSelectMood = (mood: number) => {
    setSelectedMood(mood);
    // After selecting, auto-complete after a short delay
    setTimeout(() => {
      onComplete(mood);
    }, 400);
  };

  return (
    <Background theme="day">
      <SafeAreaView style={tw`flex-1`}>
        {/* Header Row */}
        <View style={tw`flex-row items-center px-6 pt-4 ${Platform.OS === 'android' ? 'mt-6' : ''}`}>
          <CloseButton onPress={onClose} style={tw`absolute left-6 top-4 z-10`} />
          <View style={tw`flex-1 items-center justify-center`}>
            <View style={tw`bg-white/80 px-4 py-2 rounded-full border border-gray-100/50 shadow-sm flex-row items-center`}>
              <View style={tw`w-2 h-2 rounded-full bg-[#008C75] mr-2`} />
              <Text style={tw`text-gray-900 font-bold text-xs`}>기상 인증 중</Text>
            </View>
          </View>
        </View>

        {/* Speech Bubble */}
        <View style={tw`px-6 mt-10 z-10`}>
          <View style={tw`bg-white rounded-[24px] p-6 shadow-md border border-gray-100 relative`}>
            <View style={tw`absolute -top-3 left-6 bg-[#008C75] px-3 py-1 rounded-full flex-row items-center`}>
              <Text style={tw`text-white text-xs font-bold`}>🌱 두디</Text>
            </View>
            <Text style={tw`text-gray-900 text-lg font-bold mt-2 leading-7`}>
              안녕! 오늘 아침의 기분이 어떠니?
            </Text>
            {/* Bubble Tail */}
            <View style={[
              tw`absolute w-6 h-6 bg-white border-b border-r border-gray-100 rotate-45`,
              { bottom: -10, alignSelf: 'center' },
            ]} />
          </View>
        </View>

        {/* Egg Doody Graphic */}
        <View style={tw`flex-1 justify-center items-center mt-8`}>
          <View style={tw`w-64 h-64 items-center justify-center`}>
            <Image source={DoodySvg} style={{ width: '100%', height: '100%' }} contentFit="contain" />
          </View>

          {/* Selected Mood Text */}
          <View style={tw`items-center mt-4 h-12`}>
            {selectedMood !== null ? (
              <>
                <Text style={tw`text-[#008C75] text-xl font-black mb-1`}>
                  {moodLabels[selectedMood - 1]}
                </Text>
                <Text style={tw`text-gray-600 text-sm font-bold`}>
                  {selectedMood} / 5
                </Text>
              </>
            ) : (
              <Text style={tw`text-[#008C75] text-base font-bold`}>
                숫자를 눌러 알려줘
              </Text>
            )}
          </View>
        </View>

        {/* Bottom Options (1 to 5) */}
        <View style={tw`px-6 pb-12 flex-row justify-between`}>
          {[1, 2, 3, 4, 5].map((num) => {
            const isSelected = selectedMood === num;
            return (
              <TouchableOpacity
                key={num}
                activeOpacity={0.7}
                onPress={() => handleSelectMood(num)}
                style={tw`w-14 h-16 rounded-[20px] items-center justify-center ${isSelected ? 'bg-[#008C75]' : 'bg-white'
                  } shadow-md`}
              >
                <Text style={tw`text-lg font-black ${isSelected ? 'text-white' : 'text-gray-400'
                  }`}>
                  {num}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </Background>
  );
}
