import React, { useState, useCallback } from 'react';
import { useFocusEffect, useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import ReportScreen from './ReportScreen';
import DoodyCollectionScreen from './DoodyCollectionScreen';
import DoodyDetailScreen from './DoodyDetailScreen';

export type ViewState = 'main' | 'collection' | 'detail';

interface ReportContainerProps {
  onBackToHome: () => void;
  initialView?: ViewState;
}

export default function ReportContainer({ onBackToHome, initialView = 'main' }: ReportContainerProps) {
  const [viewState, setViewState] = useState<ViewState>(initialView);
  const [selectedDoodyId, setSelectedDoodyId] = useState<string | null>(null);
  const route = useRoute<RouteProp<Record<string, { initialView?: ViewState }>, string>>();

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      if (route.params?.initialView) {
        setViewState(route.params.initialView);
        // Clear the param so subsequent tab clicks default back to main
        (navigation as any).setParams({ initialView: undefined });
      } else {
        // If navigated to the tab normally without params, always show the main report screen
        setViewState('main');
      }
    }, [route.params?.initialView, navigation])
  );

  // When 'Back' is pressed, handle state based on current view
  const handleBack = () => {
    if (viewState === 'detail') {
      // Go back to the screen we came from. Since collection is now completely isolated,
      // any detail viewed is assumed to be from collection.
      setViewState('collection');
      setSelectedDoodyId(null);
    } else if (viewState === 'collection') {
      // Collection is only accessed from Home or external buttons, not from Report main.
      // So going back from Collection should exit to Home.
      onBackToHome();
    } else {
      // In 'main' view, back goes to HomeScreen's home tab
      onBackToHome();
    }
  };

  const handleDoodyClick = (id: string) => {
    setSelectedDoodyId(id);
    setViewState('detail');
  };

  if (viewState === 'detail' && selectedDoodyId) {
    return (
      <DoodyDetailScreen
        doodyId={selectedDoodyId}
        onBack={handleBack}
      />
    );
  }

  if (viewState === 'collection') {
    return (
      <DoodyCollectionScreen
        onBack={handleBack}
        onDoodyClick={handleDoodyClick}
      />
    );
  }

  return (
    <ReportScreen
      onBack={handleBack}
      onDoodyClick={handleDoodyClick}
    />
  );
}
