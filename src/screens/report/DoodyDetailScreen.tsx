import { Image } from 'expo-image';
// src/screens/report/DoodyDetailScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import tw from 'twrnc';
import { COLORS } from '../../constants/theme';

// Doody Images (Dummy)
import HappyDoodySvg from '../../assets/doody/happyDoody.webp';
import SimpleBackButton from '../../components/common/SimpleBackButton';

interface DoodyDetailScreenProps {
  doodyId: string;
  onBack: () => void;
}

export default function DoodyDetailScreen({ doodyId, onBack }: DoodyDetailScreenProps) {
  // Dummy Data
  const doodyInfo = {
    name: '두디 이름',
    description: '따뜻한 햇살이 내리쬐는 공원과 숲 근처에 자주 나타나는 병아리 정령이에요. 사람이 자연에 가까이 올수록 더 활발하게 움직이며, 포획되면 주인의 야외 활동을 응원해준대요.',
    acquisition: {
      title: '방법쏼라쏼라',
      date: '2026.06.21',
      badge: '자립온',
      body: '상세완료 방법 어쩌구저ㄲ쩌구...\n상세완료 방법 어쩌구저ㄲ쩌구...\n상세완료 방법 어쩌구저ㄲ쩌구...\n상세완료 방법 어쩌구저ㄲ쩌구...',
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#F5F5F5]`}>
      {/* Header */}
      <View style={tw`flex-row items-center px-6 pt-4 pb-4 bg-white z-10`}>
        <SimpleBackButton onPress={onBack} style={tw`mr-4`} />
        <Text style={tw`flex-1 text-center text-gray-900 text-xl font-bold pr-12`}>
          {doodyInfo.name}
        </Text>
      </View>

      <ScrollView contentContainerStyle={tw`flex-grow px-6 pb-24`} showsVerticalScrollIndicator={false}>
        {/* Doody Image */}
        <View style={tw`items-center justify-center py-10`}>
          <View style={tw`w-48 h-48`}>
            <Image source={HappyDoodySvg} style={{ width: '100%', height: '100%' }} contentFit="contain" />
          </View>
        </View>

        {/* Info Card 1: 소개 */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-[${COLORS.primary}] text-sm font-bold mb-2`}>소개</Text>
          <View style={tw`bg-white border border-[${COLORS.primary}] rounded-2xl p-5 shadow-sm`}>
            <Text style={tw`text-gray-700 leading-relaxed`}>
              {doodyInfo.description}
            </Text>
          </View>
        </View>

        {/* Info Card 2: 획득 방법 */}
        <View style={tw`mb-8`}>
          <Text style={tw`text-[${COLORS.primary}] text-sm font-bold mb-2`}>획득 방법</Text>
          <View style={tw`bg-white border border-[${COLORS.primary}] rounded-2xl p-5 shadow-sm`}>
            {/* Header row */}
            <View style={tw`flex-row items-center justify-between border-b border-gray-100 pb-3 mb-3`}>
              <View style={tw`flex-row items-center`}>
                <View style={tw`w-2 h-2 rounded-full bg-[${COLORS.primary}] mr-2`} />
                <Text style={tw`text-gray-900 font-bold`}>{doodyInfo.acquisition.title}</Text>
              </View>
              <View style={tw`flex-row items-center`}>
                <Text style={tw`text-[${COLORS.primary}] text-xs font-bold mr-2`}>
                  {doodyInfo.acquisition.date}
                </Text>
                <View style={tw`bg-[#EEF7F5] px-2 py-0.5 rounded-full`}>
                  <Text style={tw`text-[${COLORS.primary}] text-[10px] font-bold`}>
                    {doodyInfo.acquisition.badge}
                  </Text>
                </View>
              </View>
            </View>
            
            {/* Body */}
            <Text style={tw`text-gray-700 leading-relaxed`}>
              {doodyInfo.acquisition.body}
            </Text>
          </View>
        </View>

        {/* Bottom Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          // TODO: 나중에 '두디 잡는 화면'으로 이동하도록 연결 예정 (현재는 임시로 뒤로가기)
          onPress={onBack}
          style={tw`bg-[#1C4E3D] py-4 rounded-xl w-full items-center shadow-md`}
        >
          <Text style={tw`text-white font-bold text-base`}>두디 잡으러 가기</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
