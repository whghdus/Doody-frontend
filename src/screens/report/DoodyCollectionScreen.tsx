import { Image } from 'expo-image';
// src/screens/report/DoodyCollectionScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import tw from 'twrnc';

import DoodySvg from '../../assets/doody/Doody.webp';
import BrushDoodySvg from '../../assets/doody/brushDoody.webp';
import HappyDoodySvg from '../../assets/doody/happyDoody.webp';
import SadDoodySvg from '../../assets/doody/sadDoody.webp';
import SmileDoodySvg from '../../assets/doody/smileDoody.webp';
import SimpleBackButton from '../../components/common/SimpleBackButton';
import { useCollectionStore } from '../../store/useCollectionStore';

const DOODY_SVGS = [DoodySvg, BrushDoodySvg, HappyDoodySvg, SadDoodySvg, SmileDoodySvg];

interface DoodyCollectionScreenProps {
  onBack: () => void;
  onDoodyClick: (id: string) => void;
}

export default function DoodyCollectionScreen({ onBack, onDoodyClick }: DoodyCollectionScreenProps) {
  const { unlockedDoodies } = useCollectionStore();
  const insets = useSafeAreaInsets();

  // Create 12 slots
  const gridSlots = Array.from({ length: 12 }).map((_, i) => {
    const isRealDoody = i < DOODY_SVGS.length;
    const isUnlocked = unlockedDoodies.includes(i);
    const SvgComponent = isRealDoody ? DOODY_SVGS[i] : null;

    return {
      id: `doody_${i}`,
      index: i,
      isRealDoody,
      isUnlocked,
      SvgComponent
    };
  });

  return (
    <View style={[tw`flex-1 bg-white`, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={tw`flex-row items-center px-6 pt-4 pb-4 bg-white z-10`}>
        <SimpleBackButton onPress={onBack} style={tw`mr-4`} />
        <Text style={tw`flex-1 text-center text-gray-900 text-xl font-bold pr-12`}>
          도감
        </Text>
      </View>

      {/* Main Content Area */}
      <View style={tw`flex-1 bg-[#F5F5F5]`}>
        <ScrollView contentContainerStyle={tw`flex-grow px-6 pb-24 pt-4`} showsVerticalScrollIndicator={false}>
          <Text style={tw`text-gray-500 text-xs font-bold mb-3`}>두디 도감</Text>
          
          {/* Grid Container */}
          <View style={tw`bg-white rounded-3xl p-4 border border-[rgba(0,140,117,0.15)] flex-row flex-wrap justify-between`}>
            {gridSlots.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.7}
                disabled={!item.isUnlocked}
                onPress={() => onDoodyClick(item.id)}
                style={tw`w-[30%] aspect-square bg-white border border-[rgba(0,140,117,0.15)] rounded-2xl mb-3 items-center justify-center p-2 ${!item.isUnlocked ? 'bg-gray-50' : ''}`}
              >
                {item.SvgComponent ? (
                  <Image source={item.SvgComponent} style={{ width: '100%', height: '100%', opacity: item.isUnlocked ? 1 : 0.3 }} contentFit="contain" />
                ) : (
                  <Text style={tw`text-gray-300 font-bold text-2xl`}>?</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
