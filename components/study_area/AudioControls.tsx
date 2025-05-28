import React from 'react';
import { PLAYBACK_SPEEDS } from '../../constants';
import Button from '../Button';
import Select from '../Select';
import { PlayIcon, PauseIcon, BackwardIcon, ForwardIcon, ArrowPathIcon, SpeakerWaveIcon } from '@heroicons/react/24/solid';


interface AudioControlsProps {
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
}

const AudioControls: React.FC<AudioControlsProps> = ({
  isPlaying,
  onTogglePlayPause,
  onPrev,
  onNext,
  isLooping,
  onToggleLoop,
  playbackSpeed,
  onPlaybackSpeedChange,
  disablePrev,
  disableNext
}) => {
  return (
    <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 flex-wrap p-4 bg-slate-100/80 rounded-xl shadow-inner border border-slate-200/70">
      <Button onClick={onPrev} disabled={disablePrev} icon={<BackwardIcon />} variant="subtle" size="md" aria-label="Previous sentence">Previous</Button>
      <Button 
        onClick={onTogglePlayPause} 
        variant={isPlaying ? "alert" : "primary"}
        icon={isPlaying ? <PauseIcon /> : <PlayIcon />}
        className="min-w-[120px] shadow-md hover:shadow-lg"
        size="md"
        aria-label={isPlaying ? "Pause audio" : "Play audio"}
      >
        {isPlaying ? 'Pause' : 'Play'}
      </Button>
      <Button onClick={onNext} disabled={disableNext} icon={<ForwardIcon />} variant="subtle" size="md" aria-label="Next sentence">Next</Button>
      <Button 
        onClick={onToggleLoop} 
        variant={isLooping ? "secondary" : "ghost"}
        icon={<ArrowPathIcon />}
        className={`min-w-[130px] ${isLooping ? 'shadow-md hover:shadow-lg' : ''}`}
        aria-label={isLooping ? "Turn loop off" : "Turn loop on"}
      >
        Loop: {isLooping ? 'On' : 'Off'}
      </Button>
      <Select
        id="playbackSpeed"
        aria-label="Playback speed"
        options={PLAYBACK_SPEEDS.map(s => ({ value: s.value, label: s.label }))}
        value={playbackSpeed}
        onChange={(e) => onPlaybackSpeedChange(parseFloat(e.target.value))}
        containerClassName="sm:ml-auto"
        className="min-w-[100px]"
        icon={<SpeakerWaveIcon className="w-5 h-5" />}
      />
    </div>
  );
};

export default AudioControls;