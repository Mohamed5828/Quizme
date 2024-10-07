import React, { useEffect, useState } from "react";
import { Timeline, Spin, message, Image, Badge } from "antd";
import { useFetchData } from "../../hooks/useFetchData";

// Define the structure of the logs
interface Log {
  id: number;
  action: string;
  timestamp: string;
  type: string;
  additionalInfo?: Record<string, any>;
}

interface CameraLog {
  id: number;
  frame: string;
  flag: string | null;
  timestamp: string;
  attempt: number;
}

// Format the timestamp to a readable format
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
  };
  return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
};

// Function to determine the color based on log type
const getLogColor = (type: string) => {
  switch (type) {
    case "QUES_NAV":
      return "blue";
    case "COPY_PASTE":
      return "red";
    case "WIN_FOCUS":
      return "green";
    default:
      return "gray";
  }
};

// Function to determine the color based on camera log flag
const getCameraLogColor = (flag: string | null) => {
  switch (flag) {
    case "good":
      return "green";
    case "looked_away":
      return "orange";
    case "another_person_detected":
      return "red";
    case "no_person_detected":
      return "gray";
    default:
      return "gray";
  }
};

const Logs: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [cameraLogs, setCameraLogs] = useState<CameraLog[]>([]);
  const { data, error, loading } = useFetchData<Log[]>("/activitylogs/", "v1");
  const { data: cameraData, error: cameraError, loading: cameraLoading } = useFetchData<CameraLog[]>("/cam-frames/", "v1");

  useEffect(() => {
    if (data) {
      setLogs(data);
    }
    if (error) {
      message.error("Failed to fetch logs");
      console.error(error);
    }
  }, [data, error]);

  useEffect(() => {
    if (cameraData) {
      setCameraLogs(cameraData);
    }
    if (cameraError) {
      message.error("Failed to fetch camera logs");
      console.error(cameraError);
    }
  }, [cameraData, cameraError]);

  // Color Legend
  const renderLegend = () => (
    <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
      <div>
        <p>
          <Badge color="blue" text="Navigation" />
        </p>
        <p>
          <Badge color="red" text="Copy-Paste" />
        </p>
        <p>
          <Badge color="green" text="Window Focus" />
        </p>
        <p>
          <Badge color="gray" text="Unknown" />
        </p>
      </div>
      <div>
        <p>
          <Badge color="green" text="Good" />
        </p>
        <p>
          <Badge color="orange" text="Looked Away" />
        </p>
        <p>
          <Badge color="red" text="Another Person Detected" />
        </p>
        <p>
          <Badge color="gray" text="No Person Detected" />
        </p>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      {renderLegend()}

      <div style={{ display: "flex" }}>
        {loading ? (
          <Spin size="large" className="m-auto w-100" />
        ) : (
          <>
            <div style={{ flex: 1 }}>
              <h2 style={{ paddingBottom: "20px" }}>Activity Logs</h2>
              <Timeline mode="left">
                {logs.map((log) => (
                  <Timeline.Item
                    key={log.id}
                    color={getLogColor(log.type)}
                    label={formatDate(log.timestamp)}
                  >
                    <p>Action: {log.action}</p>
                    {log.additionalInfo && (
                      <p>Additional Info: {JSON.stringify(log.additionalInfo)}</p>
                    )}
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>

            <div style={{ flex: 1 }}>
              <h2 style={{ paddingBottom: "20px" }}>Camera Logs</h2>
              {cameraLoading ? (
                <Spin size="large" className="m-auto w-100" />
              ) : (
                <Timeline mode="left">
                  {cameraLogs.map((cameraLog) => (
                    <Timeline.Item
                      key={cameraLog.id}
                      color={getCameraLogColor(cameraLog.flag)}
                      label={formatDate(cameraLog.timestamp)}
                    >
                      <p>Flag: {cameraLog.flag ? cameraLog.flag : "No flag"}</p>
                    </Timeline.Item>
                  ))}
                </Timeline>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Logs;
