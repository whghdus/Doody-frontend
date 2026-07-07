import React, { useState, useCallback } from 'react';
import { View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { missionApi, Mission } from '@/shared/api/mission';
import MissionVerifyScreen from '@/pages/mission/MissionVerifyScreen';
import MissionSuccessScreen from '@/pages/mission/MissionSuccessScreen';
import NextStageScreen from '@/pages/mission/NextStageScreen';
import MissionDetailModal from '@/features/mission/ui/MissionDetailModal';
import MissionCard from '@/features/mission/ui/MissionCard';
import MissionSwapModal from '@/features/mission/ui/MissionSwapModal';
import { StageType } from '@/pages/mission/NextStageScreen';

interface ActiveMissionWidgetProps {
  currentMission: string;
  missionData: Mission | null;
  homeMode: 'default' | 'completed' | 'resting';
  points: number;
  missionCount: number;
  onPointsEarned: (points: number, currentStep: number) => void;
  onNavigateTab: (tab: string) => void;
  onRestToday: () => void;
  onMissionTitleChange: (newTitle: string) => void;
  onRefreshData: () => void;
}

export default function ActiveMissionWidget({
  currentMission,
  missionData,
  homeMode,
  points,
  missionCount,
  onPointsEarned,
  onNavigateTab,
  onRestToday,
  onMissionTitleChange,
  onRefreshData
}: ActiveMissionWidgetProps) {
  const [homeViewState, setHomeViewState] = useState<'main' | 'detail' | 'smaller' | 'verify' | 'success_speak' | 'success_modal' | 'next_stage'>('main');
  const [selectedSmallerIdx, setSelectedSmallerIdx] = useState<number>(0);
  const [nextStageType, setNextStageType] = useState<StageType>('connection');

  const handleStartMission = useCallback(() => {
    if (missionData && missionData.axis) {
      if (missionData.axis === 'AUTONOMY') onNavigateTab('independence');
      else if (missionData.axis === 'CONNECTION') onNavigateTab('connection');
    } else if (missionData && missionData.nextPath) {
      if (missionData.nextPath === '/autonomy') onNavigateTab('independence');
      else if (missionData.nextPath === '/connection') onNavigateTab('connection');
    } else {
      if (currentMission.includes('자립')) onNavigateTab('independence');
      else onNavigateTab('connection');
    }
  }, [missionData, currentMission, onNavigateTab]);

  const handleCompleteMission = useCallback(() => {
    setHomeViewState('verify');
  }, []);

  const handleRestForToday = useCallback(async () => {
    try {
      await missionApi.swapMission('easy');
      onRefreshData();
    } catch (error) {
      console.error('Failed to rest today', error);
    }
    onRestToday();
    setHomeViewState('main');
  }, [onRefreshData, onRestToday]);

  const handleStartSmallerMission = useCallback(async () => {
    try {
      const mission = await missionApi.swapMission('easy');
      onMissionTitleChange(mission.title);
    } catch (error) {
      console.error('Failed to swap mission', error);
    }
    setHomeViewState('main');
  }, [selectedSmallerIdx, onMissionTitleChange]);

  const handleVerifyMission = async (photoUri?: string) => {
    if (!photoUri) return;
    try {
      const res = await missionApi.completeMission(photoUri);
      const today = new Date().toISOString().split('T')[0];
      await AsyncStorage.setItem('daily_mission_completed_date', today);
      
      onPointsEarned(res.newTotalPoints, res.currentStep);
      setHomeViewState('success_speak');
    } catch (error) {
      console.error('Failed to complete mission', error);
      Alert.alert('오류', '미션 완료 처리 중 문제가 발생했어.');
    }
  };

  if (homeViewState === 'verify') {
    return (
      <MissionVerifyScreen
        onCancel={() => setHomeViewState('main')}
        onVerifyComplete={handleVerifyMission}
      />
    );
  }

  if (homeViewState === 'success_speak' || homeViewState === 'success_modal') {
    return (
      <MissionSuccessScreen
        visibleModal={homeViewState === 'success_modal'}
        currentMission={currentMission}
        onNext={() => setHomeViewState('success_modal')}
        onGoHome={() => setHomeViewState('main')}
        onViewNextMission={() => {
          onMissionTitleChange('오늘 돈 쓴 게 있었는지 떠올리기');
          setHomeViewState('detail');
        }}
      />
    );
  }

  if (homeViewState === 'next_stage') {
    return (
      <NextStageScreen
        stageType={nextStageType}
        onClose={() => setHomeViewState('main')}
        onGoToStage={() => {
          if (nextStageType === 'connection') onNavigateTab('connection');
          else onNavigateTab('independence');
        }}
        onGoToCollection={() => onNavigateTab('report_collection')}
      />
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
      {homeMode === 'default' && (
        <MissionCard
          currentMission={currentMission}
          onStartMission={handleStartMission}
          onRest={() => setHomeViewState('detail')}
        />
      )}

      {homeViewState === 'detail' && (
        <MissionDetailModal
          visible={homeViewState === 'detail'}
          currentMission={currentMission}
          onClose={() => setHomeViewState('main')}
          onComplete={handleStartMission}
          onChangeToSmaller={() => setHomeViewState('smaller')}
        />
      )}

      {homeViewState === 'smaller' && (
        <MissionSwapModal
          visible={homeViewState === 'smaller'}
          selectedSmallerIdx={selectedSmallerIdx}
          setSelectedSmallerIdx={setSelectedSmallerIdx}
          onBack={() => setHomeViewState('detail')}
          onClose={() => setHomeViewState('main')}
          onStartSmaller={handleStartSmallerMission}
          onRest={handleRestForToday}
        />
      )}
    </View>
  );
}
