import { useCallback, useEffect } from "react";
import { addLog } from "../state/ActivityLogState/ActivityLogSlice";
import { useDispatch } from "react-redux";

const TYPE = "WIN_FOCUS" as const;

const useTabFocusMonitor = () => {
  const dispatch = useDispatch();
  const handleFocus = useCallback(() => {
    // console.log("window focus event\n", event);
    dispatch(
      addLog({
        action: "focus",
        type: TYPE,
      })
    );
  }, [dispatch]);

  const handleBlur = useCallback(() => {
    // console.log("window blur event\n", event);
    dispatch(
      addLog({
        action: "blur",
        type: TYPE,
      })
    );
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
