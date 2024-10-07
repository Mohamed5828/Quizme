import React, { useEffect, useState } from "react";
import { Timeline, Spin, message, Image } from "antd";
import { useFetchData } from "../../hooks/useFetchData";


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

const getLogColor = (type: string) => {
  switch (type) {
    case "QUES_NAV":
      return "blue"; 
    case "COPY_PASTE":
      return "green"; 
    case "WIN_FOCUS":
      return "red"; 
    default:
      return "gray"; 
  }
};

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
      return "gray"; // 
  }
};

const Logs: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [cameraLogs, setCameraLogs] = useState<CameraLog[]>([]);
  const { data, error, loading } = useFetchData<Log[]>("/activitylogs/", "v1");
  const { data: cameraData, error: cameraError, loading: cameraLoading} = useFetchData<CameraLog[]>("/cam-frames/","v1");

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

  return (
    <div style={{ padding: "20px", textAlign: "center", display: "flex" }}>
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
                  <p>Type: {log.type}</p>
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
                    {cameraLog.frame ? (
                      <Image
                        width={200} 
                        src={`data:image/jpeg;base64,${cameraLog.frame}`}
                        alt="Camera Frame"
                        placeholder={<Image preview={false} src="placeholder" />} 
                      />
                    ) : (
                      <Image
                        width={200}
                        src="../../../public/exam.jpg" 
                        alt="No Frame"
                      />
                    )}
                    <p>Flag: {cameraLog.flag ? cameraLog.flag : "No flag"}</p>
                  </Timeline.Item>
                ))}
              </Timeline>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Logs;
