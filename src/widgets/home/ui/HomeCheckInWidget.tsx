import React, { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkInApi } from '@/shared/api/checkIn';
import { reportApi } from '@/shared/api/report';
import { useCollectionStore } from '@/entities/useCollectionStore';
import MorningCheckInScreen from '@/pages/home/MorningCheckInScreen';
import NightCheckInScreen from '@/pages/home/NightCheckInScreen';
import MorningSuccessModal from '@/features/checkIn/ui/MorningSuccessModal';

interface HomeCheckInWidgetProps {
  homeMode: 'default' | 'completed' | 'resting';
  onPointsEarned: () => void;
}

export default function HomeCheckInWidget({ homeMode, onPointsEarned }: HomeCheckInWidgetProps) {
  const [hasCheckedInMorning, setHasCheckedInMorning] = useState<boolean>(true);
  const [showMorningSuccess, setShowMorningSuccess] = useState<boolean>(false);
  const [morningPoints, setMorningPoints] = useState<number>(20);
  const [morningGreeting, setMorningGreeting] = useState<string>("와준 게 오늘 제일 큰 일이야.\n그것만으로 오늘 첫 단추는 끼웠어.");
  const [showNightCheckIn, setShowNightCheckIn] = useState<boolean>(false);

  useEffect(() => {
    const checkCheckInStatus = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const localMorning = await AsyncStorage.getItem('morning_checkin_date');
        const localNight = await AsyncStorage.getItem('night_checkin_date');
        
        let hasMorning = localMorning === today;
        let hasNight = localNight === today;

        if (!hasMorning || !hasNight) {
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
        const now = new Date();
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
  }, [homeMode]);

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
          if (dudy.id === 'd_rhythm_common' || dudy.axis === 'rhythm') unlockDoody(4);
          else if (dudy.axis === 'autonomy') unlockDoody(6);
          else if (dudy.axis === 'connection') unlockDoody(5);
        });
      }
      const today = new Date().toISOString().split('T')[0];
      await AsyncStorage.setItem('morning_checkin_date', today);
    } catch (error) {
      console.error('Failed morning check-in', error);
    }
    setHasCheckedInMorning(true);
    setShowMorningSuccess(true);
    onPointsEarned();
  }, [onPointsEarned]);

  return (
    <>
      {!hasCheckedInMorning && (
        <MorningCheckInScreen 
          onClose={() => setHasCheckedInMorning(true)}
          onComplete={handleCompleteMorning} 
        />
      )}
      
      {showNightCheckIn && (
        <NightCheckInScreen onClose={() => setShowNightCheckIn(false)} />
      )}

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
