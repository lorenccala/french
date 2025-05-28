import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      <p className="mt-4 text-lg text-slate-600">Loading...</p>
    </div>
  );
};
