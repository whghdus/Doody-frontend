import React from 'react';
import IndependenceMissionModal from '@/features/independence/ui/IndependenceMissionModal';
import IndependenceSwapModal from '@/features/independence/ui/IndependenceSwapModal';
import IndependenceRestConfirmModal from '@/features/independence/ui/IndependenceRestConfirmModal';
import IndependenceRoadmapModal from '@/features/independence/ui/IndependenceRoadmapModal';
import NextStageScreen from '@/pages/mission/NextStageScreen';
import MissionVerifyScreen from '@/pages/mission/MissionVerifyScreen';
import { AutonomyMissionDetailResponse, AutonomyNode } from '@/shared/api/autonomy';

interface IndependenceMissionWidgetProps {
  showMissionModal: boolean;
  setShowMissionModal: (visible: boolean) => void;
  showSwapModal: boolean;
  setShowSwapModal: (visible: boolean) => void;
  showRestConfirmModal: boolean;
  setShowRestConfirmModal: (visible: boolean) => void;
  showRoadmapModal: boolean;
  setShowRoadmapModal: (visible: boolean) => void;
  showVerifyScreen: boolean;
  setShowVerifyScreen: (visible: boolean) => void;
  showUnlock: boolean;
  setShowUnlock: (visible: boolean) => void;
  currentStep: number;
  nodes?: AutonomyNode[];
  pathTitle?: string;
  currentMissionDetail: AutonomyMissionDetailResponse | null;
  onRest: () => void;
  onStartMission: () => void;
  onStartSmaller: () => void;
  candidate?: import('@/shared/api/mission').BackendMission | null;
  message?: string;
  onRestForToday: () => void;
  onVerifyComplete: (photoUri?: string) => Promise<void>;
  onGoToCollection?: () => void;
}

export default function IndependenceMissionWidget({
  showMissionModal, setShowMissionModal,
  showSwapModal, setShowSwapModal,
  showRestConfirmModal, setShowRestConfirmModal,
  showRoadmapModal, setShowRoadmapModal,
  showVerifyScreen, setShowVerifyScreen,
  showUnlock, setShowUnlock,
  currentStep,
  nodes,
  pathTitle,
  currentMissionDetail,
  onRest,
  onStartMission,
  onStartSmaller,
  candidate,
  message,
  onRestForToday,
  onVerifyComplete,
  onGoToCollection,
}: IndependenceMissionWidgetProps) {

  if (showVerifyScreen) {
    return (
      <MissionVerifyScreen
        onCancel={() => setShowVerifyScreen(false)}
        onVerifyComplete={async (photoUri) => {
          setShowVerifyScreen(false);
          await onVerifyComplete(photoUri);
        }}
      />
    );
  }

  if (showUnlock) {
    return (
      <NextStageScreen
        stageType="independence"
        onClose={() => setShowUnlock(false)}
        onGoToStage={() => setShowUnlock(false)}
        onGoToCollection={onGoToCollection}
      />
    );
  }

  return (
    <>
      <IndependenceMissionModal
        visible={showMissionModal}
        title={currentMissionDetail?.title || ''}
        reason={currentMissionDetail?.reason || ''}
        steps={currentMissionDetail?.howTo || []}
        reward={currentMissionDetail?.reward?.hanaMoney}
        onRest={onRest}
        onStart={onStartMission}
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
          onRestForToday();
        }}
        onStartSmaller={onStartSmaller}
        candidate={candidate}
        message={message}
      />

      <IndependenceRestConfirmModal
        visible={showRestConfirmModal}
        onBack={() => {
          setShowRestConfirmModal(false);
          setTimeout(() => setShowMissionModal(true), 150);
        }}
        onRestForToday={() => {
          setShowRestConfirmModal(false);
          onRestForToday();
        }}
      />

      <IndependenceRoadmapModal
        visible={showRoadmapModal}
        onClose={() => setShowRoadmapModal(false)}
        currentStep={currentStep}
        nodes={nodes}
        pathTitle={pathTitle}
      />
    </>
  );
}
