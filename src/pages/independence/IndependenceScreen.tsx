import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import tw from '@/shared/lib/tailwind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';

import MorningSuccessModal from '@/features/checkIn/ui/MorningSuccessModal';
import GuideSvg from '@/shared/assets/icons/guide.svg';
import DoodyLogo from '@/shared/assets/logos/doodyLogo.png';

import { missionApi } from '@/shared/api/mission';
import { autonomyApi, AutonomyNode, AutonomyMissionDetailResponse } from '@/shared/api/autonomy';
import { hanaFinanceApi } from '@/shared/api/hanaFinance';
import { useCollectionStore } from '@/entities/useCollectionStore';

// Widgets
import IndependenceMapWidget from '@/widgets/independence/ui/IndependenceMapWidget';
import IndependenceMissionWidget from '@/widgets/independence/ui/IndependenceMissionWidget';

interface IndependenceScreenProps {
  onBackToHome?: () => void;
  onToggleNavBar?: (visible: boolean) => void;
  onRestForToday?: () => void;
  onGoToCollection?: () => void;
}

export default function IndependenceScreen({ 
  onBackToHome, onToggleNavBar, onRestForToday, onGoToCollection 
}: IndependenceScreenProps) {
  const insets = useSafeAreaInsets();
  
  // Widget States
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showRestConfirmModal, setShowRestConfirmModal] = useState(false);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [showVerifyScreen, setShowVerifyScreen] = useState(false);
  const [showUnlock, setShowUnlock] = useState(false);
  const [showMissionComplete, setShowMissionComplete] = useState(false);
  
  // Data States
  const [currentStep, setCurrentStep] = useState(1);
  const [nodes, setNodes] = useState<AutonomyNode[]>([]);
  const [currentMissionDetail, setCurrentMissionDetail] = useState<AutonomyMissionDetailResponse | null>(null);
  const [completedReward, setCompletedReward] = useState<number>(30);
  const [todayAvailable, setTodayAvailable] = useState<boolean>(true);

  const fetchStepData = useCallback(async () => {
    try {
      const pathData = await autonomyApi.getPath();
      const step = pathData.currentStep > 0 ? pathData.currentStep : 1;
      setCurrentStep(step);
      const sortedNodes = [...(pathData.nodes || [])].sort((a, b) => a.step - b.step);
      setNodes(sortedNodes);

      const today = new Date().toISOString().split('T')[0];
      const localCompletedDate = await AsyncStorage.getItem('daily_mission_completed_date');
      setTodayAvailable(pathData.todayAvailable !== false && localCompletedDate !== today);
    } catch (error) {
      console.error('Failed to fetch user current step', error);
    }
  }, []);

  useEffect(() => {
    fetchStepData();
  }, [fetchStepData]);

  useEffect(() => {
    if (onToggleNavBar) {
      onToggleNavBar(!showUnlock && !showRoadmapModal && !showVerifyScreen);
    }
  }, [showUnlock, showRoadmapModal, showVerifyScreen, onToggleNavBar]);

  // Compute mock nodes based on current step
  const desiredLength = Math.max(4, currentStep + 3);
  const nodesToUse: AutonomyNode[] = [];
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

  const activeIndex = nodesToUse.findIndex(n => n.status !== 'COMPLETED');

  const handleOpenMission = async () => {
    if (!todayAvailable) {
      import('react-native').then(({ Alert }) => {
        Alert.alert('미션 완료', '오늘의 미션을 이미 완료했어요! 내일 다시 와주세요.');
      });
      return;
    }
    const currentNode = activeIndex >= 0 ? nodesToUse[activeIndex] : undefined;
    const missionId = currentNode?.missionId;

    if (!missionId || missionId.startsWith('mock-id')) return;

    try {
      const detail = await autonomyApi.getMission(missionId);
      setCurrentMissionDetail(detail);
      setShowMissionModal(true);
    } catch (error) {
      console.error('Failed to fetch autonomy mission details', error);
    }
  };

  const handleRest = () => {
    setShowMissionModal(false);
    const isEasy = currentMissionDetail?.isFallback === true || currentMissionDetail?.missionType === 'EASY';
    setTimeout(() => {
      if (isEasy) setShowRestConfirmModal(true);
      else setShowSwapModal(true);
    }, 150);
  };

  const handleCompleteMissionProcess = async (missionId: string, photoUri?: string) => {
    if (photoUri) {
      try {
        await autonomyApi.submitEvidence(missionId, { photoUri });
      } catch (error) {
        console.error('Failed to submit evidence', error);
      }
    }
    try {
      const res = await autonomyApi.completeMission(missionId);
      setCompletedReward(res?.reward ?? 30);
      
      if (res && res.collectedDudy && res.collectedDudy.length > 0) {
        const { unlockDoody } = useCollectionStore.getState();
        res.collectedDudy.forEach((dudy: any) => {
          if (dudy.id === 'd_rhythm_common' || dudy.axis === 'rhythm') unlockDoody(4);
          else if (dudy.axis === 'autonomy') unlockDoody(6);
          else if (dudy.axis === 'connection') unlockDoody(5);
        });
      }

      const today = new Date().toISOString().split('T')[0];
      await AsyncStorage.setItem('daily_mission_completed_date', today);

      await fetchStepData();
      setTimeout(() => setShowMissionComplete(true), 300);
    } catch (error) {
      console.error('Failed to complete autonomy mission', error);
    }
  };

  const handleStartMission = async () => {
    setShowMissionModal(false);
    const currentNode = activeIndex >= 0 ? nodesToUse[activeIndex] : undefined;
    const missionId = currentMissionDetail?.missionId || currentNode?.missionId;

    if (!missionId || missionId.startsWith('mock-id')) return;

    try {
      await autonomyApi.startMission(missionId);
    } catch (error) {
      console.error('Failed to start autonomy mission', error);
    }
    
    if (missionId === 'a06_future_capture_1') {
      setTimeout(() => setShowVerifyScreen(true), 150);
    } else {
      await handleCompleteMissionProcess(missionId);
    }
  };

  const handleStartSmaller = async () => {
    setShowSwapModal(false);
    try {
      const currentNode = activeIndex >= 0 ? nodesToUse[activeIndex] : undefined;
      const originalMissionId = currentNode?.missionId;

      if (originalMissionId) {
        await autonomyApi.rejectMission(originalMissionId, '쉬운 미션으로 변경');
      }
      if (currentMissionDetail?.fallbackMissionId) {
        const detail = await autonomyApi.getMission(currentMissionDetail.fallbackMissionId);
        setCurrentMissionDetail(detail);
        setShowMissionModal(true);
      } else {
        await fetchStepData();
      }
    } catch (error) {
      console.error('Failed to start smaller mission', error);
    }
  };

  const handleRestForToday = async () => {
    try {
      await missionApi.restToday();
    } catch (error) {
      console.error('Failed to rest today', error);
    }
    onRestForToday?.();
  };

  return (
    <View style={tw`flex-1`}>
      {/* Fog Overlay */}
      <View style={tw`absolute top-0 left-0 right-0 h-48 z-10`} pointerEvents="none">
        {Array.from({ length: 24 }).map((_, i) => (
          <View key={i} style={[tw`w-full flex-1`, { backgroundColor: `rgba(230, 245, 242, ${1 - (i / 23)})` }]} />
        ))}
      </View>

      {/* Top Header */}
      <View style={[tw`absolute left-0 right-0 z-20 flex-row justify-between items-center px-6`, { top: Platform.OS === 'ios' ? insets.top : insets.top + 10 }]}>
        <TouchableOpacity activeOpacity={0.7} onPress={onBackToHome} style={tw`w-[90px] h-[40px] items-center justify-center`}>
          <Image source={DoodyLogo} style={tw`w-full h-full`} contentFit="contain" />
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8} onPress={() => setShowRoadmapModal(true)} style={tw`w-11 h-11 rounded-full bg-white items-center justify-center shadow-md border border-gray-100/50`}>
          <GuideSvg width={20} height={20} />
        </TouchableOpacity>
      </View>

      <IndependenceMapWidget 
        nodesToUse={nodesToUse}
        activeIndex={activeIndex}
        onOpenMission={handleOpenMission}
      />

      {/* Bottom Panel */}
      <View style={[tw`bg-white px-6 pt-8 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-20`, { paddingBottom: insets.bottom + 90 }]}>
        <Text style={tw`text-xl font-black text-gray-900 mb-6`}>
          오늘의 <Text style={tw`text-[#008C75]`}>한 칸</Text>을 같이 열어볼까?
        </Text>
        <TouchableOpacity activeOpacity={0.8} onPress={handleOpenMission} style={tw`w-full bg-[#008C75] py-4 rounded-full items-center justify-center shadow-md`}>
          <Text style={tw`text-white font-bold text-base`}>오늘의 한 칸 열기</Text>
        </TouchableOpacity>
      </View>

      <IndependenceMissionWidget 
        showMissionModal={showMissionModal}
        setShowMissionModal={setShowMissionModal}
        showSwapModal={showSwapModal}
        setShowSwapModal={setShowSwapModal}
        showRestConfirmModal={showRestConfirmModal}
        setShowRestConfirmModal={setShowRestConfirmModal}
        showRoadmapModal={showRoadmapModal}
        setShowRoadmapModal={setShowRoadmapModal}
        showVerifyScreen={showVerifyScreen}
        setShowVerifyScreen={setShowVerifyScreen}
        showUnlock={showUnlock}
        setShowUnlock={setShowUnlock}
        currentStep={currentStep}
        currentMissionDetail={currentMissionDetail}
        onRest={handleRest}
        onStartMission={handleStartMission}
        onStartSmaller={handleStartSmaller}
        onRestForToday={handleRestForToday}
        onVerifyComplete={async (photoUri) => {
          const missionId = currentMissionDetail?.missionId;
          if (missionId) await handleCompleteMissionProcess(missionId, photoUri);
        }}
        onGoToCollection={onGoToCollection}
      />

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
            onBackToHome?.();
          }
        }}
        title="오늘의 한 칸 완료!"
        description={"또 한 발짝 나아갔어.\n두디가 응원하고 있어!"}
        points={completedReward}
      />
    </View>
  );
}