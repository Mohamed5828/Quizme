import React, { useState, useRef, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import QuestionContainer from "./ExamPage/components/QuestionContainer";
import Timer from "../QuestionComponents/Timer";
import BasicSpinner from "../Basic/BasicSpinner";
import postData from "../../utils/postData";
import { useUserContext } from "../../../context/UserContext";
import { useFetchData } from "../../hooks/useFetchData";

interface UserAnswer {
  questionId: number;
  answer: string | number;
}

interface ExamDuration {
  id: string;
  duration: number;
  exam_code: string;
}

interface AttemptData {
  id: string;
  answers: UserAnswer[];
  startTime: number;
  studentId: string;
  examId: string;
}

function AllQuestionsPage() {
  const { examCode } = useParams<{ examCode: string }>();
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const { user } = useUserContext();
  const [attemptId, setAttemptId] = useState<string | null>(
    sessionStorage.getItem("attemptId")
  );
  const [loading, setLoading] = useState(false);

  const timerRef = useRef<{ timeRemaining: number }>({
    timeRemaining: 0,
  });

  const {
    data,
    loading: dataLoading,
    error,
  } = useFetchData<ExamDuration>(`exams/exam-durations/${examCode}`, "v2");

  // Create a new attempt if one doesn't exist
  useEffect(() => {
    if (!data?.id || attemptId) return;

    const createNewAttempt = async () => {
      setLoading(true);
      try {
        const initData = {
          answers: [],
          studentId: user?.id,
          examId: data.id,
          startTime: Date.now(),
        };

        const { resData, error } = await postData<AttemptData>(
          "/attempts",
          initData
        );
        if (error) throw error;

        if (resData) {
          setUserAnswers([]);
          setAttemptId(resData.id);
          sessionStorage.setItem("attemptId", resData.id);
        }
      } catch (err) {
        console.error("Failed to create attempt:", err);
      } finally {
        setLoading(false);
      }
    };

    createNewAttempt();
  }, [data?.id, attemptId, user?.id]);

  // Auto-sync answers every 3 minutes
  useEffect(() => {
    if (!attemptId || !data?.id) return;

    const syncInterval = setInterval(
      () => {
        handleSync();
      },
      3 * 60 * 1000
    ); // 3 minutes

    return () => clearInterval(syncInterval);
  }, [attemptId, userAnswers, data?.id]);

  const handleSync = useCallback(async () => {
    if (!attemptId || !data?.id) return;

    try {
      const { error } = await postData(`/attempts/${attemptId}`, {
        answers: userAnswers,
        studentId: user?.id,
        examId: data.id,
      });
      if (error) throw error;
    } catch (err) {
      console.error("Failed to sync answers:", err);
    }
  }, [attemptId, userAnswers, data?.id, user?.id]);

  const handleSubmit = useCallback(async () => {
    if (!attemptId || !data?.id) return;

    try {
      const { error } = await postData(`/attempts/${attemptId}/submit`, {
        answers: userAnswers,
        endTime: Date.now(),
        studentId: user?.id,
        examId: data.id,
      });
      if (error) throw error;

      sessionStorage.removeItem("attemptId"); // Clear the attempt ID after submission
      // Handle successful submission (e.g., redirect to results page)
    } catch (err) {
      console.error("Failed to submit exam:", err);
    }
  }, [attemptId, userAnswers, data?.id, user?.id]);

  const handleTimerEnd = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  if (loading || dataLoading) return <BasicSpinner />;
  if (!data) return <div>Loading exam information...</div>;

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-white shadow-md p-4 flex justify-between items-center">
        <Timer timerRef={timerRef} onTimerEnd={handleTimerEnd} />
        <button
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
          onClick={handleSubmit}
        >
          Submit Answers
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
