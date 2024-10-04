import { useEffect } from "react";
import {
  addLog,
  pushLogsToServer,
} from "../state/ActivityLogState/ActivityLogSlice";
import { useDispatch } from "react-redux";

const TYPE: "QUES_NAV" | "QUES_NAV" = "QUES_NAV";

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
    return () => {
      dispatch(pushLogsToServer()); // might remove this later
    };
  }, [questionStep, dispatch]);
};

export default useQuestionNavMonitor;
