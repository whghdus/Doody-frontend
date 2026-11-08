import { useState, useEffect, useRef, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import * as Location from 'expo-location';
import { Region } from 'react-native-maps';

export function useMapLocation(onLocationReady?: (lat: number, lon: number) => void) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const regionRef = useRef<Region | null>(null);

  const updateRegion = useCallback((newRegion: Region) => {
    regionRef.current = newRegion;
    setRegion(newRegion);
  }, []);

  const handleGoToMyLocation = useCallback(() => {
    if (location) {
      updateRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0045,
        longitudeDelta: 0.0045,
      });
      onLocationReady?.(location.coords.latitude, location.coords.longitude);
    }
  }, [location, onLocationReady, updateRegion]);

  useEffect(() => {
    (async () => {
      const fallbackLat = 37.53422;
      const fallbackLon = 126.634;
      
      const setFallback = () => {
        const fallbackRegion = {
          latitude: fallbackLat,
          longitude: fallbackLon,
          latitudeDelta: 0.0045,
          longitudeDelta: 0.0045,
        };
        updateRegion(fallbackRegion);
        onLocationReady?.(fallbackLat, fallbackLon);
      };

      if (Platform.OS === 'web') {
        setFallback();
        return;
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('위치 권한 필요', '지도 기능을 사용하려면 위치 권한이 필요합니다.');
        setFallback();
        return;
      }

      try {
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
        const initialRegion = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.0045,
          longitudeDelta: 0.0045,
        };
        updateRegion(initialRegion);
        onLocationReady?.(loc.coords.latitude, loc.coords.longitude);
      } catch (error) {
        console.error("Location error:", error);
        setFallback();
      }
    })();
  }, [onLocationReady, updateRegion]);

  return { location, region, regionRef, handleGoToMyLocation, updateRegion };
}
