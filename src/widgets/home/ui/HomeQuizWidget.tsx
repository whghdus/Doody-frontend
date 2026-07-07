import React, { useState } from 'react';
import DoodyChatInputModal from '@/features/checkIn/ui/DoodyChatInputModal';
import DoodyQuizModal from '@/features/checkIn/ui/DoodyQuizModal';

interface HomeQuizWidgetProps {
  onQuizCompleteAction: () => void;
}

export default function HomeQuizWidget({ onQuizCompleteAction }: HomeQuizWidgetProps) {
  const [showQuizChat, setShowQuizChat] = useState<boolean>(false);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [showQuizReward, setShowQuizReward] = useState<boolean>(false);
  const [quizIsCorrect, setQuizIsCorrect] = useState<boolean>(false);

  const handleQuizChatNext = (inputText: string) => {
    setShowQuizChat(false);
    setShowQuiz(true);
  };

  const handleQuizComplete = (correct: boolean) => {
    setQuizIsCorrect(correct);
    setShowQuiz(false);
    setShowQuizReward(true);
    onQuizCompleteAction();
  };

  return (
    <>
      {showQuizChat && (
        <DoodyChatInputModal
          visible={showQuizChat}
          onClose={() => setShowQuizChat(false)}
          onSubmit={handleQuizChatNext}
        />
      )}

      {showQuiz && (
        <DoodyQuizModal
          visible={showQuiz}
          onClose={() => setShowQuiz(false)}
          onComplete={handleQuizComplete}
        />
      )}
    </>
  );
}
