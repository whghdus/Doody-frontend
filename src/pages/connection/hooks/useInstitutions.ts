import { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import { collectionPinApi } from '@/shared/api/collectionPin';
import { mapDoodyIdToIndex } from '@/entities/useCollectionStore';
import type { Institution } from '../model';

export function useInstitutions() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);

  const fetchInstitutions = useCallback(async (lat: number, lon: number) => {
    if (Platform.OS === 'web') {
      setInstitutions([{
        id: 'hana-hq-web',
        lat: lat, // Place it right at the center of the web fallback
        lon: lon,
        tags: {
          name: '하나금융그룹 청라 본점'
        },
        doodyIndex: 5, // Exploration doody
        captureAvailable: true
      }]);
      return;
    }

    const RANDOM_NAMES = ['하나은행', '우체국', '자립지원센터', '공공센터'];

    try {
      const pins = await collectionPinApi.getNearbyPins(lat, lon, 500);
      console.log(`📌 Initial pins from backend at ${lat}, ${lon}:`, pins.length);
      if (pins.length > 0) {
        console.log(`📌 Doody IDs returned:`, pins.map(p => p.doodyId).join(', '));
      }

      const mapped = pins.map((pin): Institution => {
        return {
          id: pin.pinId,
          lat: pin.lat,
          lon: pin.lng,
          tags: {
            name: (!pin.title || pin.title.includes('발견 지점') || pin.title.includes('두디'))
              ? RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)]
              : pin.title
          },
          doodyIndex: mapDoodyIdToIndex(pin.doodyId),
          captureAvailable: pin.captureAvailable
        };
      });

      console.log(`Setting institutions with ${mapped.length} real pins.`);
      setInstitutions(mapped);
    } catch (e) {
      console.error('Failed to fetch nearby pins from backend:', e);
      setInstitutions([]);
    }
  }, []);

  return { institutions, fetchInstitutions };
}
