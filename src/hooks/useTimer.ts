import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * 타이머 훅
 */
export function useTimer(isRunning: boolean, onTick?: (elapsed: number) => void) {
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  /**
   * 타이머 시작
   */
  const start = useCallback(() => {
    startTimeRef.current = Date.now() - pausedTimeRef.current;
  }, []);

  /**
   * 타이머 일시정지
   */
  const pause = useCallback(() => {
    pausedTimeRef.current = elapsed * 1000;
  }, [elapsed]);

  /**
   * 타이머 리셋
   */
  const reset = useCallback(() => {
    setElapsed(0);
    startTimeRef.current = 0;
    pausedTimeRef.current = 0;
  }, []);

  /**
   * 타이머 효과
   */
  useEffect(() => {
    if (!isRunning) {
      if (elapsed > 0) {
        pause();
      }
      return;
    }

    start();

    const interval = setInterval(() => {
      const currentElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setElapsed(currentElapsed);

      if (onTick) {
        onTick(currentElapsed);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onTick, start, pause, elapsed]);

  /**
   * 시간 포맷팅 (MM:SS)
   */
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    elapsed,
    formattedTime: formatTime(elapsed),
    reset,
  };
}
