import React from 'react';

const SentenceSkeleton: React.FC = () => {
  return (
    <div className="bg-sky-50/30 border border-sky-200/30 rounded-xl p-6 my-6 min-h-[280px] flex flex-col justify-center items-center animate-pulse">
      <div className="h-8 bg-slate-300 rounded w-3/4 mb-6"></div>
      <div className="h-6 bg-slate-300 rounded w-full mb-4"></div>
      <div className="h-5 bg-slate-300 rounded w-5/6 mb-6"></div>
      <div className="flex space-x-2">
        <div className="h-4 bg-slate-300 rounded w-20"></div>
        <div className="h-4 bg-slate-300 rounded w-24"></div>
      </div>
    </div>
  );
};

export default SentenceSkeleton;