// // hooks/useExamAttempt.ts
// import { useState, useCallback, useEffect } from "react";
// import postData from "../../../../utils/postData";
// import type {
//   UserAnswer,
//   ExamAttemptHookProps,
//   AttemptData,
// } from "../types/types";

// export function useExamAttempt({
//   examData,
//   userId,
//   timerRef,
// }: ExamAttemptHookProps) {
//   const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
//   const [attemptId, setAttemptId] = useState<string | null>(
//     sessionStorage.getItem("attemptId")
//   );
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!examData?.id || !userId) return;

//     const createNewAttempt = async () => {
//       setLoading(true);
//       const initData = {
//         answers: [],
//         studentId: userId,
//         examId: examData.id,
//         startTime: Date.now(),
//       };

//       try {
//         const { resData, error } = await postData<AttemptData>(
//           "/attempts",
//           initData
//         );
//         if (error) throw error;
//         if (resData) {
//           setUserAnswers([]);
//           setAttemptId(resData.id);
//           sessionStorage.setItem("attemptId", resData.id);
//           timerRef.current.timeRemaining = examData.duration;
//         }
//       } catch (error) {
//         console.error("Failed to create attempt:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     createNewAttempt();
//   }, [examData?.id, userId]);

//   const handleSync = useCallback(async () => {
//     if (!attemptId || !examData?.id) return;

//     try {
//       const { error } = await postData(`/attempts/${attemptId}`, {
//         answers: userAnswers,
//         studentId: userId,
//         examId: examData.id,
//       });
//       if (error) throw error;
//     } catch (error) {
//       console.error("Failed to sync answers:", error);
//     }
//   }, [attemptId, userAnswers, examData?.id, userId]);

//   const handleSubmit = useCallback(async () => {
//     if (!attemptId || !examData?.id) return;

//     try {
//       const { error } = await postData(`/attempts/${attemptId}/submit`, {
//         answers: userAnswers,
//         endTime: Date.now(),
//         studentId: userId,
//         examId: examData.id,
//       });
//       if (error) throw error;
//       sessionStorage.removeItem("attemptId");
//       // TODO: Add navigation logic here
//     } catch (error) {
//       console.error("Failed to submit exam:", error);
//     }
//   }, [attemptId, userAnswers, examData?.id, userId]);

//   return {
//     attemptId,
//     userAnswers,
//     setUserAnswers,
//     handleSync,
//     handleSubmit,
//     loading,
//   };
// }
