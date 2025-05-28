import React from 'react';
import { Sentence, StudyMode } from '../types';
import Button from './Button';
import SentenceDisplay from './study_area/SentenceDisplay';
import AudioControls from './study_area/AudioControls';
import SentenceCounter from './study_area/SentenceCounter';
import SentenceSkeleton from './study_area/SentenceSkeleton'; // New
import { PresentationChartLineIcon } from '@heroicons/react/24/outline';

interface StudyAreaProps {
  sentence: Sentence | undefined; // Can be undefined if no chunk loaded
  studyMode: StudyMode;
  isAnswerRevealed: boolean;
  onRevealAnswer: () => void;
  audioControls: {
    isPlaying: boolean;
    onTogglePlayPause: () => void;
    onPrev: () => void;
    onNext: () => void;
    isLooping: boolean;
    onToggleLoop: () => void;
    playbackSpeed: number;
    onPlaybackSpeedChange: (speed: number) => void;
    disablePrev: boolean;
    disableNext: boolean;
  };
  sentenceCounter: {
    currentNum: number;
    totalInChunk: number;
    totalAll: number;
  };
  isLoading: boolean; // For chunk loading
  allSentencesCount: number; // Total sentences in dataset
}

const StudyArea: React.FC<StudyAreaProps> = ({
  sentence,
  studyMode,
  isAnswerRevealed,
  onRevealAnswer,
  audioControls,
  sentenceCounter,
  isLoading,
  allSentencesCount
}) => {

  const renderContent = () => {
    if (isLoading) {
      return <SentenceSkeleton />;
    }

    if (!sentence && allSentencesCount > 0) {
      return (
        <div className="text-center py-16 text-slate-500 bg-slate-50/50 rounded-xl shadow-inner border border-slate-200/70">
          <PresentationChartLineIcon className="w-16 h-16 mx-auto text-slate-400 mb-4" />
          <p className="text-lg font-medium">No sentence to display.</p>
          <p className="text-sm">Please load a chunk from the controls above to begin your study session.</p>
        </div>
      );
    }
    
    if (!sentence && allSentencesCount === 0) {
         return (
            <div className="text-center py-16 text-slate-500 bg-slate-50/50 rounded-xl shadow-inner border border-slate-200/70">
                <PresentationChartLineIcon className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                <p className="text-lg font-medium">No sentences loaded.</p>
                <p className="text-sm">Check the data source or try reloading the application data.</p>
            </div>
         );
    }


    if (sentence) {
      return (
        <>
          <SentenceDisplay
            sentence={sentence}
            studyMode={studyMode}
            isAnswerRevealed={isAnswerRevealed}
          />

          {studyMode === StudyMode.ActiveRecall && !isAnswerRevealed && (
            <div className="my-6 text-center animate-fade-in">
              <Button onClick={onRevealAnswer} variant="secondary" size="lg" className="max-w-sm mx-auto shadow-md hover:shadow-lg">
                Reveal Answer & Play Audio
              </Button>
            </div>
          )}

          <AudioControls {...audioControls} />
          <SentenceCounter {...sentenceCounter} />
        </>
      );
    }
    return null; // Should not reach here if logic is correct
  };

  return (
    <section className="p-6 bg-white rounded-xl shadow-lg border border-slate-200/80 animate-fade-in">
      <h2 className="text-xl sm:text-2xl font-semibold text-sky-700 mb-6 pb-3 border-b-2 border-teal-400/80 flex items-center">
         <PresentationChartLineIcon className="w-7 h-7 mr-2 text-sky-600" />
        Study Area
      </h2>
      {renderContent()}
    </section>
  );
};

export default StudyArea;
