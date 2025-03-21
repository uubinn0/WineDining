import { configureStore } from "@reduxjs/toolkit";
// import userReducer from "./slices/userSlice";
// import cartReducer from "./slices/wishSlice";
import wineReducer from "./slices/wineSlice";

export const store = configureStore({
  reducer: {
    // user: useReducer,
    wine: wineReducer,
    // wish: wishReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
