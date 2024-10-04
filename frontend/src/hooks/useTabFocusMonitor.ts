import { useCallback, useEffect } from "react";
import { addLog } from "../state/ActivityLogState/ActivityLogSlice";
import { useDispatch } from "react-redux";

const TYPE: "WIN_FOCUS" | "WIN_FOCUS" = "WIN_FOCUS";

const useTabFocusMonitor = () => {
  const dispatch = useDispatch();
  const handleFocus = useCallback(() => {
    // console.log("window focus event\n", event);
    const payload = {
      action: "focus",
      type: TYPE,
    };
    dispatch(addLog(payload));
  }, [dispatch]);

  const handleBlur = useCallback(() => {
    // console.log("window blur event\n", event);
    const payload = {
      action: "blur",
      type: TYPE,
    };
    dispatch(addLog(payload));
  }, [dispatch]);

  useEffect(() => {
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, [handleBlur, handleFocus]);
};

export default useTabFocusMonitor;
