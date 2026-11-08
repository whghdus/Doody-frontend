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
import Background from '@/shared/ui/Background';

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
  const [rejectCandidate, setRejectCandidate] = useState<import('@/shared/api/mission').BackendMission | null>(null);
  const [rejectMessage, setRejectMessage] = useState<string>('');
  const [showUnlock, setShowUnlock] = useState(false);
  const [showMissionComplete, setShowMissionComplete] = useState(false);

  // Data States
  const [currentStep, setCurrentStep] = useState(1);
  const [nodes, setNodes] = useState<AutonomyNode[]>([]);
  const [pathTitle, setPathTitle] = useState<string>('');
  const [currentMissionDetail, setCurrentMissionDetail] = useState<AutonomyMissionDetailResponse | null>(null);
  const [completedReward, setCompletedReward] = useState<number | undefined>(undefined);
  const [todayAvailable, setTodayAvailable] = useState<boolean>(true);
  const [isResting, setIsResting] = useState<boolean>(false);

  const fetchStepData = useCallback(async () => {
    try {
      const [pathData, todayMission] = await Promise.all([
        autonomyApi.getPath(),
        missionApi.getTodayMission(),
      ]);

      setCurrentStep(pathData.currentStep > 0 ? pathData.currentStep : 1);
      setPathTitle(pathData.title || '');
      setNodes([...(pathData.nodes || [])].sort((x, y) => x.step - y.step));

      const today = new Date().toISOString().split('T')[0];
      const localCompletedDate = await AsyncStorage.getItem('daily_mission_completed_date');
      setTodayAvailable(pathData.todayAvailable !== false && localCompletedDate !== today);

      if (todayMission.missionState?.toLowerCase() === 'gated') {
        setIsResting(true);
      } else {
        setIsResting(false);
      }
    } catch (e) {
      console.error('Failed to fetch autonomy path', e);
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

  const nodesToUse: AutonomyNode[] = nodes;

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

    if (!missionId) return;

    try {
      const detail = await autonomyApi.getMission(missionId);
      setCurrentMissionDetail(detail);
      setShowMissionModal(true);
    } catch (error) {
      console.error('Failed to fetch autonomy mission details', error);
    }
  };

  const handleRest = async () => {
    setShowMissionModal(false);
    const isEasy = currentMissionDetail?.isFallback === true || currentMissionDetail?.missionType === 'EASY';

    if (isEasy) {
      setTimeout(() => setShowRestConfirmModal(true), 150);
    } else {
      try {
        const currentNode = activeIndex >= 0 ? nodesToUse[activeIndex] : undefined;
        const originalMissionId = currentNode?.missionId;
        if (originalMissionId) {
          const rejectRes = await autonomyApi.rejectMission(originalMissionId, '쉬운 미션으로 변경');
          if (rejectRes.candidates && rejectRes.candidates.length > 0) {
            setRejectCandidate(rejectRes.candidates[0]);
            setRejectMessage(rejectRes.message || '조금 더 쉬운 걸음으로 바꿔볼게');
          }
        }
      } catch (error) {
        console.error('Failed to reject mission', error);
      }
      setTimeout(() => setShowSwapModal(true), 150);
    }
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
      setCompletedReward(res?.reward?.hanaMoney);

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

    if (!missionId) return;

    try {
      await autonomyApi.startMission(missionId);
    } catch (error) {
      console.error('Failed to start autonomy mission', error);
    }

    // Missions that need photo evidence go through the verify screen first.
    if ((currentMissionDetail?.requiredEvidenceCount ?? 0) > 0) {
      setTimeout(() => setShowVerifyScreen(true), 150);
    } else {
      await handleCompleteMissionProcess(missionId);
    }
  };

  const handleStartSmaller = async () => {
    setShowSwapModal(false);
    try {
      if (rejectCandidate) {
        setCurrentMissionDetail({
          missionId: rejectCandidate.missionId,
          axis: rejectCandidate.axis,
          stage: rejectCandidate.stage,
          title: rejectCandidate.title,
          description: rejectCandidate.description,
          reason: rejectCandidate.reason,
          howTo: rejectCandidate.howTo || [],
          goalTags: rejectCandidate.goalTags || [],
          missionType: rejectCandidate.missionType,
          requiredEvidenceCount: rejectCandidate.requiredCount,
          reward: rejectCandidate.reward ?? { hanaMoney: 0 },
          externalUrl: null,
          fallbackMissionId: rejectCandidate.fallbackMissionId,
          isFallback: rejectCandidate.isFallback
        });
        setTimeout(() => setShowMissionModal(true), 150);
      } else if (currentMissionDetail?.fallbackMissionId) {
        const detail = await autonomyApi.getMission(currentMissionDetail.fallbackMissionId);
        setCurrentMissionDetail(detail);
        setTimeout(() => setShowMissionModal(true), 150);
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
    <Background theme={isResting ? 'night' : 'day'}>
      <View style={tw`flex-1 relative`}>
        {/* Header */}
        <View style={[tw`absolute w-full z-10 px-5 flex-row justify-between items-center`, { top: insets.top + 16 }]}>
          <TouchableOpacity
            onPress={onBackToHome}
            style={tw`w-[80px] h-[36px]`}
          >
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
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleOpenMission}
            style={tw`w-full ${todayAvailable ? 'bg-[#008C75]' : 'bg-gray-400'} py-4 rounded-full items-center justify-center shadow-md`}
            disabled={!todayAvailable}
          >
            <Text style={tw`text-white font-bold text-base`}>
              {todayAvailable ? '오늘의 한 칸 열기' : '오늘은 이미 다 했어요'}
            </Text>
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
          nodes={nodesToUse}
          pathTitle={pathTitle}
          currentMissionDetail={currentMissionDetail}
          onRest={handleRest}
          onStartMission={handleStartMission}
          onStartSmaller={handleStartSmaller}
          candidate={rejectCandidate}
          message={rejectMessage}
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
          description={"자립에 한 발짝 다가갔어.\n두디가 널 응원하고 있어!"}
          points={completedReward}
        />
      </View>
    </Background>
  );
}