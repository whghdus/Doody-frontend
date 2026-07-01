import { Image } from 'expo-image';
// src/screens/CatchScreen.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
  Text,
  StyleSheet,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import tw from 'twrnc';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const [permission, requestPermission] = useCameraPermissions();
  
  // State for catch tapping
  const [tapCount, setTapCount] = React.useState(0);
  const TARGET_TAPS = 5;
  
  // Simple floating animation for the Doody
  const floatAnim = useRef(new Animated.Value(0)).current;

  // Catch animations
  const hitScale = useRef(new Animated.Value(1)).current;
  const hitRotate = useRef(new Animated.Value(0)).current;
  const ballScale = useRef(new Animated.Value(1)).current;

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

  const handleTap = () => {
    const nextCount = tapCount + 1;
    if (nextCount > TARGET_TAPS) return;

    setTapCount(nextCount);

    // Ball button bounce animation
    ballScale.setValue(0.85);
    Animated.spring(ballScale, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // Doody wiggling & scale-up animation
    hitScale.setValue(1);
    hitRotate.setValue(0);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(hitScale, {
          toValue: 1.25,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.spring(hitScale, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(hitRotate, {
          toValue: 1, // tilt right
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(hitRotate, {
          toValue: -1, // tilt left
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.spring(hitRotate, {
          toValue: 0,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Final tap trigger transition to success
    if (nextCount === TARGET_TAPS) {
      setTimeout(() => {
        // Doody gets caught: shrink and fade out animation
        Animated.parallel([
          Animated.timing(hitScale, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 80,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onSuccess();
        });
      }, 250);
    }
  };

  const SvgComponent = DOODY_SVGS[doodyIndex];

  if (!permission) {
    // Camera permissions are still loading.
    return <View style={tw`flex-1 bg-black`} />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={tw`flex-1 justify-center items-center bg-gray-100`}>
        <Text style={tw`text-lg font-bold mb-4 text-center px-4`}>두디를 잡기 위해 카메라 권한이 필요합니다.</Text>
        <TouchableOpacity onPress={requestPermission} style={tw`bg-teal-500 px-6 py-3 rounded-full`}>
          <Text style={tw`text-white font-bold`}>권한 허용하기</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onGoHome} style={tw`mt-4`}>
          <Text style={tw`text-gray-500`}>홈으로 돌아가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const interpolatedRotate = hitRotate.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-18deg', '18deg'],
  });

  return (
    <View style={tw`flex-1 bg-black`}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      {/* Live Camera Background taking full screen including safe areas */}
      <CameraView style={StyleSheet.absoluteFillObject} facing="back" />

      {/* UI Elements constrained by Safe Area */}
      <View style={[tw`flex-1`, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        
        {/* Center Target & Doody */}
        <View style={tw`flex-1 justify-center items-center relative`}>
          {/* HP / Tap Progress Bar */}
          <View style={tw`bg-black/50 px-4 py-2 rounded-full mb-6 flex-row items-center border border-white/20 z-20`}>
            <Text style={tw`text-white text-xs font-bold mr-3`}>두디 잡는 중</Text>
            <View style={tw`w-28 h-2.5 bg-white/20 rounded-full overflow-hidden`}>
              <View 
                style={[
                  tw`h-full bg-teal-400`, 
                  { width: `${(tapCount / TARGET_TAPS) * 100}%` }
                ]} 
              />
            </View>
            <Text style={tw`text-white text-xs font-black ml-3`}>{tapCount}/{TARGET_TAPS}</Text>
          </View>

          {/* Dashed Target Circle */}
          <View style={[
            tw`absolute border-4 border-dashed border-white rounded-full`, 
            { width: width * 0.8, height: width * 0.8, opacity: 0.8 }
          ]} />
          
          {/* Animated Doody inside */}
          <Animated.View 
            style={[
              tw`w-64 h-64`, 
              { 
                transform: [
                  { translateY: floatAnim },
                  { scale: hitScale },
                  { rotate: interpolatedRotate }
                ] 
              }
            ]}
          >
            <Image source={SvgComponent} style={{ width: '100%', height: '100%' }} contentFit="contain" />
          </Animated.View>
        </View>

        {/* Bottom Catch Controls */}
        <View style={[tw`flex-row justify-between items-center px-10 w-full pb-10 z-20`]}>
          
          <TouchableOpacity onPress={onGoHome} style={tw`w-14 h-14 bg-white/80 rounded-2xl items-center justify-center shadow-sm`}>
            <HomeSvg width={24} height={24} color="#008C75" />
          </TouchableOpacity>

          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={handleTap}
            style={tw`mx-4`}
          >
            <Animated.View style={[tw`w-28 h-28 items-center justify-center shadow-lg rounded-full`, { transform: [{ scale: ballScale }] }]}>
              <BallSvg width="100%" height="100%" />
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity onPress={onGoToMap} style={tw`w-14 h-14 bg-white/80 rounded-2xl items-center justify-center shadow-sm`}>
            <Feather name="map-pin" size={24} color="#008C75" />
          </TouchableOpacity>

        </View>

      </View>
    </View>
  );
}
