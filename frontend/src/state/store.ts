import { configureStore } from "@reduxjs/toolkit";
import ExamCreationReducer from "./ExamCreationState/ExamCreationSlice.ts";
export const store = configureStore({
  reducer: {
    ExamCreationState: ExamCreationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
