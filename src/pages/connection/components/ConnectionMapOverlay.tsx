import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import tw from '@/shared/lib/tailwind';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ConnectionMapOverlayProps {
  onSearchArea: () => void;
  onGoToMyLocation: () => void;
  onBackToHome?: () => void;
}

export default function ConnectionMapOverlay({
  onSearchArea,
  onGoToMyLocation,
  onBackToHome,
}: ConnectionMapOverlayProps) {
  const insets = useSafeAreaInsets();

  return (
    <>
      {/* Dynamic Island background hiding */}
      <View style={[tw`absolute top-0 left-0 right-0 bg-[#E1EDE4]/90 z-50`, { height: insets.top }]} />

      {/* --- Top Search Button --- */}
      <View style={[tw`absolute w-full items-center z-30`, { top: insets.top + 16 }]}>
        <TouchableOpacity
          onPress={onSearchArea}
          style={tw`bg-white rounded-full px-5 py-2.5 shadow-md border border-gray-100 flex-row items-center`}
        >
          <Feather name="rotate-cw" size={16} color="#008C75" style={tw`mr-2`} />
          <Text style={tw`text-[#008C75] font-bold text-sm`}>이 지역 탐색</Text>
        </TouchableOpacity>
      </View>

      {/* --- Right Floating Controls --- */}
      <View style={[tw`absolute z-20`, { right: 20, top: insets.top + 20 }]}>
        <View style={tw`bg-white/90 rounded-2xl shadow-sm mb-4 overflow-hidden`}>
          <TouchableOpacity style={tw`p-3 border-b border-gray-100 items-center`}>
            <Feather name="plus" size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={tw`p-3 items-center`}>
            <Feather name="minus" size={20} color="#333" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={tw`bg-white/90 rounded-full p-3 shadow-sm items-center mt-2`}
          onPress={onGoToMyLocation}
        >
          <Feather name="crosshair" size={20} color="#333" />
        </TouchableOpacity>
      </View>
    </>
  );
}
