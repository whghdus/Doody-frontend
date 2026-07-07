// src/screens/IndependenceScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import tw from '../../utils/tailwind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path } from 'react-native-svg';
import { Image } from 'expo-image';
import IndependenceMissionModal from './IndependenceMissionModal';
import IndependenceSwapModal from './IndependenceSwapModal';
import IndependenceRestConfirmModal from './IndependenceRestConfirmModal';
import NextStageScreen from '../mission/NextStageScreen';
import MorningSuccessModal from '../../components/home/MorningSuccessModal';
import IndependenceRoadmapModal from './IndependenceRoadmapModal';
import MissionVerifyScreen from '../mission/MissionVerifyScreen';
import CheckSvg from '../../assets/icons/check.svg';
import CurrentLocationSvg from '../../assets/icons/currentLocation.svg';
import LockSvg from '../../assets/icons/lock.svg';
import GuideSvg from '../../assets/icons/guide.svg';
import { useCollectionStore } from '../../store/useCollectionStore';
import DoodyLogo from '../../assets/logos/doodyLogo.png';
import { userApi } from '../../api/user';
import { missionApi } from '../../api/mission';
import { autonomyApi, AutonomyNode, AutonomyMissionDetailResponse } from '../../api/autonomy';
import { hanaFinanceApi } from '../../api/hanaFinance';

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
  const [showRestConfirmModal, setShowRestConfirmModal] = useState(false);
  const [showUnlock, setShowUnlock] = useState(false);
  const [showMissionComplete, setShowMissionComplete] = useState(false);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [showVerifyScreen, setShowVerifyScreen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [nodes, setNodes] = useState<AutonomyNode[]>([]);
  const [currentMissionDetail, setCurrentMissionDetail] = useState<AutonomyMissionDetailResponse | null>(null);
  const [isLoadingMission, setIsLoadingMission] = useState(false);
  const [completedReward, setCompletedReward] = useState<number>(30);
  const [todayAvailable, setTodayAvailable] = useState<boolean>(true);

  const fetchStepData = React.useCallback(async () => {
    try {
      const pathData = await autonomyApi.getPath();
      const step = pathData.currentStep > 0 ? pathData.currentStep : 1;
      setCurrentStep(step);
      // Sort nodes by step ascending to ensure they render from bottom to top on the roadmap
      const sortedNodes = [...(pathData.nodes || [])].sort((a, b) => a.step - b.step);
      setNodes(sortedNodes);

      const today = new Date().toISOString().split('T')[0];
      const localCompletedDate = await AsyncStorage.getItem('daily_mission_completed_date');
      setTodayAvailable(pathData.todayAvailable !== false && localCompletedDate !== today);
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

  const desiredLength = Math.max(4, currentStep + 3);
  const nodesToUse: AutonomyNode[] = [];
  
  // Find the real current node from the backend to extract its missionId
  const currentBackendNode = nodes.find(n => {
    const s = n.status?.toUpperCase();
    return s === 'CURRENT' || s === 'IN_PROGRESS';
  }) || (nodes.length > 0 ? nodes[nodes.length - 1] : undefined);

  for (let s = 1; s <= desiredLength; s++) {
    let status: 'COMPLETED' | 'CURRENT' | 'LOCKED' = 'LOCKED';
    if (s < currentStep) status = 'COMPLETED';
    else if (s === currentStep) status = 'CURRENT';

    nodesToUse.push({
      step: s,
      status,
      missionId: status === 'CURRENT' && currentBackendNode ? currentBackendNode.missionId : `mock-id-${s}`,
      title: status === 'CURRENT' && currentBackendNode ? currentBackendNode.title : '나에게 맞는 지원금 보기',
    });
  }
  const totalNodes = nodesToUse.length;

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
      originalIndex: i,
    };
  });

  const contentHeight = (totalNodes - 1) * NODE_SPACING + 300;

  // Find the first uncompleted block to use as a fallback if the backend doesn't provide a CURRENT node
  const activeIndex = ROADMAP_NODES.findIndex(n => n.status !== 'COMPLETED');
  const scrollToIndex = activeIndex >= 0 ? activeIndex : totalNodes - 1;

  React.useEffect(() => {
    if (scrollViewRef.current) {
      // Scroll so that the active step is roughly in the middle
      const currentTop = (totalNodes - 1 - scrollToIndex) * NODE_SPACING + 150;
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: currentTop - height / 2 + 100, animated: false });
      }, 100);
    }
  }, []);

  const handleOpenMission = async () => {
    if (!todayAvailable) {
      import('react-native').then(({ Alert }) => {
        Alert.alert('미션 완료', '오늘의 미션을 이미 완료했어요! 내일 다시 와주세요.');
      });
      return;
    }

    // Find the first uncompleted node
    const activeIndex = nodesToUse.findIndex(n => n.status !== 'COMPLETED');
    const currentNode = activeIndex >= 0 ? nodesToUse[activeIndex] : undefined;
    const missionId = currentNode?.missionId;

    if (!missionId || missionId.startsWith('mock-id')) {
      console.warn('Cannot open mission: Invalid or mock mission ID');
      return; // Do not open the modal for mock missions
    }

    setIsLoadingMission(true);
    try {
      const detail = await autonomyApi.getMission(missionId);
      setCurrentMissionDetail(detail);
      setShowMissionModal(true);
    } catch (error) {
      console.error('Failed to fetch autonomy mission details', error);
    } finally {
      setIsLoadingMission(false);
    }
  };

  const handleRest = () => {
    setShowMissionModal(false);
    // If it's already a fallback mission (easy), show rest confirm instead of swap
    const isEasy = currentMissionDetail?.isFallback === true || currentMissionDetail?.missionType === 'EASY';
    
    setTimeout(() => {
      if (isEasy) {
        setShowRestConfirmModal(true);
      } else {
        setShowSwapModal(true);
      }
    }, 150);
  };

  const handleCompleteMissionProcess = async (missionId: string, photoUri?: string) => {
    // Submit evidence if photoUri exists
    if (photoUri) {
      try {
        await autonomyApi.submitEvidence(missionId, { photoUri });
      } catch (error) {
        console.error('Failed to submit evidence on backend', error);
        // Continue to complete mission even if evidence upload fails locally
      }
    }
    // Complete the mission
    try {
      const res = await autonomyApi.completeMission(missionId);
      
      if (res && res.reward !== undefined) {
        setCompletedReward(res.reward);
      } else {
        setCompletedReward(30); // fallback if not provided
      }
      
      // Auto-unlock Doodies inside Collection Book if caught
      if (res && res.collectedDudy && res.collectedDudy.length > 0) {
        const { unlockDoody } = useCollectionStore.getState();
        res.collectedDudy.forEach((dudy: any) => {
          if (dudy.id === 'd_rhythm_common' || dudy.axis === 'rhythm') {
            unlockDoody(4); // SmileDoody
          } else if (dudy.axis === 'autonomy') {
            unlockDoody(6); // GreenDoody
          } else if (dudy.axis === 'connection') {
            unlockDoody(5); // SalaryDoody
          }
        });
      }

      const today = new Date().toISOString().split('T')[0];
      await AsyncStorage.setItem('daily_mission_completed_date', today);

      // 미션 완료 모달 표시는 성공했을 때만!
      await fetchStepData();

      setTimeout(() => setShowMissionComplete(true), 300);
    } catch (error) {
      console.error('Failed to complete autonomy mission on backend', error);
      // Do not show success modal if completion failed
    }
  };

  const handleStartMission = async () => {
    setShowMissionModal(false);
    const activeIndex = nodesToUse.findIndex(n => n.status !== 'COMPLETED');
    const currentNode = activeIndex >= 0 ? nodesToUse[activeIndex] : undefined;
    const missionId = currentMissionDetail?.missionId || currentNode?.missionId;

    if (!missionId || missionId.startsWith('mock-id')) {
      return;
    }

    try {
      await autonomyApi.startMission(missionId);
    } catch (error) {
      console.error('Failed to start autonomy mission', error);
    }
    
    if (missionId === 'a06_future_capture_1') {
      // 미션 인증 화면을 보여줘
      setTimeout(() => {
        setShowVerifyScreen(true);
      }, 150);
    } else {
      // 그 외의 미션은 인증 없이 바로 완료 처리
      await handleCompleteMissionProcess(missionId);
    }
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
      const activeIndex = nodesToUse.findIndex(n => n.status !== 'COMPLETED');
      const currentNode = activeIndex >= 0 ? nodesToUse[activeIndex] : undefined;
      const originalMissionId = currentNode?.missionId;

      if (originalMissionId) {
        await autonomyApi.rejectMission(originalMissionId, '쉬운 미션으로 변경');
      }

      if (currentMissionDetail?.fallbackMissionId) {
        setIsLoadingMission(true);
        const detail = await autonomyApi.getMission(currentMissionDetail.fallbackMissionId);
        setCurrentMissionDetail(detail);
        setShowMissionModal(true);
        setIsLoadingMission(false);
      } else {
        await fetchStepData();
      }
    } catch (error) {
      console.error('Failed to start smaller mission', error);
      setIsLoadingMission(false);
    }
  };

  if (showVerifyScreen) {
    return (
      <MissionVerifyScreen
        onCancel={() => setShowVerifyScreen(false)}
        onVerifyComplete={async (photoUri) => {
          setShowVerifyScreen(false);
          const activeIndex = nodesToUse.findIndex(n => n.status !== 'COMPLETED');
          const currentNode = activeIndex >= 0 ? nodesToUse[activeIndex] : undefined;
          const missionId = currentMissionDetail?.missionId || currentNode?.missionId;
          if (missionId) {
            await handleCompleteMissionProcess(missionId, photoUri);
          }
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
        onConfirm={async () => {
          setShowMissionComplete(false);
          try {
            const status = await hanaFinanceApi.getUnlockStatus('AUTONOMY');
            if (status.unlockable && !status.unlocked) {
              setTimeout(() => setShowUnlock(true), 200);
            } else {
              onBackToHome?.();
            }
          } catch (e) {
            console.error('Failed to check autonomy unlock status', e);
            onBackToHome?.();
          }
        }}
        title="오늘의 한 칸 완료!"
        description={"또 한 발짝 나아갔어.\n두디가 응원하고 있어!"}
        points={completedReward}
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
            let iconWidth = 20;
            let iconHeight = 20;
            let iconMarginBottom = 8;

            // If the backend didn't provide a CURRENT node, fallback to the first uncompleted node
            const statusStr = node.status as string;
            const isCurrent = statusStr === 'CURRENT' || statusStr === 'IN_PROGRESS' ||
                              (node.status === 'LOCKED' && node.originalIndex === activeIndex);

            // Platform (발판) background View
            const platformBg = isCurrent ? '#009278' : '#E6F5F2';
            const platformShadow = isCurrent ? '#017661' : '#DCEAE7';

            let InnerIcon = null;
            if (node.status === 'COMPLETED') {
              InnerIcon = <CheckSvg width="100%" height="100%" />;
            } else if (isCurrent) {
              InnerIcon = <CurrentLocationSvg width="100%" height="100%" />;
              iconWidth = 50;
              iconHeight = 50;
              iconMarginBottom = 50;
            } else {
              InnerIcon = <LockSvg width="100%" height="100%" />;
              iconMarginBottom = 18;
            }

            return (
              <TouchableOpacity
                key={node.id}
                activeOpacity={isCurrent ? 0.8 : 1}
                onPress={isCurrent ? handleOpenMission : undefined}
                style={[
                  tw`absolute items-center justify-center`,
                  {
                    top: node.top,
                    left: node.left - (78 / 2),
                    zIndex: isCurrent ? 2 : 1,
                    width: 78,
                    height: 74,
                  },
                ]}
              >
                {/* Platform base shadow */}
                <View style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 4,
                  right: 4,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: platformShadow,
                  top: 6,
                }} />
                {/* Platform top face */}
                <View style={{
                  position: 'absolute',
                  top: 0,
                  left: 4,
                  right: 4,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: platformBg,
                }} />
                {/* Inner Icon */}
                <View style={{ width: iconWidth, height: iconHeight, marginBottom: iconMarginBottom, zIndex: 2 }}>
                  {InnerIcon}
                </View>
              </TouchableOpacity>
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

      {/* Mission Modals */}
      <IndependenceMissionModal
        visible={showMissionModal}
        title={currentMissionDetail?.title}
        reason={currentMissionDetail?.reason}
        steps={currentMissionDetail?.howTo}
        reward={currentMissionDetail?.reward}
        onRest={handleRest}
        onStart={handleStartMission}
        onClose={() => setShowMissionModal(false)}
      />

      <IndependenceSwapModal
        visible={showSwapModal}
        onBack={() => {
          setShowSwapModal(false);
          setTimeout(() => setShowMissionModal(true), 150);
        }}
        onRest={() => {
          setShowSwapModal(false);
          if (onRestForToday) onRestForToday();
        }}
        onStartSmaller={handleStartSmaller}
      />

      <IndependenceRestConfirmModal
        visible={showRestConfirmModal}
        onBack={() => {
          setShowRestConfirmModal(false);
          setTimeout(() => setShowMissionModal(true), 150);
        }}
        onRestForToday={() => {
          setShowRestConfirmModal(false);
          if (onRestForToday) onRestForToday();
        }}
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