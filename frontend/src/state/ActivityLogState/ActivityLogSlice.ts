import { createSlice } from "@reduxjs/toolkit";
import postData from "../../utils/postData";
interface ActivityLogState {
  action: string;
  type: "COPY_PASTE" | "WIN_FOCUS" | "QUES_NAV";
  attemptId?: string | null;
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
      action.payload.attemptId = sessionStorage.getItem("attemptId");
      state.push(action.payload);
    },
    resetLogs: (state) => {
      state.length = 0;
    },
    pushLogsToServer: (state) => {
      if (state.length > 0) {
        postData("activitylogs/?bulk=true", state);
      }
      state.length = 0;
    },
  },
});
export default activityLogSlice.reducer;

export const { addLog, resetLogs, pushLogsToServer } = activityLogSlice.actions;
