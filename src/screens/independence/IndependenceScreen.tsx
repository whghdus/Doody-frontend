// src/screens/IndependenceScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import tw from 'twrnc';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import IndependenceMissionModal from './IndependenceMissionModal';
import IndependenceSwapModal from './IndependenceSwapModal';
import NextStageScreen from '../mission/NextStageScreen';
import MorningSuccessModal from '../../components/home/MorningSuccessModal';
import CheckSvg from '../../assets/icons/check.svg';
import CurrentLocationSvg from '../../assets/icons/currentLocation.svg';
import LockSvg from '../../assets/icons/lock.svg';
import RoadmapButtonSvg from '../../assets/buttons/roadmapButton.svg';
import CurrentButtonSvg from '../../assets/buttons/currentButton.svg';

const { width, height } = Dimensions.get('window');

interface IndependenceScreenProps {
  onBackToHome?: () => void;
  onToggleNavBar?: (visible: boolean) => void;
}

export default function IndependenceScreen({ onBackToHome, onToggleNavBar }: IndependenceScreenProps) {
  const insets = useSafeAreaInsets();
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showUnlock, setShowUnlock] = useState(false);
  const [showMissionComplete, setShowMissionComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(15); // Start with 15 completed

  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    if (onToggleNavBar) {
      onToggleNavBar(!showUnlock);
    }
  }, [showUnlock, onToggleNavBar]);

  const NODE_SPACING = 130;

  // Show all completed + current + 2 locked
  const totalNodes = currentStep + 3;

  const ROADMAP_NODES = Array.from({ length: totalNodes }).map((_, i) => {
    let leftRatio = 0.5;
    if (i % 4 === 0) leftRatio = 0.35;
    else if (i % 4 === 1) leftRatio = 0.65;
    else if (i % 4 === 2) leftRatio = 0.8;
    else if (i % 4 === 3) leftRatio = 0.5;

    return {
      id: i,
      top: (totalNodes - 1 - i) * NODE_SPACING + 150,
      left: width * leftRatio,
    };
  });

  const contentHeight = (totalNodes - 1) * NODE_SPACING + 300;

  React.useEffect(() => {
    if (scrollViewRef.current) {
      // Scroll so that the current step is roughly in the middle
      const currentTop = (totalNodes - 1 - currentStep) * NODE_SPACING + 150;
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: currentTop - height / 2 + 100, animated: false });
      }, 100);
    }
  }, []);

  const handleOpenMission = () => {
    setShowMissionModal(true);
  };

  const handleRest = () => {
    setShowMissionModal(false);
    // Slight delay to allow first modal to close smoothly before opening second
    setTimeout(() => {
      setShowSwapModal(true);
    }, 150);
  };

  const handleStartMission = () => {
    setShowMissionModal(false);
    // 미션 완료 시 현재 위치(발판)를 다음 단계로 이동시킵니다
    setCurrentStep((prev) => Math.min(prev + 1, ROADMAP_NODES.length - 1));
    // 미션 완료 모달 먼저 표시
    setTimeout(() => setShowMissionComplete(true), 300);
  };

  const handleRestForToday = () => {
    setShowSwapModal(false);
    // Rest logic
  };

  const handleStartSmaller = () => {
    setShowSwapModal(false);
    // Start smaller mission logic
  };

  if (showUnlock) {
    return (
      <NextStageScreen
        stageType="independence"
        onClose={() => setShowUnlock(false)}
        onGoToStage={() => {
          setShowUnlock(false);
        }}
      />
    );
  }

  return (
    <View style={tw`flex-1`}>
      {/* Mission Complete Modal */}
      <MorningSuccessModal
        visible={showMissionComplete}
        onConfirm={() => {
          setShowMissionComplete(false);
          setTimeout(() => setShowUnlock(true), 200);
        }}
        title="오늘의 한 칸 완료!"
        description="또 한 발짝 나아갔어.\n두디가 응원하고 있어!"
        points={30}
      />
      {/* Fog Overlay at Top (Starts exactly at the top of the screen including Dynamic Island) */}
      <View style={tw`absolute top-0 left-0 right-0 h-48 z-10`} pointerEvents="none">
        {Array.from({ length: 24 }).map((_, i) => (
          <View
            key={i}
            style={[
              tw`w-full flex-1`,
              { backgroundColor: `rgba(230, 245, 242, ${1 - (i / 23)})` }
            ]}
          />
        ))}
      </View>

      {/* Removed static Top Bar, moved inside ScrollView */}

      {/* Roadmap Area */}
      <View style={tw`flex-1 relative`}>
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ height: contentHeight }}
        >
          {/* Floating text right above the topmost node (top: 150) */}
          <View style={[tw`absolute w-full items-center z-20`, { top: 100 }]}>
            <Text style={tw`text-[#008C75] font-bold text-sm bg-white/90 px-4 py-1.5 rounded-full shadow-sm`}>
              🗺️ 그 너머는 두디도 아직 안 보여줘
            </Text>
          </View>

          {/* Draw the dashed line connecting the nodes */}
          <View style={[tw`absolute inset-0`, { zIndex: 0 }]}>
            <Svg width={width} height={contentHeight}>
              <Path
                d={`
                  M ${ROADMAP_NODES[ROADMAP_NODES.length - 1].left} ${ROADMAP_NODES[ROADMAP_NODES.length - 1].top + 37}
                  ${[...ROADMAP_NODES].reverse().slice(1).map(n => `L ${n.left} ${n.top + 37}`).join(' ')}
                  L ${ROADMAP_NODES[0].left + 40} ${ROADMAP_NODES[0].top + 120}
                `}
                stroke="#008C75"
                strokeWidth="6"
                strokeDasharray="15, 15"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>

          {/* Nodes */}
          {ROADMAP_NODES.map((node) => {
            let InnerIcon = null;
            let BaseButton = RoadmapButtonSvg;
            let iconWidth = 20;
            let iconHeight = 20;
            let iconMarginBottom = 8;

            if (node.id < currentStep) {
              // Completed
              InnerIcon = <CheckSvg width="100%" height="100%" />;
            } else if (node.id === currentStep) {
              // Current Location
              InnerIcon = <CurrentLocationSvg width="100%" height="100%" />;
              BaseButton = CurrentButtonSvg;
              iconWidth = 50;
              iconHeight = 50;
              iconMarginBottom = 50; // Push current location pin to the top of the platform
            } else {
              // Locked
              InnerIcon = <LockSvg width="100%" height="100%" />;
              iconMarginBottom = 18; // Move lock icon slightly up
            }

            return (
              <View
                key={node.id}
                style={[
                  tw`absolute items-center justify-center`,
                  {
                    top: node.top,
                    left: node.left - (78 / 2), // exact center offset of 78 width
                    zIndex: node.id === currentStep ? 2 : 1,
                    width: 78,
                    height: 74,
                  },
                ]}
              >
                <View style={tw`absolute inset-0`}>
                  <BaseButton width="100%" height="100%" />
                </View>
                {/* Inner Icon sized appropriately within the button */}
                <View style={{ width: iconWidth, height: iconHeight, marginBottom: iconMarginBottom }}>
                  {InnerIcon}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Bottom Panel */}
      <View style={[tw`bg-white px-6 pt-8 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-20`, { paddingBottom: insets.bottom + 90 }]}>
        <Text style={tw`text-xl font-black text-gray-900 mb-6`}>
          오늘의 <Text style={tw`text-[#008C75]`}>한 칸</Text>을 같이 열어볼까?
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleOpenMission}
          style={tw`w-full bg-[#008C75] py-4 rounded-full items-center justify-center shadow-md`}
        >
          <Text style={tw`text-white font-bold text-base`}>오늘의 한 칸 열기</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <IndependenceMissionModal
        visible={showMissionModal}
        onClose={() => setShowMissionModal(false)}
        onRest={handleRest}
        onStart={handleStartMission}
      />

      <IndependenceSwapModal
        visible={showSwapModal}
        onBack={() => setShowSwapModal(false)}
        onRest={handleRestForToday}
        onStartSmaller={handleStartSmaller}
      />
    </View>
  );
}
