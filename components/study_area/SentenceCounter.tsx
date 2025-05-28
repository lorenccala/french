import React from 'react';
import { HashtagIcon } from '@heroicons/react/24/outline';

interface SentenceCounterProps {
  currentNum: number;
  totalInChunk: number;
  totalAll: number;
}

const SentenceCounter: React.FC<SentenceCounterProps> = ({ currentNum, totalInChunk, totalAll }) => {
  if (totalInChunk === 0 && totalAll === 0) return null; // Don't show if no data

  return (
    <div className="mt-6 text-sm text-slate-600 text-center p-3 bg-slate-100/80 border border-slate-200/70 rounded-lg shadow-inner flex items-center justify-center">
      <HashtagIcon className="w-4 h-4 mr-1.5 text-slate-500" />
      Sentence <span className="font-semibold text-slate-700">{currentNum}</span> of <span className="font-semibold text-slate-700">{totalInChunk}</span>
      <span className="mx-1 text-slate-400">|</span> 
      Total in Dataset: <span className="font-semibold text-slate-700">{totalAll}</span>
    </div>
  );
};

export default SentenceCounter;