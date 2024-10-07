import React, { useState, useRef, useCallback, useEffect } from "react";
import QuestionContainer from "./components/QuestionContainer";
import Timer from "../../QuestionComponents/Timer";
import { useFetchData } from "../../../hooks/useFetchData";
import BasicSpinner from "../../Basic/BasicSpinner";
import postData from "../../../utils/postData";
import { useUserContext } from "../../../../context/UserContext";
import { useParams, useNavigate } from "react-router-dom";
import putData from "../../../utils/putData";
import { toast } from "react-toastify";
import { getRemainingTime } from "./hooks/getRemainingTime";
import { useDispatch } from "react-redux";
import { pushLogsToServer } from "../../../state/ActivityLogState/ActivityLogSlice";
import useTabFocusMonitor from "../../../hooks/useTabFocusMonitor";
import useClipboardMonitor from "../../../hooks/useClipboardMonitor";
import ExamWaitingPage from "./components/ExamStartTime";
import ExamExpiredPage from "./components/ExamEpired";

interface UserAnswer {
  questionId: number;
  answer: string | number;
}

export interface ExamMetaData {
  id: number;
  duration: string; // "HH:MM:SS" format
  startDate: string;
  expirationDate: string;
}

interface AttemptResponse {
  id: number;
  startTime: number;
}

function AllQuestionsPage() {
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [attemptId, setAttemptId] = useState<number>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { user } = useUserContext();
  const { examCode } = useParams();
  const navigate = useNavigate();
  const timerRef = useRef<{ timeRemaining: number }>({ timeRemaining: 0 });
  const dispatch = useDispatch();

  const formattedDate = new Date().toISOString();
  useTabFocusMonitor();
  useClipboardMonitor();
  const {
    data: examMetaData,
    loading: examLoading,
    error: examError,
  } = useFetchData<ExamMetaData>(`exams/exam-durations/${examCode}/`, "v2");
  console.log(examMetaData);

  const {
    data: attemptData,
    loading: attemptLoading,
    error: attemptError,
    statusCode,
  } = useFetchData<AttemptResponse>(`attempts/exam/${examCode}/`);
  console.log(statusCode);

  if (!examMetaData?.id) return null;
  const examStartDate = new Date(examMetaData.startDate);
  const examEndDate = new Date(examMetaData.expirationDate);
  const now = new Date();
  if (examStartDate > now) {
    // Exam hasn't started yet
    return <ExamWaitingPage startTime={examMetaData.startDate} />;
  } else if (examEndDate < now) {
    // Exam has ended
    return <ExamExpiredPage endTime={examEndDate} />;
  }

  // Initialize attempt if none exists
  useEffect(() => {
    const initializeAttempt = async () => {
      if (!examMetaData?.id || !user?.id || statusCode !== 404) return;
      const initData = {
        answers: [],
        studentId: user.id,
        examId: examMetaData.id,
        startTime: formattedDate,
      };

      const { resData, error } = await postData<AttemptResponse>(
        "/attempts/",
        initData
      );
      const remainingTime = getRemainingTime(examMetaData, Date.now());
      setTimeRemaining(remainingTime);
      timerRef.current.timeRemaining = remainingTime;
      if (error) {
        console.error("Failed to initialize attempt:", error);
        return;
      }

      if (resData?.id) {
        setAttemptId(resData.id);
        sessionStorage.setItem("attemptId", resData.id.toString());
      }
    };

    initializeAttempt();
  }, [examMetaData, user, statusCode]);

  // Handle existing attempt
  useEffect(() => {
    if (statusCode === 404 || !attemptData || !examMetaData) return;
    if (Array.isArray(attemptData)) {
      // Filter attempts that belong to the current user
      const userAttempt = attemptData.find((att) => att.student.id === user.id);

      if (userAttempt) {
        setAttemptId(userAttempt.id); // Set the found attempt ID
      } else {
        console.error("No attempt found for the current user");
      }
    } else {
      // If attemptData is a single object
      setAttemptId(attemptData.id);
    }

    // Save attemptId to sessionStorage (make sure attemptId is set first)
    if (attemptId) {
      sessionStorage.setItem("attemptId", attemptId.toString());
    } else {
      console.error("Attempt ID is not set");
    }

    const remainingTime = getRemainingTime(examMetaData, attemptData.startTime);

    setTimeRemaining(remainingTime);
    if (remainingTime == 0) navigate(`/exam-finished/${examCode}`);
    timerRef.current.timeRemaining = remainingTime;
  }, [examMetaData, attemptData, statusCode]);

  // Sync answers with server
  useEffect(() => {
    if (!attemptId || !user?.id || !examMetaData?.id) return;

    const syncAnswers = async () => {
      const { error } = await putData(`/attempts/${attemptId}/`, {
        answers: userAnswers,
        studentId: user.id,
        examId: examMetaData.id,
      });
      dispatch(pushLogsToServer());
      if (error) {
        console.error("Failed to sync answers:", error);
      } else {
        toast.success("Answers Synced");
      }
    };

    const syncInterval = setInterval(syncAnswers, 3 * 60 * 1000); // Every 3 minutes
    return () => clearInterval(syncInterval);
  }, [attemptId, userAnswers]);

  const handleSubmit = useCallback(async () => {
    if (!attemptId || !user?.id || !examMetaData?.id) return;

    const { error } = await putData(`/attempts/${attemptId}/`, {
      answers: userAnswers,
      studentId: user.id,
      examId: examMetaData.id,
      endTime: new Date().toISOString(),
    });
    setIsSubmitting(true);

    dispatch(pushLogsToServer());
    if (error) {
      console.error("Failed to submit exam:", error);
      toast.error("Failed to submit exam");
      setIsSubmitting(false);
      return;
    }

    sessionStorage.removeItem("attemptId");
    navigate(`/exam-finished/${examCode}`);
  }, [attemptId, userAnswers, examCode, navigate]);

  const handleTimerEnd = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  if (examLoading || attemptLoading) {
    return <BasicSpinner />;
  }

  if (!attemptId) {
    return <BasicSpinner />;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-white shadow-md p-4 flex justify-between items-center">
        <Timer
          timerRef={timerRef}
          onTimerEnd={handleTimerEnd}
          initialTime={timeRemaining}
        />
        <button
          className={`bg-green-500 text-white px-6 py-2 rounded-lg 
                  ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"} 
                  transition-colors duration-200`}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Answers"}
        </button>
      </div>
      <div className="flex-grow mt-4 overflow-hidden">
        <QuestionContainer
          userAnswers={userAnswers}
          setUserAnswers={setUserAnswers}
        />
      </div>
    </div>
  );
}

export default AllQuestionsPage;
