import { createSlice } from "@reduxjs/toolkit";

interface ExamCreationState {
  step: number;
}

const initialState: ExamCreationState = {
  step: 2,
};

const ExamCreationSlice = createSlice({
  name: "ExamCreationState",
  initialState,
  reducers: {
    incrementStep: (state, maxSteps) => {
      console.log(state.step);
      if (state.step < maxSteps.payload) {
        state.step += 1;
      }
    },
    decrementStep: (state) => {
      if (state.step > 1) {
        state.step -= 1;
      }
    },
  },
});

export default ExamCreationSlice.reducer;

export const { incrementStep, decrementStep } = ExamCreationSlice.actions;
