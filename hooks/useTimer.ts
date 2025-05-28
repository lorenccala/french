import { useState, useEffect, useRef, useCallback } from 'react';

export const useTimer = (initialPracticeTimeMinutes: number) => {
  const [practiceTimeMinutes, setPracticeTimeMinutes] = useState<number>(initialPracticeTimeMinutes);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [showSwitchToNativeAlert, setShowSwitchToNativeAlert] = useState<boolean>(false);
  const timerIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isTimerRunning && timerSeconds > 0) {
      timerIntervalRef.current = window.setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      setIsTimerRunning(false);
      setShowSwitchToNativeAlert(true);
      // Optionally play a sound here
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning, timerSeconds]);

  const startTimer = useCallback(() => {
    setTimerSeconds(practiceTimeMinutes * 60);
    setIsTimerRunning(true);
    setShowSwitchToNativeAlert(false);
  }, [practiceTimeMinutes]);

  const resetTimerAlert = useCallback(() => {
    setShowSwitchToNativeAlert(false);
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return {
    timerSeconds,
    isTimerRunning,
    showSwitchToNativeAlert,
    practiceTimeMinutes,
    setPracticeTimeMinutes, // Allow updating from component
    startTimer,
    formatTime,
    resetTimerAlert
  };
};
