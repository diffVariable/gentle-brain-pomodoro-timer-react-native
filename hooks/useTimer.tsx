import { useEffect, useRef, useState } from "react";
import { PHASE, PRESETS, TPhase, TPreset } from "../constants";

interface ITimerState {
  preset: TPreset;
  phase: TPhase;
  start: () => void;
  pause: () => void;
  skip: () => void;
  reset: () => void;
  selectPreset: (preset: TPreset) => void;
  timeShown: string;
  isTimerRunning: boolean;
}

const formatTimer = (seconds: number) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const useTimer = (): ITimerState => {
  const [preset, setPreset] = useState<TPreset>(PRESETS[0]);
  const [phase, setPhase] = useState<TPhase>(PHASE.FOCUS);
  const [secondsRemaining, setSecondsRemaining] = useState(
    PRESETS[0].focusTime,
  );
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);
  const shouldTimerAutoStart = useRef(false);

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  useEffect(() => {
    if (!isTimerRunning) {
      clearTimer();
      return;
    }
    intervalRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearTimer();
          shouldTimerAutoStart.current = true;
          setPhase((prev) => {
            const nextPhase = prev === PHASE.FOCUS ? PHASE.BREAK : PHASE.FOCUS;
            setSecondsRemaining(
              nextPhase === PHASE.FOCUS ? preset.focusTime : preset.breakTime,
            );
            return nextPhase;
          });
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [isTimerRunning, preset]);

  useEffect(() => {
    if (!shouldTimerAutoStart.current) return;
    setIsTimerRunning(true);
  }, [phase]);

  const start = () => {
    setIsTimerRunning(true);
  };

  const reset = () => {
    clearTimer();
    setIsTimerRunning(false);
    setPhase(PHASE.FOCUS);
    setSecondsRemaining(preset.focusTime);
    shouldTimerAutoStart.current = false;
  };

  const skip = () => {
    clearTimer();
    setIsTimerRunning(false);
    shouldTimerAutoStart.current = true;
    if (phase === PHASE.BREAK) {
      setPhase(PHASE.FOCUS);
      setSecondsRemaining(preset.focusTime);
    } else {
      setPhase(PHASE.BREAK);
      setSecondsRemaining(preset.breakTime);
    }
  };

  const pause = () => {
    setIsTimerRunning(false);
  };

  const selectPreset = (preset: TPreset) => {
    clearTimer();
    setPhase(PHASE.FOCUS);
    setPreset(preset);
    setSecondsRemaining(preset.focusTime);
    setIsTimerRunning(false);
    shouldTimerAutoStart.current = false;
  };

  return {
    preset,
    phase,
    start,
    reset,
    timeShown: formatTimer(secondsRemaining),
    isTimerRunning,
    skip,
    selectPreset,
    pause,
  };
};

export default useTimer;
