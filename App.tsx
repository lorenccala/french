import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sentence, StudyMode } from './types';
import { PLAYBACK_SPEEDS, DEFAULT_CHUNK_SIZE, MIN_CHUNK_SIZE, MAX_CHUNK_SIZE, DEFAULT_PRACTICE_TIME_MINUTES } from './constants';
import { useTimer } from './hooks/useTimer';
import Header from './components/Header';
import ControlsSection from './components/ControlsSection';
import StudyArea from './components/StudyArea';
import ContinuousListeningSection from './components/ContinuousListeningSection';
import NativeContentSwitchSection from './components/NativeContentSwitchSection';
import Footer from './components/Footer';
import { LoadingSpinner } from './components/LoadingSpinner';
import Notification from './components/Notification';

const App: React.FC = () => {
  const [allSentences, setAllSentences] = useState<Sentence[]>([]);
  const [currentChunkSentences, setCurrentChunkSentences] = useState<Sentence[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);

  const [studyMode, setStudyMode] = useState<StudyMode>(StudyMode.ReadListen);
  const [chunkSize, setChunkSize] = useState<number>(DEFAULT_CHUNK_SIZE);
  const [selectedChunkNum, setSelectedChunkNum] = useState<number>(0);
  const [numChunks, setNumChunks] = useState<number>(0);

  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isChunkLoading, setIsChunkLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentAudioSrcType, setCurrentAudioSrcType] = useState<'fr' | 'en' | null>(null);

  // Initialize based on study mode
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(studyMode !== StudyMode.ActiveRecall);

  const [isContinuousPlaying, setIsContinuousPlaying] = useState<boolean>(false);
  const continuousPlayCurrentIndexRef = useRef<number>(0);

  const {
    timerSeconds,
    isTimerRunning,
    showSwitchToNativeAlert,
    practiceTimeMinutes,
    setPracticeTimeMinutes,
    startTimer,
    formatTime,
    resetTimerAlert
  } = useTimer(DEFAULT_PRACTICE_TIME_MINUTES);

  const currentSentenceIndexRef = useRef(currentSentenceIndex);
  const currentChunkSentencesRef = useRef(currentChunkSentences);
  const playbackSpeedRef = useRef(playbackSpeed);
  const currentAudioSrcTypeRef = useRef(currentAudioSrcType);
  const isAudioPlayingRef = useRef(isAudioPlaying);
  const isContinuousPlayingRef = useRef(isContinuousPlaying);
  const isLoopingRef = useRef(isLooping);

  const enPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleSequenceEndLogicRef = useRef<(() => void) | null>(null);
  const playRequestCounterRef = useRef<number>(0);

  useEffect(() => { currentSentenceIndexRef.current = currentSentenceIndex; }, [currentSentenceIndex]);
  useEffect(() => { currentChunkSentencesRef.current = currentChunkSentences; }, [currentChunkSentences]);
  useEffect(() => { playbackSpeedRef.current = playbackSpeed; }, [playbackSpeed]);
  useEffect(() => { currentAudioSrcTypeRef.current = currentAudioSrcType; }, [currentAudioSrcType]);
  useEffect(() => { isAudioPlayingRef.current = isAudioPlaying; }, [isAudioPlaying]);
  useEffect(() => { isContinuousPlayingRef.current = isContinuousPlaying; }, [isContinuousPlaying]);
  useEffect(() => { isLoopingRef.current = isLooping; }, [isLooping]);

  // Handle study mode changes
  useEffect(() => {
    if (studyMode === StudyMode.ActiveRecall) {
      setIsAnswerRevealed(false);
    } else {
      setIsAnswerRevealed(true);
    }
  }, [studyMode]);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const loadSentenceData = useCallback(async () => {
    setIsInitialLoading(true);
    setError(null);
    try {
      const response = await fetch('/data/data.json');
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) throw new Error("No sentences found or data is not in expected format.");
      setAllSentences(data as Sentence[]);
      showNotification("Sentence data loaded successfully!");
    } catch (err) {
      console.error('Error loading sentence data:', err);
      setError(err instanceof Error ? err.message : String(err));
      setAllSentences([]);
    } finally {
      setIsInitialLoading(false);
    }
  }, []);

  useEffect(() => { loadSentenceData(); }, [loadSentenceData]);

  useEffect(() => {
    if (allSentences.length > 0) {
      const newNumChunks = Math.ceil(allSentences.length / chunkSize);
      setNumChunks(newNumChunks);
      if (selectedChunkNum >= newNumChunks && newNumChunks > 0) setSelectedChunkNum(newNumChunks - 1);
      else if (newNumChunks === 0) setSelectedChunkNum(0);
    } else {
      setNumChunks(0);
    }
  }, [allSentences, chunkSize, selectedChunkNum]);

  const stopAudio = useCallback(() => {
    console.log(`[stopAudio] called`);
    if (audioRef.current) {
      console.log(`[stopAudio] pausing audio`);
      audioRef.current.pause();
    }
    if (enPlayTimeoutRef.current) {
      console.log(`[stopAudio] clearing enPlayTimeout`);
      clearTimeout(enPlayTimeoutRef.current);
      enPlayTimeoutRef.current = null;
    }
    setIsAudioPlaying(false);
    setCurrentAudioSrcType(null);
  }, []);

  const stopContinuousPlay = useCallback(() => {
    setIsContinuousPlaying(false);
    isContinuousPlayingRef.current = false;
    stopAudio();
    continuousPlayCurrentIndexRef.current = 0;
    showNotification("Continuous play stopped.");
  }, [stopAudio]);

  const applyChunkSettings = useCallback(() => {
    if (allSentences.length === 0) {
      setCurrentChunkSentences([]);
      setCurrentSentenceIndex(0);
      return;
    }
    setIsChunkLoading(true);

    if (isContinuousPlayingRef.current) {
      stopContinuousPlay();
    } else {
      stopAudio();
    }

    setTimeout(() => {
      const startIndex = selectedChunkNum * chunkSize;
      const endIndex = Math.min(startIndex + chunkSize, allSentences.length);
      setCurrentChunkSentences(allSentences.slice(startIndex, endIndex));
      setCurrentSentenceIndex(0);
      
      // Set based on current study mode
      setIsAnswerRevealed(studyMode !== StudyMode.ActiveRecall);
      
      setIsChunkLoading(false);
      if (allSentences.slice(startIndex, endIndex).length > 0) showNotification(`Chunk ${selectedChunkNum + 1} loaded!`);
      else showNotification(`Chunk ${selectedChunkNum + 1} is empty or could not be loaded.`);
    }, 200);
  }, [allSentences, selectedChunkNum, chunkSize, studyMode, stopAudio, stopContinuousPlay]);

  useEffect(() => { if (!isInitialLoading) applyChunkSettings(); }, [applyChunkSettings, isInitialLoading]);

  const playAudioSequence = useCallback(async (
    sentenceToPlay?: Sentence,
    isPartOfContinuousSequence: boolean = false
  ) => {
    const currentPlayId = ++playRequestCounterRef.current;
    console.log(`[PlayId ${currentPlayId}] playAudioSequence started. Continuous: ${isPartOfContinuousSequence}`);

    if (isPartOfContinuousSequence && !isContinuousPlayingRef.current) {
      console.log(`[PlayId ${currentPlayId}] Aborted: Continuous play stopped`);
      return;
    }

    const sentence = sentenceToPlay || currentChunkSentencesRef.current[currentSentenceIndexRef.current];
    const audioElement = audioRef.current;

    if (!audioElement) {
      console.error(`[PlayId ${currentPlayId}] Aborted: audioRef is null`);
      return;
    }

    if (!sentence) {
      console.warn(`[PlayId ${currentPlayId}] No sentence data`);
      if (isPartOfContinuousSequence && isContinuousPlayingRef.current) {
        setTimeout(() => handleSequenceEndLogicRef.current?.(), 50);
      }
      return;
    }

    const hasAudio = sentence.audioSrcFr || sentence.audioSrcEn;
    if (!hasAudio) {
      console.warn(`[PlayId ${currentPlayId}] No audio for sentence ID: ${sentence.id}`);
      if (isPartOfContinuousSequence && isContinuousPlayingRef.current) {
        setTimeout(() => handleSequenceEndLogicRef.current?.(), 50);
      }
      return;
    }

    stopAudio();

    const playPart = async (src: string, type: 'fr' | 'en'): Promise<boolean> => {
      if (playRequestCounterRef.current !== currentPlayId) {
        console.log(`[PlayId ${currentPlayId}] playPart aborted: Obsolete`);
        return false;
      }

      try {
        console.log(`[PlayId ${currentPlayId}] Loading ${type} audio: ${src}`);
        audioElement.src = src;
        audioElement.load();
        audioElement.playbackRate = playbackSpeedRef.current;

        console.log(`[PlayId ${currentPlayId}] Playing ${type} audio`);
        await audioElement.play();
        
        if (playRequestCounterRef.current === currentPlayId) {
          setIsAudioPlaying(true);
          setCurrentAudioSrcType(type);
          return true;
        }
      } catch (err) {
        console.error(`[PlayId ${currentPlayId}] Error playing ${type} audio:`, err);
      }
      return false;
    };

    if (sentence.audioSrcFr) {
      await playPart(sentence.audioSrcFr, 'fr');
    } 
    else if (sentence.audioSrcEn) {
      await playPart(sentence.audioSrcEn, 'en');
    }
  }, [stopAudio]);

  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;

    const handleSequenceEndLogicInternal = () => {
      const currentGlobalPlayId = playRequestCounterRef.current;
      
      if (isLoopingRef.current && !isContinuousPlayingRef.current) {
        setTimeout(() => {
          if (playRequestCounterRef.current === currentGlobalPlayId) {
            playAudioSequence();
          }
        }, 200);
      }
      else if (isContinuousPlayingRef.current) {
        const nextIndex = continuousPlayCurrentIndexRef.current + 1;
        
        if (nextIndex < currentChunkSentencesRef.current.length) {
          setCurrentSentenceIndex(nextIndex);
          continuousPlayCurrentIndexRef.current = nextIndex;
          
          setTimeout(() => {
            if (playRequestCounterRef.current === currentGlobalPlayId) {
              playAudioSequence(
                currentChunkSentencesRef.current[nextIndex],
                true
              );
            }
          }, 200);
        } else {
          stopContinuousPlay();
        }
      }
    };
    
    handleSequenceEndLogicRef.current = handleSequenceEndLogicInternal;

    const handleAudioEnded = () => {
      const endedPlayId = playRequestCounterRef.current;
      const currentType = currentAudioSrcTypeRef.current;

      console.log(`[PlayId ${endedPlayId}] Audio ended: ${currentType}`);

      if (currentType === 'fr') {
        enPlayTimeoutRef.current = setTimeout(async () => {
          if (
            playRequestCounterRef.current !== endedPlayId ||
            currentAudioSrcTypeRef.current !== 'fr'
          ) {
            console.log(`English playback skipped - state changed`);
            handleSequenceEndLogicRef.current?.();
            return;
          }

          const sentence = currentChunkSentencesRef.current[currentSentenceIndexRef.current];
          if (sentence?.audioSrcEn) {
            try {
              console.log(`Playing English after French`);
              audio.src = sentence.audioSrcEn;
              audio.load();
              audio.playbackRate = playbackSpeedRef.current;
              await audio.play();
              
              if (playRequestCounterRef.current === endedPlayId) {
                setIsAudioPlaying(true);
                setCurrentAudioSrcType('en');
              }
            } catch (err) {
              console.error(`English playback failed:`, err);
              handleSequenceEndLogicRef.current?.();
            }
          } else {
            handleSequenceEndLogicRef.current?.();
          }
        }, 500);
      }
      else if (currentType === 'en') {
        setIsAudioPlaying(false);
        setCurrentAudioSrcType(null);
        handleSequenceEndLogicRef.current?.();
      }
    };

    audio.addEventListener('ended', handleAudioEnded);
    audio.addEventListener('error', (e) => {
      console.error('Audio error:', e, audio.error);
      showNotification(`Audio error: ${audio.error?.message || 'Unknown error'}`);
      stopAudio();
    });

    return () => {
      audio.removeEventListener('ended', handleAudioEnded);
      if (enPlayTimeoutRef.current) clearTimeout(enPlayTimeoutRef.current);
      stopAudio();
    };
  }, [playAudioSequence, stopAudio, stopContinuousPlay]);

  const togglePlayPause = useCallback(() => {
    if (isAudioPlayingRef.current) stopAudio();
    else playAudioSequence();
  }, [playAudioSequence, stopAudio]);

  const handlePrevSentence = () => {
    if (currentSentenceIndexRef.current > 0) {
      stopAudio();
      const newIndex = currentSentenceIndexRef.current - 1;
      setCurrentSentenceIndex(newIndex);
      if (isContinuousPlayingRef.current) continuousPlayCurrentIndexRef.current = newIndex;
      
      // Reset answer reveal for active recall
      if (studyMode === StudyMode.ActiveRecall && !isContinuousPlaying) {
        setIsAnswerRevealed(false);
      }
    }
  };

  const handleNextSentence = () => {
    if (currentSentenceIndexRef.current < currentChunkSentencesRef.current.length - 1) {
      stopAudio();
      const newIndex = currentSentenceIndexRef.current + 1;
      setCurrentSentenceIndex(newIndex);
      if (isContinuousPlayingRef.current) continuousPlayCurrentIndexRef.current = newIndex;
      
      // Reset answer reveal for active recall
      if (studyMode === StudyMode.ActiveRecall && !isContinuousPlaying) {
        setIsAnswerRevealed(false);
      }
    }
  };

  // Reset answer when sentence changes in active recall mode
  useEffect(() => {
    if (studyMode === StudyMode.ActiveRecall && !isContinuousPlaying) {
      setIsAnswerRevealed(false);
    }
  }, [currentSentenceIndex, studyMode, isContinuousPlaying]);

  const handleRevealAnswer = () => {
    setIsAnswerRevealed(true);
    const sentence = currentChunkSentencesRef.current[currentSentenceIndexRef.current];
    // Only play audio if not already playing
    if (!isAudioPlayingRef.current && sentence && (sentence.audioSrcFr || sentence.audioSrcEn)) {
      playAudioSequence();
    }
  };

  const handlePlayAllChunkAudio = () => {
    if (currentChunkSentencesRef.current.length > 0) {
      stopAudio();
      setIsContinuousPlaying(true);
      isContinuousPlayingRef.current = true;
      continuousPlayCurrentIndexRef.current = 0;
      setCurrentSentenceIndex(0);
      
      // Always reveal answers during continuous play
      setIsAnswerRevealed(true);
      
      setTimeout(() => playAudioSequence(currentChunkSentencesRef.current[0], true), 100);
      showNotification("Starting continuous play for the chunk.");
    }
  };

  const currentSentenceData = currentChunkSentences[currentSentenceIndex];

  if (isInitialLoading) return <div className="flex justify-center items-center min-h-screen bg-slate-100"><LoadingSpinner /></div>;

  if (error && allSentences.length === 0) {
    return <div className="flex flex-col justify-center items-center min-h-screen bg-slate-100 text-red-600 p-8">
      <h1 className="text-2xl font-bold mb-4">Error Loading Application Data</h1>
      <p className="text-center">{error}</p>
      <button onClick={loadSentenceData} className="mt-6 px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700">
        Try Reloading Data
      </button>
    </div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 p-4 sm:p-6 lg:p-8 font-sans">
      {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
      <div className="w-full max-w-5xl bg-white/90 backdrop-blur-md shadow-xl rounded-xl p-6 sm:p-8 md:p-10 ring-1 ring-slate-200">
        <Header />
        <main className="mt-8 space-y-10 md:space-y-12">
          <ControlsSection
            studyMode={studyMode}
            onStudyModeChange={(newMode) => { 
              setStudyMode(newMode); 
              stopAudio();
              // Update answer visibility based on new mode
              if (newMode === StudyMode.ActiveRecall) {
                setIsAnswerRevealed(false);
              } else {
                setIsAnswerRevealed(true);
              }
            }}
            chunkSize={chunkSize}
            onChunkSizeChange={(val) => { setChunkSize(Math.max(MIN_CHUNK_SIZE, Math.min(MAX_CHUNK_SIZE, val))); }}
            selectedChunkNum={selectedChunkNum}
            onSelectedChunkNumChange={setSelectedChunkNum}
            numChunks={numChunks}
            onLoadChunk={applyChunkSettings}
            allSentencesCount={allSentences.length}
            isLoading={isChunkLoading}
          />
          <StudyArea
            sentence={currentSentenceData}
            studyMode={studyMode}
            isAnswerRevealed={isAnswerRevealed}
            onRevealAnswer={handleRevealAnswer}
            audioControls={{
              isPlaying: isAudioPlaying,
              onTogglePlayPause: togglePlayPause,
              onPrev: handlePrevSentence,
              onNext: handleNextSentence,
              isLooping: isLooping,
              onToggleLoop: () => setIsLooping(prev => !prev),
              playbackSpeed: playbackSpeed,
              onPlaybackSpeedChange: (speed) => {
                setPlaybackSpeed(speed);
                if (audioRef.current) audioRef.current.playbackRate = speed;
              },
              disablePrev: currentSentenceIndex === 0 && !isContinuousPlayingRef.current,
              disableNext: currentSentenceIndex === currentChunkSentences.length - 1 && !isContinuousPlayingRef.current,
            }}
            sentenceCounter={{
              currentNum: currentChunkSentences.length > 0 ? currentSentenceIndex + 1 : 0,
              totalInChunk: currentChunkSentences.length,
              totalAll: allSentences.length,
            }}
            isLoading={isChunkLoading || (isInitialLoading && allSentences.length === 0)}
            allSentencesCount={allSentences.length}
          />
          <ContinuousListeningSection
            isPlaying={isContinuousPlaying}
            onPlayAll={handlePlayAllChunkAudio}
            onStop={stopContinuousPlay}
            disabled={currentChunkSentences.length === 0 && !isChunkLoading && !isInitialLoading}
            currentSentenceIndex={isContinuousPlaying ? continuousPlayCurrentIndexRef.current : -1}
            totalSentencesInChunk={currentChunkSentences.length}
            isLoadingChunk={isChunkLoading || isInitialLoading}
          />
          <NativeContentSwitchSection
            practiceTimeMinutes={practiceTimeMinutes}
            onPracticeTimeChange={setPracticeTimeMinutes}
            onStartTimer={startTimer}
            timerDisplay={formatTime(timerSeconds)}
            isTimerRunning={isTimerRunning}
            showSwitchToNativeAlert={showSwitchToNativeAlert}
            onHideAlert={resetTimerAlert}
          />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;