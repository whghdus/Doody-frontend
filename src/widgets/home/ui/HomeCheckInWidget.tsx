import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkInApi } from '@/shared/api/checkIn';
import { reportApi } from '@/shared/api/report';
import { useCollectionStore, mapDoodyIdToIndex } from '@/entities/useCollectionStore';
import MorningCheckInScreen from '@/pages/home/MorningCheckInScreen';
import NightCheckInScreen from '@/pages/home/NightCheckInScreen';
import MorningSuccessModal from '@/features/checkIn/ui/MorningSuccessModal';

interface HomeCheckInWidgetProps {
  homeMode: 'default' | 'completed' | 'resting';
  vRhythm?: number;
  onPointsEarned: () => void;
}

export default function HomeCheckInWidget({ homeMode, vRhythm, onPointsEarned }: HomeCheckInWidgetProps) {
  const [hasCheckedInMorning, setHasCheckedInMorning] = useState<boolean>(true);
  const [showMorningSuccess, setShowMorningSuccess] = useState<boolean>(false);
  const [morningPoints, setMorningPoints] = useState<number>(20);
  const [morningGreeting, setMorningGreeting] = useState<string>("와준 게 오늘 제일 큰 일이야.\n그것만으로 오늘 첫 단추는 끼웠어.");
  const [showNightCheckIn, setShowNightCheckIn] = useState<boolean>(false);
  
  // Track if check-in was completed in this session to prevent race conditions from reopening it
  const checkInCompletedRef = useRef(false);

  useEffect(() => {
    const checkCheckInStatus = async () => {
      if (checkInCompletedRef.current) return;

      try {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        const today = new Date(now.getTime() - offset).toISOString().split('T')[0];
        
        // 1. Check local storage first (Frontend Source of Truth for completed status)
        const localMorning = await AsyncStorage.getItem('morning_checkin_date');
        const localNight = await AsyncStorage.getItem('night_checkin_date');
        
        let hasMorning = localMorning === today;
        let hasNight = localNight === today;

        // 2. If local storage is false, check Backend vRhythm
        if (vRhythm !== undefined) {
          if (!hasMorning) hasMorning = (vRhythm === 1 || vRhythm === 3);
          if (!hasNight) hasNight = (vRhythm === 2 || vRhythm === 3);
        }

        // 3. If STILL false and vRhythm was undefined (or we just want to be absolutely sure), check recovery report
        if ((!hasMorning || !hasNight) && vRhythm === undefined) {
          const report = await reportApi.getRecoveryReport('week');
          const rhythmGroup = report.recordGroups?.find(g => g.axis === 'RHYTHM');
          
          if (rhythmGroup && rhythmGroup.records.length > 0) {
            rhythmGroup.records.forEach(r => {
              const timeStr = r.recordedAt || r.recordDate;
              if (timeStr && timeStr.startsWith(today)) {
                if (r.title?.includes('오늘의 기분') || r.missionType === 'MORNING_RHYTHM') {
                  hasMorning = true;
                } else if (r.title?.includes('하루 한 마디') || r.missionType === 'EVENING_RHYTHM') {
                  hasNight = true;
                } else {
                  const dateObj = new Date(timeStr);
                  if (dateObj.getHours() < 14) {
                    hasMorning = true;
                  } else {
                    hasNight = true;
                  }
                }
              }
            });
          }
        }
        
        setHasCheckedInMorning(hasMorning);
        if (homeMode === 'resting' && !hasNight && now.getHours() >= 14) {
          setShowNightCheckIn(true);
        } else {
          setShowNightCheckIn(false);
        }
      } catch (error) {
        console.error('Failed to verify check-in status', error);
      }
    };
    
    checkCheckInStatus();
  }, [homeMode, vRhythm]);

  const handleCompleteMorning = useCallback(async (mood: number) => {
    try {
      const res = await checkInApi.morning(mood);
      setMorningPoints(res.pointsEarned);
      if (res.greeting) {
        setMorningGreeting(res.greeting);
      }
      if (res.collectedDudy && res.collectedDudy.length > 0) {
        const { unlockDoody } = useCollectionStore.getState();
        res.collectedDudy.forEach((dudy: any) => {
          unlockDoody(mapDoodyIdToIndex(dudy.id));
        });
      }
      const today = new Date().toISOString().split('T')[0];
      await AsyncStorage.setItem('morning_checkin_date', today);
      
      checkInCompletedRef.current = true;
      setHasCheckedInMorning(true);
      setShowMorningSuccess(true);
      onPointsEarned();
    } catch (error: any) {
      console.error('Failed morning check-in', error);
      Alert.alert(
        '체크인 실패',
        error.response?.data?.message || '저장에 실패했습니다. 이미 완료한 체크인일 수 있습니다.',
        [{ text: '확인', onPress: () => setHasCheckedInMorning(true) }]
      );
    }
  }, [onPointsEarned]);

  return (
    <>
      <Modal
        visible={!hasCheckedInMorning}
        animationType="fade"
        transparent={false}
        onRequestClose={() => setHasCheckedInMorning(true)}
      >
        <MorningCheckInScreen 
          onClose={() => setHasCheckedInMorning(true)}
          onComplete={handleCompleteMorning} 
        />
      </Modal>
      
      <Modal
        visible={showNightCheckIn}
        animationType="fade"
        transparent={false}
        onRequestClose={() => setShowNightCheckIn(false)}
      >
        <NightCheckInScreen onClose={() => setShowNightCheckIn(false)} />
      </Modal>

      {showMorningSuccess && (
        <MorningSuccessModal
          visible={showMorningSuccess}
          onConfirm={() => setShowMorningSuccess(false)}
          description={morningGreeting}
          points={morningPoints}
        />
      )}
    </>
  );
}
