import React, { useState, useEffect, useRef } from "react";

interface TimerProps {
  timerRef: React.MutableRefObject<{ timeRemaining: number }>;
  onTimerEnd: () => void;
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

function Timer({ timerRef, onTimerEnd }: TimerProps) {
  const [displayTime, setDisplayTime] = useState(
    formatTime(timerRef.current.timeRemaining)
  );
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const updateTimer = () => {
      if (timerRef.current.timeRemaining <= 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        onTimerEnd();
        return;
      }

      timerRef.current.timeRemaining -= 1;
      setDisplayTime(formatTime(timerRef.current.timeRemaining));
    };

    intervalRef.current = window.setInterval(updateTimer, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerRef, onTimerEnd]);

  return <div className="text-xl font-bold">Time Remaining: {displayTime}</div>;
}

export default Timer;
