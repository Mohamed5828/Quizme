import { useEffect } from "react";
import {
  addLog,
  pushLogsToServer,
} from "../state/ActivityLogState/ActivityLogSlice";
import { useDispatch } from "react-redux";

const TYPE = "QUES_NAV" as const;

const useQuestionNavMonitor = (questionStep: number | null) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (questionStep !== null) {
      const payload = {
        action: `Navigated to Question ${questionStep}`,
        type: TYPE,
      };
      dispatch(addLog(payload));
    }
  }, [questionStep, dispatch]);
};

export default useQuestionNavMonitor;
