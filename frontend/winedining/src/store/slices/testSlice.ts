import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TestState {
  testCompleted: boolean; // 취향 테스트 완료 여부
  currentStep: number; // 현재 질문 단계 (RecommendFlow에서 사용할)
}

const initialState: TestState = {
  testCompleted: false, // 기본값은 false (테스트가 완료되지 않음)
  currentStep: 0, // 기본값은 0 (첫 번째 질문부터 시작)
};

const testSlice = createSlice({
  name: "test",
  initialState,
  reducers: {
    // 취향 테스트 완료 상태 업데이트
    setTestCompleted: (state, action: PayloadAction<boolean>) => {
      state.testCompleted = action.payload; // true면 취향 테스트 완료, false는 미완료
    },

    // 현재 질문 단계 업데이트
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload; // 현재 질문의 번호 (6번째 질문부터 시작할 수 있도록)
    },

    // 테스트 상태 초기화 (testCompleted와 currentStep을 초기 상태로 리셋)
    resetTestState: (state) => {
      state.testCompleted = false; // 취향 테스트 완료 여부를 false로 리셋
      state.currentStep = 0; // 질문을 처음부터 시작할 수 있도록 currentStep을 0으로 리셋
    },
  },
});

// 액션과 리듀서를 export
export const { setTestCompleted, setCurrentStep, resetTestState } = testSlice.actions;

// 상태를 선택하는 리듀서
export const selectTestState = (state: any) => state.test;

// testSlice 리듀서 export
export default testSlice.reducer;
