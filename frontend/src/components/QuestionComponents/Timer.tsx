import React from "react";

interface TimerProps {
  timeRemaining: number;
}

function Timer({ timeRemaining }: TimerProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="text-xl font-bold">
      Time Remaining: {formatTime(timeRemaining)}
    </div>
  );
}

export default Timer;
