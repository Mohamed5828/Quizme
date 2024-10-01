import React from "react";
import useWebcamMonitor from "../../hooks/useWebcamMonitor";
import useWebCamPolling from "../../hooks/useWebCamPolling";
import BasicSpinner from "../Basic/BasicSpinner";
interface WebcamMonitorWrapperProps {
  children: React.ReactNode;
}
// TODO: TEST THIS
const WebcamMonitorWrapper = ({ children }: WebcamMonitorWrapperProps) => {
  const { stream, error } = useWebcamMonitor();
  useWebCamPolling(stream);
  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <h1 className="text-red-600 text-center text-3xl font-bold tracking-widest">
          An error occurred trying to capture your webcam and microphone:
          {` ${error.message}`}
        </h1>
      </div>
    );
  }
  if (!stream) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <BasicSpinner />
      </div>
    );
  }
  return <>{children}</>;
};

export default WebcamMonitorWrapper;
