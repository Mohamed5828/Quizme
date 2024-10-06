import { createSlice } from "@reduxjs/toolkit";
import postData from "../../utils/postData";
interface ActivityLogState {
  action: string;
  type: "COPY_PASTE" | "WIN_FOCUS" | "QUES_NAV";
  attemptId?: number | null;
  additionalInfo?: {
    text?: string;
  };
  logTime?: string;
}

export const activityLogSlice = createSlice({
  name: "activityLogs",
  initialState: [] as Array<ActivityLogState>,
  reducers: {
    addLog: (state, action: { payload: ActivityLogState }) => {
      action.payload.logTime = new Date().toISOString();
      const attemptId = sessionStorage.getItem("attemptId");
      action.payload.attemptId = attemptId ? parseInt(attemptId, 10) : 0;
      state.push(action.payload);
    },
    resetLogs: (state) => {
      state.length = 0;
    },
    pushLogsToServer: (state) => {
      if (state.length > 0) {
        const logsToSend = JSON.parse(JSON.stringify(state));
        postData("activitylogs/?bulk=true", logsToSend).catch((error) =>
          console.error("Failed to push logs:", error)
        );
      }
      state.length = 0;
    },
  },
});
export default activityLogSlice.reducer;

export const { addLog, resetLogs, pushLogsToServer } = activityLogSlice.actions;
