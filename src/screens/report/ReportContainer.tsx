// src/screens/report/ReportContainer.tsx
import React, { useState } from 'react';
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

  React.useEffect(() => {
    setViewState(initialView);
  }, [initialView]);

  // When 'Back' is pressed, handle state based on current view
  const handleBack = () => {
    if (viewState === 'detail') {
      // Go back to the screen we came from (collection or main)
      // If we clicked from collection, going back to collection makes sense.
      // For simplicity, we can assume if selectedDoodyId starts with 'preview', we go back to main, else collection.
      if (selectedDoodyId?.startsWith('preview_')) {
        setViewState('main');
      } else {
        setViewState('collection');
      }
      setSelectedDoodyId(null);
    } else if (viewState === 'collection') {
      setViewState('main');
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
      onGoCollection={() => setViewState('collection')}
      onDoodyClick={handleDoodyClick}
    />
  );
}
