import { ExamMetaData } from "../AllQuestionsPage";

export function getRemainingTime(
  examMetaData: ExamMetaData,
  examStartTime: number | string
): number {
  if (!examMetaData?.duration) {
    return 0;
  }

  // Parse examStartTime to handle both timestamp (number) and ISO string (string)
  let startTimeInMillis: number;

  if (typeof examStartTime === "string") {
    // Parse the ISO string to a timestamp in milliseconds
    startTimeInMillis = Date.parse(examStartTime);
    if (isNaN(startTimeInMillis)) {
      // If the string cannot be parsed, return 0 as a fallback
      return 0;
    }
  } else if (typeof examStartTime === "number") {
    startTimeInMillis = examStartTime;
  } else {
    // If examStartTime is neither a string nor a number, return 0 as a fallback
    return 0;
  }

  // Split the duration string "hh:mm:ss" into hours, minutes, seconds
  const [hours, minutes, seconds] = examMetaData.duration
    .split(":")
    .map(Number);

  // Convert duration to total seconds
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  // Calculate elapsed time since exam started in seconds
  const currentTime = Date.now(); // Current time in milliseconds
  const elapsedSeconds = Math.floor((currentTime - startTimeInMillis) / 1000);

  // Calculate remaining seconds
  const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);

  return remainingSeconds;
}
