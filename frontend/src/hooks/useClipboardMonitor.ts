import { useCallback, useEffect } from "react";
import { addLog } from "../state/ActivityLogState/ActivityLogSlice";
import { useDispatch } from "react-redux";
const TYPE: "COPY_PASTE" | "COPY_PASTE" = "COPY_PASTE";

const useClipboardMonitor = () => {
  const dispatch = useDispatch();

  const handlePaste = useCallback(
    (event: ClipboardEvent) => {
      // console.log("paste event\n", event);
      const payload = {
        action: "paste",
        type: TYPE,
        additionalInfo: {
          text: event.clipboardData?.getData("text/plain"),
        },
      };
      dispatch(addLog(payload));
    },
    [dispatch]
  );

  const handleCopy = useCallback(
    (event: ClipboardEvent) => {
      // console.log("copy event\n", event);
      const payload = {
        action: "copy",
        type: TYPE,
        additionalInfo: {
          text: event.clipboardData?.getData("text/plain"),
        },
      };
      dispatch(addLog(payload));
    },
    [dispatch]
  );

  useEffect(() => {
    window.addEventListener("paste", handlePaste);
    window.addEventListener("copy", handleCopy);
    return () => {
      window.removeEventListener("paste", handlePaste);
      window.removeEventListener("copy", handleCopy);
    };
  }, [handleCopy, handlePaste]);
};

export default useClipboardMonitor;
