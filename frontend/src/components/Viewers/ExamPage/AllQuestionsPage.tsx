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
  duration: string;
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
  const [examStatus, setExamStatus] = useState<
    "loading" | "waiting" | "expired" | "active"
  >("loading");

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

  const {
    data: attemptData,
    loading: attemptLoading,
    error: attemptError,
    statusCode,
  } = useFetchData<AttemptResponse>(`attempts/exam/${examCode}/`);

  // Check exam status
  useEffect(() => {
    if (!examMetaData || examLoading) {
      setExamStatus("loading");
      return;
    }

    const examStartDate = new Date(examMetaData.startDate);
    const examEndDate = new Date(examMetaData.expirationDate);
    const now = new Date();

    if (examStartDate > now) {
      setExamStatus("waiting");
    } else if (examEndDate < now) {
      setExamStatus("expired");
    } else {
      setExamStatus("active");
    }
  }, [examMetaData, examLoading]);

  // Initialize attempt
  useEffect(() => {
    const initializeAttempt = async () => {
      if (
        !examMetaData?.id ||
        !user?.id ||
        statusCode !== 404 ||
        examStatus !== "active"
      )
        return;

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

      if (error) {
        console.error("Failed to initialize attempt:", error);
        return;
      }

      if (resData?.id) {
        setAttemptId(resData.id);
        sessionStorage.setItem("attemptId", resData.id.toString());

        const remainingTime = getRemainingTime(examMetaData, Date.now());
        setTimeRemaining(remainingTime);
        timerRef.current.timeRemaining = remainingTime;
      }
    };

    initializeAttempt();
  }, [examMetaData, user, statusCode, examStatus]);

  // Handle existing attempt
  useEffect(() => {
    if (
      statusCode === 404 ||
      !attemptData ||
      !examMetaData ||
      examStatus !== "active"
    )
      return;

    const currentAttemptId = Array.isArray(attemptData)
      ? attemptData.find((att) => att.student.id === user.id)?.id
      : attemptData.id;

    if (currentAttemptId) {
      setAttemptId(currentAttemptId);
      sessionStorage.setItem("attemptId", currentAttemptId.toString());

      const remainingTime = getRemainingTime(
        examMetaData,
        attemptData.startTime
      );
      if (remainingTime === 0) {
        navigate(`/exam-finished/${examCode}`);
      }
      setTimeRemaining(remainingTime);
      timerRef.current.timeRemaining = remainingTime;
    }
  }, [examMetaData, attemptData, statusCode, examStatus]);

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

    const syncInterval = setInterval(syncAnswers, 3 * 60 * 1000);
    return () => clearInterval(syncInterval);
  }, [attemptId, userAnswers]);

  const handleSubmit = useCallback(async () => {
    if (!attemptId || !user?.id || !examMetaData?.id) return;

    setIsSubmitting(true);

    const { error } = await putData(`/attempts/${attemptId}/`, {
      answers: userAnswers,
      studentId: user.id,
      examId: examMetaData.id,
      endTime: new Date().toISOString(),
    });

    dispatch(pushLogsToServer());

    if (error) {
      console.error("Failed to submit exam:", error);
      toast.error("Failed to submit exam");
      setIsSubmitting(false);
      return;
    }

    sessionStorage.removeItem("attemptId");
    navigate(`/exam-finished/${examCode}`);
  }, [attemptId, userAnswers, examCode, navigate, user?.id, examMetaData?.id]);

  const handleTimerEnd = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  if (examLoading || attemptLoading) {
    return <BasicSpinner />;
  }

  if (examStatus === "waiting") {
    return <ExamWaitingPage startTime={new Date(examMetaData?.startDate)} />;
  }

  if (examStatus === "expired") {
    return <ExamExpiredPage endTime={new Date(examMetaData?.expirationDate)} />;
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
