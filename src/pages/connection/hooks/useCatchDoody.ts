import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { collectionPinApi } from '@/shared/api/collectionPin';
import { useCollectionStore, mapDoodyIdToIndex } from '@/entities/useCollectionStore';

export function useCatchDoody() {
  const [selectedDoodyIndex, setSelectedDoodyIndex] = useState<number>(0);
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [capturedReward, setCapturedReward] = useState<number>(30);

  const handleCatchDoody = (pinId: string, doodyIndex: number, onStartCatch: () => void) => {
    setSelectedPinId(pinId);
    setSelectedDoodyIndex(doodyIndex);
    onStartCatch();
  };

  const executeCatch = async (
    institutions: any[],
    location: Location.LocationObject | null
  ) => {
    try {
      if (selectedPinId && location) {
        const pin = institutions.find((p) => p.id === selectedPinId);
        let captureResult: any = null;

        if (Platform.OS === 'web') {
          captureResult = {
            collectedDudy: [{ id: 'exploration-web', title: '탐험 두디' }],
            reward: { hanaMoney: 30 }
          };
        } else {
          const captureLat = pin ? pin.lat : location.coords.latitude;
          const captureLng = pin ? pin.lon : location.coords.longitude;

          captureResult = await collectionPinApi.captureDoody(
            selectedPinId,
            captureLat,
            captureLng
          );
        }

        if (captureResult.collectedDudy && captureResult.collectedDudy.length > 0) {
          const { unlockDoody } = useCollectionStore.getState();
          captureResult.collectedDudy.forEach((dudy: any) => {
            unlockDoody(mapDoodyIdToIndex(dudy.id));
          });

          try {
            const localHistoryStr = await AsyncStorage.getItem('local_connection_history');
            const localHistory = localHistoryStr ? JSON.parse(localHistoryStr) : [];
            
            captureResult.collectedDudy.forEach((_dudy: any) => {
              localHistory.push({
                recordId: Date.now() + Math.random(),
                recordedAt: new Date().toISOString(),
                title: pin ? `'${pin.tags?.name || '근처'}'에서 두디 발견!` : '새로운 두디 발견!',
                reward: captureResult.reward?.hanaMoney || 10
              });
            });
            await AsyncStorage.setItem('local_connection_history', JSON.stringify(localHistory));
          } catch (historyErr) {
            console.warn('Failed to save local history', historyErr);
          }
        }

        if (captureResult.reward && captureResult.reward.hanaMoney !== undefined) {
          setCapturedReward(captureResult.reward.hanaMoney);
        }
      }
    } catch (e) {
      console.error('Failed to capture doody on backend:', e);
      Alert.alert('포획 실패', '서버와 통신하는 중 오류가 발생했어.');
    }
  };

  return {
    selectedDoodyIndex,
    selectedPinId,
    capturedReward,
    handleCatchDoody,
    executeCatch
  };
}
