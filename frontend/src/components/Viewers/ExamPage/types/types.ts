// types.ts
export interface UserAnswer {
  questionId: number;
  answer: string | number;
}

export interface ExamDuration {
  id: string;
  duration: number;
  exam_code: string;
}

export interface AttemptData {
  id: string;
  answers: UserAnswer[];
  startTime: number;
  studentId: string;
  examId: string;
}

export interface ExamAttemptHookProps {
  examData: ExamDuration | null;
  userId?: number | undefined;
  timerRef: React.RefObject<{ timeRemaining: number }>;
}

export interface ExamHeaderProps {
  timerRef: React.RefObject<{ timeRemaining: number }>;
  onTimerEnd: () => void;
  initialTime: number;
  onSubmit: () => void;
}
