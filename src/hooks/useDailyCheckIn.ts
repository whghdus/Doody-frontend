import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { reportApi } from '@/shared/api/report';

export function useDailyCheckIn(homeMode: 'default' | 'completed' | 'resting') {
  const [hasCheckedInMorning, setHasCheckedInMorning] = useState<boolean>(true);
  const [showNightCheckIn, setShowNightCheckIn] = useState<boolean>(false);

  useEffect(() => {
    const checkCheckInStatus = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        // Check local storage first
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
        console.error('Failed to verify check-in status from backend', error);
      }
    };
    
    checkCheckInStatus();
  }, [homeMode]);

  const markNightCheckInCompleted = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await AsyncStorage.setItem('night_checkin_date', today);
    } catch (e) {}
    setShowNightCheckIn(false);
  };

  return {
    hasCheckedInMorning,
    setHasCheckedInMorning,
    showNightCheckIn,
    setShowNightCheckIn,
    markNightCheckInCompleted
  };
}
