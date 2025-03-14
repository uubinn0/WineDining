import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import wishReducer from "./slices/wishSlice";
import wineReducer from "./slices/wineSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wine: wineReducer,
    wish: wishReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
