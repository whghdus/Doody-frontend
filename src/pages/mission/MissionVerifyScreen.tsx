import { Image } from 'expo-image';
// src/screens/MissionVerifyScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import tw from '@/shared/lib/tailwind';
import * as ImagePicker from 'expo-image-picker';
import Background from '@/shared/ui/Background';
import DoodySvg from '@/shared/assets/doody/Doody.webp';

interface MissionVerifyScreenProps {
  onCancel: () => void;
  onVerifyComplete: (photoUri?: string) => void;
}

export default function MissionVerifyScreen({
  onCancel,
  onVerifyComplete,
}: MissionVerifyScreenProps) {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleCapturePhoto = async () => {
    try {
      // Request permission to access image library
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status === 'granted') {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          setImageUri(result.assets[0].uri);
          return; // Success, exit
        }
      }
    } catch (error) {
      console.log('Gallery picker error, falling back to mock image:', error);
    }
  };

  const handleCloseOrReset = () => {
    if (imageUri) {
      // If photo is uploaded, clicking close/X resets the photo to stand-by screen
      setImageUri(null);
    } else {
      // If no photo is uploaded, close the verification screen
      onCancel();
    }
  };

  return (
    <Background theme="day">
      <SafeAreaView style={tw`flex-1`}>
        {/* Top Header Row (z-30 so it stays above the dimmed modal overlay) */}
        <View style={tw`relative w-full flex-row items-center justify-center px-6 py-4 z-30`}>
          {/* Close / Reset Button on Left */}
          <TouchableOpacity
            onPress={handleCloseOrReset}
            activeOpacity={0.7}
            style={tw`absolute left-6 w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm items-center justify-center`}
          >
            <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
              <Path 
                d="M13 1L1 13M1 1l12 12" 
                stroke="#1F2A26" 
                strokeWidth={2} 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </Svg>
          </TouchableOpacity>

          {/* Verification Badge centered */}
          <View style={tw`bg-[#E6F4F1] border border-[#008C75] px-4 py-1.5 rounded-full flex-row items-center`}>
            <View style={tw`w-2 h-2 rounded-full bg-[#008C75] mr-2`} />
            <Text style={tw`text-[#008C75] text-xs font-bold`}>미션 인증 중</Text>
          </View>
        </View>

        {/* Content Area */}
        <View style={tw`flex-1 justify-between px-6 pt-4 pb-8`}>
          {/* Group: Speech Bubble + Chick Illustration (Stick close together!) */}
          <View style={tw`flex-1 justify-center items-center w-full relative`}>
            {/* Speech Bubble */}
            <View style={tw`bg-white rounded-3xl p-5 border border-gray-100 shadow-md w-full relative mb-1 z-10`}>
              <View style={tw`flex-row items-center mb-2`}>
                <View style={tw`bg-[#008C75] px-2.5 py-0.5 rounded-lg`}>
                  <Text style={tw`text-white text-xs font-bold`}>🌱 두디</Text>
                </View>
              </View>
              <Text style={tw`text-gray-900 text-base font-bold leading-relaxed`}>
                미션을 마친 사진을 올려줘.{"\n"}인증되면 회복 패스포트에 기록돼.
              </Text>
              
              {/* Bubble pointer pointing down */}
              <View 
                style={[
                  tw`absolute bottom-[-9px] w-4 h-4 bg-white rotate-45 border-r border-b border-gray-100/70`,
                  { left: '50%', marginLeft: -8 }
                ]} 
              />
            </View>

            {/* Chick Illustration (Grouped directly below speech bubble with negative margin to touch pointer) */}
            <View style={tw`w-72 h-72 items-center justify-center mt-[-4px]`}>
              <Image source={DoodySvg} style={{ width: '100%', height: '100%' }} contentFit="contain" />
            </View>
          </View>

          {/* Camera Trigger circular button (z-30 so it remains active and clickable above the modal overlay) */}
          <View style={tw`items-center z-30`}>
            <TouchableOpacity
              onPress={handleCapturePhoto}
              activeOpacity={0.85}
              style={tw`w-20 h-20 rounded-full bg-[#008C75] items-center justify-center shadow-lg`}
            >
              <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 18a5 5 0 100-10 5 5 0 000 10z"
                  stroke="#FFFFFF"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M19 22H5a3 3 0 01-3-3V9a3 3 0 013-3h2l2-3h6l2 3h2a3 3 0 013 3v10a3 3 0 01-3 3z"
                  stroke="#FFFFFF"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          </View>
        </View>

        {/* Photo Uploaded Modal Overlay (State B) (z-20 sits below z-30 elements) */}
        {imageUri !== null && (
          <View style={tw`absolute inset-0 bg-black/35 justify-center items-center px-5 z-20`}>
            {/* Modal Card */}
            <View style={tw`bg-white rounded-[32px] p-6 shadow-2xl border border-gray-100 w-full max-h-[72%] justify-between`}>
              <View>
                <Text style={tw`text-gray-800 text-lg font-bold text-center mb-5`}>
                  📸 업로드한 사진
                </Text>
                
                {/* Image container displaying the picked/mock image */}
                <View style={tw`w-full h-80 bg-gray-100 rounded-[24px] mb-6 overflow-hidden shadow-inner justify-center items-center`}>
                  <Image 
                    source={{ uri: imageUri }} 
                    style={tw`w-full h-full`} 
                    resizeMode="cover"
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={() => onVerifyComplete(imageUri || undefined)}
                activeOpacity={0.8}
                style={tw`bg-[#008C75] py-4 rounded-[20px] w-full items-center justify-center shadow-md`}
              >
                <Text style={tw`text-white font-bold text-base`}>
                  확인하고 업로드 완료하기!
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </Background>
  );
}
