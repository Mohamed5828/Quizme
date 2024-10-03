// // components/ExamHeader.tsx
// import React from "react";
// import Timer from "../../../QuestionComponents/Timer";
// import type { ExamHeaderProps } from "../types/types";

// export function ExamHeader({
//   timerRef,
//   onTimerEnd,
//   initialTime,
//   onSubmit,
// }: ExamHeaderProps) {
//   return (
//     <div className="bg-white shadow-md p-4 flex justify-between items-center">
//       <Timer timerRef={timerRef} onTimerEnd={onTimerEnd} />
//       <button
//         className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
//         onClick={onSubmit}
//       >
//         Submit Answers
//       </button>
//     </div>
//   );
// }
