import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import tw from '@/shared/lib/tailwind';
import { hanaFinanceApi } from '@/shared/api/hanaFinance';

import CatchScreen from './CatchScreen';
import ConnectionSuccessScreen from './ConnectionSuccessScreen';
import NextStageScreen from '../mission/NextStageScreen';

import ConnectionMap from './components/ConnectionMap';
import ConnectionMapOverlay from './components/ConnectionMapOverlay';
import ConnectionBottomCard from './components/ConnectionBottomCard';

import { useInstitutions } from './hooks/useInstitutions';
import { useMapLocation } from './hooks/useMapLocation';
import { useCatchDoody } from './hooks/useCatchDoody';

interface ConnectionScreenProps {
  onBackToHome?: () => void;
  onToggleNavBar?: (visible: boolean) => void;
  onGoToCollection?: () => void;
}

export default function ConnectionScreen({ onBackToHome, onToggleNavBar, onGoToCollection }: ConnectionScreenProps) {
  const [viewState, setViewState] = useState<'map' | 'catch' | 'success' | 'unlock'>('map');

  const { institutions, fetchInstitutions } = useInstitutions();
  const { location, region, handleGoToMyLocation, updateRegion } = useMapLocation(fetchInstitutions);
  const { selectedDoodyIndex, capturedReward, handleCatchDoody, executeCatch } = useCatchDoody();

  useEffect(() => {
    if (viewState === 'catch' || viewState === 'success' || viewState === 'unlock') {
      onToggleNavBar?.(false);
    } else {
      onToggleNavBar?.(true);
    }
  }, [viewState, onToggleNavBar]);

  const onStartCatch = () => setViewState('catch');
  
  const handleCatchSuccess = async () => {
    await executeCatch(institutions, location);
    setViewState('success');
  };

  const handleGoHome = () => {
    if (onBackToHome) {
      onBackToHome();
    }
  };

  const handleGoBackToMap = () => {
    setViewState('map');
  };

  const handleGoToPokedex = () => {
    onGoToCollection?.();
    setViewState('map');
  };

  if (viewState === 'catch') {
    return <CatchScreen onSuccess={handleCatchSuccess} onGoToMap={handleGoBackToMap} onGoHome={handleGoHome} doodyIndex={selectedDoodyIndex} />;
  }

  if (viewState === 'success') {
    return (
      <ConnectionSuccessScreen
        onGoHome={async () => {
          try {
            const status = await hanaFinanceApi.getUnlockStatus('CONNECTION');
            if (status.unlockable && !status.unlocked) {
              setViewState('unlock');
            } else {
              setViewState('map');
            }
          } catch (e) {
            console.error('Failed to check connection unlock status', e);
            setViewState('map');
          }
        }}
        onGoToPokedex={handleGoToPokedex}
        doodyIndex={selectedDoodyIndex}
        capturedReward={capturedReward}
      />
    );
  }

  if (viewState === 'unlock') {
    return (
      <NextStageScreen
        stageType="connection"
        onClose={() => setViewState('map')}
        onGoToStage={() => {
          setViewState('map');
        }}
      />
    );
  }

  // MAP VIEW
  return (
    <View style={[tw`flex-1 bg-[#E1EDE4]`]}>
      {/* Map Container */}
      <View style={tw`flex-1 relative overflow-hidden`}>
        <ConnectionMap
          region={region}
          institutions={institutions}
          onCatchDoody={(id, index) => handleCatchDoody(id, index, onStartCatch)}
          onRegionChangeComplete={updateRegion}
        />

        <ConnectionMapOverlay
          onSearchArea={() => {
            if (region) fetchInstitutions(region.latitude, region.longitude);
          }}
          onGoToMyLocation={handleGoToMyLocation}
        />
      </View>

      <ConnectionBottomCard onBackToHome={onBackToHome} />
    </View>
  );
}
