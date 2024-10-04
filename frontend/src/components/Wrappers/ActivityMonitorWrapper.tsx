import React from "react";
import useClipboardMonitor from "../../hooks/useClipboardMonitor";
import useTabFocusMonitor from "../../hooks/useTabFocusMonitor";

interface ActivityMonitorWrapperProps {
  children?: React.ReactNode;
}

const ActivityMonitorWrapper = ({ children }: ActivityMonitorWrapperProps) => {
  useClipboardMonitor();
  useTabFocusMonitor();
  return <>{children}</>;
};

export default ActivityMonitorWrapper;
