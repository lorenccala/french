import React from 'react';
import Button from './Button'; // Assuming this is your custom Button component
import { PlayCircleIcon, StopCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface ContinuousListeningSectionProps {
  isPlaying: boolean;
  onPlayAll: () => void;
  onStop: () => void;
  /** True if the continuous play feature should be disabled (e.g., no sentences, or parent component is loading data) */
  disabled: boolean;
  currentSentenceIndex: number;
  totalSentencesInChunk: number;
  /** Optional: True if the parent is currently loading data that affects this section (e.g., loading a new chunk) */
  isLoadingChunk?: boolean;
}

const ContinuousListeningSection: React.FC<ContinuousListeningSectionProps> = ({
  isPlaying,
  onPlayAll,
  onStop,
  disabled,
  currentSentenceIndex,
  totalSentencesInChunk,
  isLoadingChunk = false, // Default to false if not provided
}) => {
  const playAllButtonDisabled = disabled || isPlaying || isLoadingChunk;
  const stopButtonDisabled = !isPlaying || isLoadingChunk;

  return (
    <section className="p-6 bg-slate-50/80 rounded-xl shadow-lg border border-slate-200/70 animate-fade-in backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-slate-700 mb-6 pb-3 border-b border-slate-300/80 flex items-center">
        <PlayCircleIcon aria-hidden="true" className="w-7 h-7 mr-3 text-sky-600" />
        Continuous Listening
      </h2>

      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
        <Button
          onClick={onPlayAll}
          disabled={playAllButtonDisabled}
          // If your Button component has a loading state, trigger it if isLoadingChunk is true and we are not already playing.
          // This assumes `isLoadingChunk` specifically means the chunk data is loading, making "Play All" temporarily busy.
          loading={isLoadingChunk && !isPlaying}
          className="flex-1 w-full sm:w-auto" // Ensure buttons take up space nicely
          size="md"
          icon={<PlayCircleIcon aria-hidden="true" className="w-5 h-5" />}
        >
          Play All in Chunk
        </Button>
        <Button
          onClick={onStop}
          disabled={stopButtonDisabled}
          variant="destructive" // Using a more common name for "alert" or "danger" variants
          className="flex-1 w-full sm:w-auto"
          size="md"
          icon={<StopCircleIcon aria-hidden="true" className="w-5 h-5" />}
        >
          Stop Continuous Play
        </Button>
      </div>

      {isPlaying && totalSentencesInChunk > 0 && (
        <p className="mt-5 text-sm text-slate-600 text-center bg-sky-50/70 p-3 rounded-md border border-sky-200/80 shadow-sm">
          Now Playing: Sentence <span className="font-semibold text-sky-700">{currentSentenceIndex + 1}</span> of <span className="font-semibold text-sky-700">{totalSentencesInChunk}</span>
        </p>
      )}

      {/* Informational message when no sentences are available in the current chunk for continuous play */}
      {!isPlaying && totalSentencesInChunk === 0 && (
         <div className="mt-5 text-sm text-amber-800 bg-amber-50/80 p-3 rounded-md border border-amber-300/80 flex items-center justify-center shadow-sm">
           <InformationCircleIcon aria-hidden="true" className="w-5 h-5 mr-2 flex-shrink-0 text-amber-600" />
           <span>{disabled && !isLoadingChunk ? "Load or select a chunk with sentences to enable continuous play." : "No sentences in the current chunk."}</span>
         </div>
      )}
       {/* Message if chunk is loading */}
       {isLoadingChunk && !isPlaying && (
         <div className="mt-5 text-sm text-sky-800 bg-sky-50/80 p-3 rounded-md border border-sky-300/80 flex items-center justify-center shadow-sm">
           <InformationCircleIcon aria-hidden="true" className="w-5 h-5 mr-2 flex-shrink-0 text-sky-600" />
           <span>Loading sentences... Please wait.</span>
         </div>
       )}
    </section>
  );
};

export default ContinuousListeningSection;