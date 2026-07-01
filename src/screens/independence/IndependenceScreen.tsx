// src/screens/IndependenceScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import tw from 'twrnc';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { Image } from 'expo-image';
import IndependenceMissionModal from './IndependenceMissionModal';
import IndependenceSwapModal from './IndependenceSwapModal';
import NextStageScreen from '../mission/NextStageScreen';
import MorningSuccessModal from '../../components/home/MorningSuccessModal';
import IndependenceRoadmapModal from './IndependenceRoadmapModal';
import MissionVerifyScreen from '../mission/MissionVerifyScreen';
import CheckSvg from '../../assets/icons/check.svg';
import CurrentLocationSvg from '../../assets/icons/currentLocation.svg';
import LockSvg from '../../assets/icons/lock.svg';
import RoadmapButtonSvg from '../../assets/buttons/roadmapButton.svg';
import CurrentButtonSvg from '../../assets/buttons/currentButton.svg';
import DoodyLogo from '../../assets/logos/doodyLogo.png';
import GuideSvg from '../../assets/icons/guide.svg';
import { userApi } from '../../api/user';
import { missionApi } from '../../api/mission';
import { autonomyApi, AutonomyNode, AutonomyMissionDetailResponse } from '../../api/autonomy';

const { width, height } = Dimensions.get('window');

interface IndependenceScreenProps {
  onBackToHome?: () => void;
  onToggleNavBar?: (visible: boolean) => void;
  onRestForToday?: () => void;
  onGoToCollection?: () => void;
}

export default function IndependenceScreen({ onBackToHome, onToggleNavBar, onRestForToday, onGoToCollection }: IndependenceScreenProps) {
  const insets = useSafeAreaInsets();
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showUnlock, setShowUnlock] = useState(false);
  const [showMissionComplete, setShowMissionComplete] = useState(false);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [showVerifyScreen, setShowVerifyScreen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [nodes, setNodes] = useState<AutonomyNode[]>([]);
  const [currentMissionDetail, setCurrentMissionDetail] = useState<AutonomyMissionDetailResponse | null>(null);
  const [isLoadingMission, setIsLoadingMission] = useState(false);

  const fetchStepData = React.useCallback(async () => {
    try {
      const pathData = await autonomyApi.getPath();
      setCurrentStep(pathData.currentStep);
      setNodes(pathData.nodes || []);
    } catch (error) {
      console.error('Failed to fetch user current step', error);
    }
  }, []);

  React.useEffect(() => {
    fetchStepData();
  }, [fetchStepData]);

  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    if (onToggleNavBar) {
      onToggleNavBar(!showUnlock && !showRoadmapModal && !showVerifyScreen);
    }
  }, [showUnlock, showRoadmapModal, showVerifyScreen, onToggleNavBar]);

  const NODE_SPACING = 130;

  // Use nodes from backend, or a fallback list if empty
  const totalNodes = nodes.length > 0 ? nodes.length : currentStep + 3;
  const nodesToUse = nodes.length > 0 ? nodes : Array.from({ length: totalNodes }).map((_, i) => ({
    step: i + 1,
    status: i < currentStep ? 'COMPLETED' : i === currentStep ? 'IN_PROGRESS' : 'LOCKED',
    missionId: 'mock-id-' + i,
    title: '나에게 맞는 지원금 보기',
  }));

  const ROADMAP_NODES = nodesToUse.map((node, i) => {
    let leftRatio = 0.5;
    if (i % 4 === 0) leftRatio = 0.35;
    else if (i % 4 === 1) leftRatio = 0.65;
    else if (i % 4 === 2) leftRatio = 0.8;
    else if (i % 4 === 3) leftRatio = 0.5;

    return {
      id: node.step - 1, // 0-indexed ID for nodes rendering
      step: node.step,
      missionId: node.missionId,
      status: node.status,
      title: node.title,
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

  const handleOpenMission = async () => {
    // Find the node corresponding to currentStep
    const currentNode = nodes.find(n => n.step === currentStep || n.status === 'CURRENT');
    const missionId = currentNode?.missionId;

    if (missionId) {
      setIsLoadingMission(true);
      try {
        const detail = await autonomyApi.getMission(missionId);
        setCurrentMissionDetail(detail);
      } catch (error) {
        console.error('Failed to fetch autonomy mission details', error);
      } finally {
        setIsLoadingMission(false);
      }
    }
    setShowMissionModal(true);
  };

  const handleRest = () => {
    setShowMissionModal(false);
    // Slight delay to allow first modal to close smoothly before opening second
    setTimeout(() => {
      setShowSwapModal(true);
    }, 150);
  };

  const handleStartMission = async () => {
    setShowMissionModal(false);
    const currentNode = nodes.find(n => n.step === currentStep || n.status === 'CURRENT');
    const missionId = currentNode?.missionId;

    if (missionId) {
      try {
        await autonomyApi.startMission(missionId);
      } catch (error) {
        console.error('Failed to start autonomy mission', error);
      }
    }
    // 미션 인증 화면을 보여줍니다
    setTimeout(() => {
      setShowVerifyScreen(true);
    }, 150);
  };

  const handleRestForToday = async () => {
    setShowSwapModal(false);
    try {
      await missionApi.restToday();
    } catch (error) {
      console.error('Failed to rest today', error);
    }
    onRestForToday?.();
  };

  const handleStartSmaller = async () => {
    setShowSwapModal(false);
    try {
      await missionApi.swapMission('easy');
      fetchStepData();
    } catch (error) {
      console.error('Failed to start smaller mission', error);
    }
  };

  if (showVerifyScreen) {
    return (
      <MissionVerifyScreen
        onCancel={() => setShowVerifyScreen(false)}
        onVerifyComplete={async (photoUri) => {
          setShowVerifyScreen(false);
          const currentNode = nodes.find(n => n.step === currentStep || n.status === 'CURRENT');
          const missionId = currentNode?.missionId;
          if (missionId) {
            try {
              // Submit evidence if photoUri exists
              if (photoUri) {
                await autonomyApi.submitEvidence(missionId, { photoUri });
              }
              // Complete the mission
              await autonomyApi.completeMission(missionId);
            } catch (error) {
              console.error('Failed to complete autonomy mission on backend', error);
            }
          }
          await fetchStepData();
          // 미션 완료 모달 표시
          setTimeout(() => setShowMissionComplete(true), 300);
        }}
      />
    );
  }

  if (showUnlock) {
    return (
      <NextStageScreen
        stageType="independence"
        onClose={() => setShowUnlock(false)}
        onGoToStage={() => {
          setShowUnlock(false);
        }}
        onGoToCollection={onGoToCollection}
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
        description={"또 한 발짝 나아갔어.\n두디가 응원하고 있어!"}
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

      {/* Top Header */}
      <View
        style={[
          tw`absolute left-0 right-0 z-20 flex-row justify-between items-center px-6`,
          { top: Platform.OS === 'ios' ? insets.top : insets.top + 10 },
        ]}
      >
        {/* Left: Doody Logo */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onBackToHome}
          style={tw`w-[90px] h-[40px] items-center justify-center`}
        >
          <Image
            source={DoodyLogo}
            style={tw`w-full h-full`}
            contentFit="contain"
          />
        </TouchableOpacity>

        {/* Right: Roadmap Toggle Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowRoadmapModal(true)}
          style={tw`w-11 h-11 rounded-full bg-white items-center justify-center shadow-md border border-gray-100/50`}
        >
          <GuideSvg width={20} height={20} />
        </TouchableOpacity>
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
        title={currentMissionDetail?.title}
        reason={currentMissionDetail?.reason}
        steps={currentMissionDetail?.howTo}
        reward={currentMissionDetail?.reward}
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

      {/* Roadmap Modal */}
      <IndependenceRoadmapModal
        visible={showRoadmapModal}
        onClose={() => setShowRoadmapModal(false)}
        currentStep={currentStep}
      />
    </View>
  );
}