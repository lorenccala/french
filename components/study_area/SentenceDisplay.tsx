import React from 'react';
import { Sentence, StudyMode } from '../../types';

interface SentenceDisplayProps {
  sentence: Sentence;
  studyMode: StudyMode;
  isAnswerRevealed: boolean;
}

const SentenceDisplay: React.FC<SentenceDisplayProps> = ({ sentence, studyMode, isAnswerRevealed }) => {
  const showTarget = studyMode === StudyMode.ReadListen || isAnswerRevealed;
  const showAlbanian = studyMode === StudyMode.ReadListen || isAnswerRevealed;
  const showVerb = studyMode === StudyMode.ReadListen || isAnswerRevealed;

  const targetSentenceClasses = `text-2xl sm:text-3xl font-semibold text-sky-700 mb-4 leading-tight transition-opacity duration-500 ease-in-out ${showTarget ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`;
  const albanianSentenceClasses = `text-md text-slate-500 opacity-90 mb-4 leading-relaxed transition-opacity duration-500 ease-in-out ${showAlbanian ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`;
  const verbClasses = `mt-3 transition-opacity duration-500 ease-in-out ${showVerb ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`;
  
  return (
    <div className="bg-sky-50/60 border border-sky-200/70 rounded-xl p-6 my-6 text-center min-h-[280px] flex flex-col justify-center items-center transition-all duration-300 ease-in-out shadow-inner animate-fade-in">
      {showTarget ? (
        <p className={targetSentenceClasses}>
          {sentence.targetSentence || "Loading sentence..."}
        </p>
      ) : (
        <div className="h-[calc(1.5em*2+1rem)]"> {/* Placeholder height for target sentence */} </div>
      )}

      <p className="text-lg text-slate-600 mb-3 leading-relaxed">
        {sentence.englishSentence}
      </p>

      {showAlbanian && sentence.albanianSentence ? (
        <p className={albanianSentenceClasses}>
          {sentence.albanianSentence}
        </p>
      ) : (
         !showAlbanian && <div className="h-[calc(1.25em*1+1rem)]"> {/* Placeholder height for albanian sentence */} </div>
      )}
      
      {showVerb && sentence.verb && (
        <div className={verbClasses}>
          <span className="text-sm font-medium text-rose-700 bg-rose-100/80 px-3 py-1.5 rounded-md inline-block shadow-sm border border-rose-200">
            Verb: {sentence.verb}
          </span>
          {sentence.verbEnglish && <p className="text-xs text-slate-500 mt-1.5">English: {sentence.verbEnglish}</p>}
          {sentence.verbAlbanian && <p className="text-xs text-slate-500 mt-1">Albanian: {sentence.verbAlbanian}</p>}
        </div>
      )}
       {!showVerb && <div className="h-[calc(0.875em*3+0.5rem)]"> {/* Placeholder height for verb section */} </div>}


      {!showTarget && studyMode === StudyMode.ActiveRecall && !isAnswerRevealed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-sky-50/30 backdrop-blur-sm rounded-xl p-4">
            <p className="text-xl text-slate-500 italic font-medium">Listen and recall the French sentence.</p>
            <p className="text-sm text-slate-400 mt-1">Click "Reveal Answer" below.</p>
          </div>
      )}
    </div>
  );
};

export default SentenceDisplay;