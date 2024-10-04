import React, { useState, useEffect, useRef } from "react";

interface TimerProps {
  timerRef: React.MutableRefObject<{ timeRemaining: number }>;
  onTimerEnd: () => void;
  initialTime: number;
}

const formatTime = (seconds: number): string => {
  if (seconds < 0) return "00:00:00";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};

function Timer({ timerRef, onTimerEnd, initialTime }: TimerProps) {
  const [displayTime, setDisplayTime] = useState<string>("");
  const intervalRef = useRef<number | null>(null);
  const isTimerStarted = useRef<boolean>(false);

  // Initialize timer when component mounts or initialTime changes
  useEffect(() => {
    if (!isTimerStarted.current && initialTime > 0) {
      timerRef.current.timeRemaining = initialTime;
      setDisplayTime(formatTime(initialTime));
      isTimerStarted.current = true;
    }
  }, [initialTime, timerRef]);

  // Handle timer updates
  useEffect(() => {
    if (!isTimerStarted.current) return;

    const updateTimer = () => {
      const currentTime = timerRef.current.timeRemaining;

      if (currentTime <= 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        setDisplayTime("00:00:00");
        onTimerEnd();
        return;
      }

      timerRef.current.timeRemaining = currentTime - 1;
      setDisplayTime(formatTime(currentTime - 1));
    };

    // Clear any existing interval before setting a new one
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(updateTimer, 1000);

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerRef, onTimerEnd]);

  // Get time warning status
  const isTimeWarning = timerRef.current.timeRemaining < 300; // Less than 5 minutes

  return (
    <div className="flex items-center space-x-2">
      <span className="text-gray-600">Time Remaining:</span>
      <span
        className={`text-xl font-bold ${
          isTimeWarning ? "text-red-600 animate-pulse" : "text-blue-600"
        }`}
      >
        {displayTime || formatTime(initialTime)}
      </span>
    </div>
  );
}

export default Timer;
