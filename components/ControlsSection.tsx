import React from 'react';
import { StudyMode } from '../types';
import { MIN_CHUNK_SIZE, MAX_CHUNK_SIZE } from '../constants';
import Button from './Button';
import Select from './Select';
import Input from './Input';
import { ListBulletIcon, BookOpenIcon, HashtagIcon, CheckCircleIcon } from '@heroicons/react/24/outline'; // Using Heroicons

interface ControlsSectionProps {
  studyMode: StudyMode;
  onStudyModeChange: (mode: StudyMode) => void;
  chunkSize: number;
  onChunkSizeChange: (size: number) => void;
  selectedChunkNum: number;
  onSelectedChunkNumChange: (chunkNum: number) => void;
  numChunks: number;
  onLoadChunk: () => void;
  allSentencesCount: number;
  isLoading: boolean;
}

const ControlsSection: React.FC<ControlsSectionProps> = ({
  studyMode,
  onStudyModeChange,
  chunkSize,
  onChunkSizeChange,
  selectedChunkNum,
  onSelectedChunkNumChange,
  numChunks,
  onLoadChunk,
  allSentencesCount,
  isLoading
}) => {
  const studyModeOptions = [
    { value: StudyMode.ReadListen, label: 'Read While Listen' },
    { value: StudyMode.ActiveRecall, label: 'Active Recall' },
  ];

  const chunkOptions = Array.from({ length: numChunks }, (_, i) => {
    const startNum = i * chunkSize + 1;
    const endNum = Math.min((i + 1) * chunkSize, allSentencesCount);
    return { value: i, label: `Chunk ${i + 1} (${startNum}-${endNum})` };
  });
  
  return (
    <section className="p-6 bg-white rounded-xl shadow-lg border border-slate-200/80 animate-fade-in">
      <h2 className="text-xl font-semibold text-slate-700 mb-6 pb-3 border-b border-slate-200/80 flex items-center">
        <ListBulletIcon className="w-6 h-6 mr-2 text-sky-600" />
        Controls
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5 items-end">
        <Select
          label="Mode:"
          id="mode"
          options={studyModeOptions}
          value={studyMode}
          onChange={(e) => onStudyModeChange(e.target.value as StudyMode)}
          icon={<BookOpenIcon className="w-5 h-5" />}
        />
        <Input
          label="Sentences per chunk:"
          id="chunkSize"
          type="number"
          value={chunkSize}
          min={MIN_CHUNK_SIZE}
          max={MAX_CHUNK_SIZE} // Consider setting a practical max
          onChange={(e) => onChunkSizeChange(parseInt(e.target.value, 10))}
          icon={<HashtagIcon className="w-5 h-5" />}
        />
        <Select
          label="Chunk:"
          id="currentChunk"
          options={numChunks > 0 && allSentencesCount > 0 ? chunkOptions : [{value: -1, label: "N/A"}]}
          value={selectedChunkNum}
          onChange={(e) => onSelectedChunkNumChange(parseInt(e.target.value, 10))}
          disabled={numChunks === 0 || allSentencesCount === 0}
          icon={<ListBulletIcon className="w-5 h-5" />}
        />
        <Button 
          onClick={onLoadChunk} 
          disabled={numChunks === 0 || allSentencesCount === 0 || isLoading} 
          loading={isLoading}
          className="w-full md:w-auto lg:mt-0 mt-4" 
          size="md"
          icon={<CheckCircleIcon className="w-5 h-5" />}
        >
          {isLoading ? 'Loading...' : 'Load Chunk'}
        </Button>
      </div>
      {allSentencesCount === 0 && !isLoading && (
        <p className="text-sm text-amber-600 mt-4 text-center">No sentence data available. Please check the data source.</p>
      )}
    </section>
  );
};

export default ControlsSection;