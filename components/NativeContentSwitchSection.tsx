import React from 'react';
// DEFAULT_PRACTICE_TIME_MINUTES is now managed by useTimer hook in App.tsx
import Button from './Button';
import Input from './Input';
import { ClockIcon, BellAlertIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface NativeContentSwitchSectionProps {
  practiceTimeMinutes: number;
  onPracticeTimeChange: (minutes: number) => void;
  onStartTimer: () => void;
  timerDisplay: string;
  isTimerRunning: boolean;
  showSwitchToNativeAlert: boolean;
  onHideAlert: () => void;
}

const NativeContentSwitchSection: React.FC<NativeContentSwitchSectionProps> = ({
  practiceTimeMinutes,
  onPracticeTimeChange,
  onStartTimer,
  timerDisplay,
  isTimerRunning,
  showSwitchToNativeAlert,
  onHideAlert,
}) => {
  const initialFullTimeDisplay = (() => {
    const mins = Math.floor(practiceTimeMinutes); // Initial time set for the timer
    const secs = 0; // Assuming timer starts at full minutes
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  })();
  
  const showPausedAtMessage = 
    !isTimerRunning &&
    timerDisplay !== "00:00" &&
    timerDisplay !== initialFullTimeDisplay && // Check against the initial full time
    !showSwitchToNativeAlert; // Don't show if "Time's up" alert is active

  return (
    <section className="p-6 bg-slate-50/70 rounded-xl shadow-lg border border-slate-200/70 animate-fade-in">
      <h2 className="text-xl font-semibold text-slate-700 mb-4 pb-3 border-b border-slate-200/80 flex items-center">
        <ClockIcon className="w-6 h-6 mr-2 text-sky-600" />
        Native Content Switch
      </h2>
      <p className="text-sm text-slate-600 mb-6">
        Practice switching between this app and native material (podcasts, videos).
      </p>
      <div className="flex flex-col sm:flex-row gap-x-6 gap-y-4 items-end mb-4">
        <Input
          label="Practice Time (minutes):"
          id="easyPracticeTime"
          type="number"
          value={practiceTimeMinutes}
          min="1"
          max="120" // Set a reasonable max
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (val > 0) onPracticeTimeChange(val);
          }}
          disabled={isTimerRunning}
          containerClassName="flex-grow"
          icon={<ClockIcon className="w-5 h-5"/>}
        />
        <Button 
          onClick={onStartTimer} 
          disabled={isTimerRunning} 
          className="w-full sm:w-auto" 
          size="md"
          icon={isTimerRunning ? undefined : <ClockIcon className="w-5 h-5"/>}
        >
          {isTimerRunning ? `Running: ${timerDisplay}` : 'Start Timer'}
        </Button>
      </div>
      
      {showPausedAtMessage && (
         <p className="text-md font-semibold text-center text-sky-700 my-3 p-2 bg-sky-50 rounded-md border border-sky-200">
            Timer paused at: {timerDisplay}
        </p>
      )}

      {showSwitchToNativeAlert && (
        <div className="mt-6 p-4 bg-teal-500 text-white rounded-lg shadow-md text-center animate-pulse-subtle">
          <div className="flex items-center justify-center mb-2">
            <BellAlertIcon className="w-7 h-7 mr-2"/>
            <p className="text-lg font-semibold">Time's up! Switch to Native Material!</p>
          </div>
          <Button onClick={onHideAlert} variant="subtle" size="sm" className="mt-3 bg-white text-teal-700 hover:bg-teal-100">
            <CheckCircleIcon className="w-5 h-5 mr-1" /> Okay, Got It!
          </Button>
        </div>
      )}
    </section>
  );
};

export default NativeContentSwitchSection;