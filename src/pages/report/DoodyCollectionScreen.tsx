import { Image } from 'expo-image';
// src/screens/report/DoodyCollectionScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from '@/shared/lib/tailwind';

import DoodySvg from '@/shared/assets/doody/Doody.webp';
import BrushDoodySvg from '@/shared/assets/doody/brushDoody.webp';
import HappyDoodySvg from '@/shared/assets/doody/happyDoody.webp';
import SadDoodySvg from '@/shared/assets/doody/sadDoody.webp';
import SmileDoodySvg from '@/shared/assets/doody/smileDoody.webp';
import ExplorationDoodySvg from '@/shared/assets/doody/explorationDoody.webp';
import EggDoodySvg from '@/shared/assets/doody/eggDoody.webp';
import SalaryDoodySvg from '@/shared/assets/doody/salaryDoodt.webp';
import GreenDoodySvg from '@/shared/assets/doody/greenDoody.webp';
import SimpleBackButton from '@/shared/ui/SimpleBackButton';
import { useCollectionStore } from '@/entities/useCollectionStore';
import Background from '@/shared/ui/Background';

const DOODY_SVGS = [
  DoodySvg, 
  BrushDoodySvg, 
  HappyDoodySvg, 
  SadDoodySvg, 
  SmileDoodySvg,
  ExplorationDoodySvg, // index 5
  SalaryDoodySvg, // index 6
  GreenDoodySvg   // index 7
];

interface DoodyCollectionScreenProps {
  onBack: () => void;
  onDoodyClick: (id: string) => void;
}

export default function DoodyCollectionScreen({ onBack, onDoodyClick }: DoodyCollectionScreenProps) {
  const { unlockedDoodies, fetchUnlockedDoodies } = useCollectionStore();
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    fetchUnlockedDoodies();
  }, [fetchUnlockedDoodies]);

  // Create 15 slots
  const gridSlots = Array.from({ length: 15 }).map((_, i) => {
    const isRealDoody = i < DOODY_SVGS.length;
    const isUnlocked = unlockedDoodies.includes(i);
    const SvgComponent = isRealDoody ? DOODY_SVGS[i] : DoodySvg;

    return {
      id: `doody_${i}`,
      index: i,
      isRealDoody,
      isUnlocked,
      SvgComponent
    };
  });

  return (
    <Background theme="day">
      <View style={[tw`flex-1`, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={tw`flex-row items-center px-6 pt-4 pb-4 bg-transparent z-10`}>
          <SimpleBackButton onPress={onBack} style={tw`mr-4`} />
          <Text style={tw`flex-1 text-center text-gray-900 text-xl font-bold pr-12`}>
            도감
          </Text>
        </View>

        {/* Main Content Area */}
        <View style={tw`flex-1 bg-transparent`}>
          <ScrollView contentContainerStyle={tw`flex-grow px-6 pb-24 pt-4`} showsVerticalScrollIndicator={false}>
            {/* Grid Container */}
            <View style={tw`bg-white/50 rounded-[32px] p-5 border border-white/40 shadow-sm flex-row flex-wrap justify-between`}>
              {gridSlots.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.7}
                  disabled={!item.isUnlocked}
                  onPress={() => onDoodyClick(item.id)}
                  style={tw`w-[30%] aspect-square bg-white border border-gray-100 rounded-[24px] mb-3 items-center justify-center p-2`}
                >
                  {item.isUnlocked ? (
                    <Image source={item.SvgComponent} style={tw`w-full h-full`} contentFit="contain" />
                  ) : (
                    <View style={tw`w-full h-full items-center justify-center relative`}>
                      <Image
                        source={item.SvgComponent}
                        style={[tw`opacity-20`, { width: '100%', height: '100%', tintColor: '#9CA3AF' }]}
                        contentFit="contain"
                      />
                      <Text style={tw`absolute text-gray-500 font-black text-2xl`}>?</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Background>
  );
}
