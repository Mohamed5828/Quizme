import { configureStore } from "@reduxjs/toolkit";
import ExamCreationReducer from "./ExamCreationState/ExamCreationSlice.ts";
import ActivityLogReducer from "./ActivityLogState/ActivityLogSlice.ts";
export const store = configureStore({
  reducer: {
    ExamCreationState: ExamCreationReducer,
    ActivityLogState: ActivityLogReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
