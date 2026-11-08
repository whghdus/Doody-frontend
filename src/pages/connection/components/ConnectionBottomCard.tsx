import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from '@/shared/lib/tailwind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ConnectionBottomCardProps {
  onBackToHome?: () => void;
}

export default function ConnectionBottomCard({ onBackToHome }: ConnectionBottomCardProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[tw`bg-white rounded-t-3xl pt-8 px-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-40`, { paddingBottom: insets.bottom + 90 }]}>
      <Text style={tw`text-gray-900 font-black text-lg mb-1`}>
        가까운 청년센터나 하나은행 핀을 누르면 <Text style={tw`text-[#008C75]`}>나가보기</Text>
      </Text>
      <Text style={tw`text-gray-900 font-black text-lg mb-6`}>
        도착하면 카메라로 잡기
      </Text>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onBackToHome}
        style={tw`bg-[#F2F5F3] rounded-2xl py-4 flex-row items-center justify-center`}
      >
        <Text style={tw`text-gray-700 font-bold text-base`}>🏚️ 집에서 구경만 할래</Text>
      </TouchableOpacity>
    </View>
  );
}
