import { Image } from 'expo-image';
// src/screens/CatchScreen.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import tw from 'twrnc';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Background from '../../components/common/Background';
import DoodySvg from '../../assets/doody/Doody.webp';
import BrushDoodySvg from '../../assets/doody/brushDoody.webp';
import HappyDoodySvg from '../../assets/doody/happyDoody.webp';
import SadDoodySvg from '../../assets/doody/sadDoody.webp';
import SmileDoodySvg from '../../assets/doody/smileDoody.webp';
import BallSvg from '../../assets/icons/ball.svg';
import HomeSvg from '../../assets/navbar/home.svg';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const DOODY_SVGS = [DoodySvg, BrushDoodySvg, HappyDoodySvg, SadDoodySvg, SmileDoodySvg];

interface CatchScreenProps {
  onSuccess: () => void;
  onGoHome: () => void;
  onGoToMap: () => void;
  doodyIndex?: number;
}

export default function CatchScreen({ onSuccess, onGoHome, onGoToMap, doodyIndex = 0 }: CatchScreenProps) {
  const insets = useSafeAreaInsets();
  
  // Simple floating animation for the Doody
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim]);

  const SvgComponent = DOODY_SVGS[doodyIndex];

  return (
    <View style={tw`flex-1`}>
      {/* Fake Camera Background using standard day background */}
      <Background theme="day">

        {/* Center Target & Doody */}
        <View style={tw`flex-1 justify-center items-center relative`}>
          {/* Dashed Target Circle */}
          <View style={[
            tw`absolute border-4 border-dashed border-gray-900 rounded-full`, 
            { width: width * 0.8, height: width * 0.8, opacity: 0.8 }
          ]} />
          
          {/* Animated Doody inside */}
          <Animated.View style={[tw`w-64 h-64`, { transform: [{ translateY: floatAnim }] }]}>
            <Image source={SvgComponent} style={{ width: '100%', height: '100%' }} contentFit="contain" />
          </Animated.View>
        </View>

        {/* Bottom Catch Controls */}
        <View style={[tw`flex-row justify-between items-center px-10 w-full pb-10 z-20`, { paddingBottom: Math.max(insets.bottom + 40, 40) }]}>
          
          <TouchableOpacity onPress={onGoHome} style={tw`w-14 h-14 bg-white rounded-2xl items-center justify-center shadow-sm`}>
            <HomeSvg width={24} height={24} color="#008C75" />
          </TouchableOpacity>

          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={onSuccess}
            style={tw`w-28 h-28 items-center justify-center shadow-lg rounded-full mx-4`}
          >
            <BallSvg width="100%" height="100%" />
          </TouchableOpacity>

          <TouchableOpacity onPress={onGoToMap} style={tw`w-14 h-14 bg-white rounded-2xl items-center justify-center shadow-sm`}>
            <Feather name="map-pin" size={24} color="#008C75" />
          </TouchableOpacity>

        </View>

      </Background>
    </View>
  );
}
