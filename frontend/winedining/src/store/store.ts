import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import wishReducer from "./slices/wishSlice";
import wineReducer from "./slices/wineSlice";
import testReducer from "./slices/testSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wine: wineReducer,
    wish: wishReducer,
    test: testReducer,  // testSlice 연결
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
