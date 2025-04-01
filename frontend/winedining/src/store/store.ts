import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import wishReducer from "./slices/wishSlice";
import wineReducer from "./slices/wineSlice";
import testReducer from "./slices/testSlice";
import noteReducer from "./slices/noteSlice";
import sellarReducer from "./slices/sellarSlice";
import infoReducer from "./slices/infoSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wine: wineReducer,
    wish: wishReducer,
    test: testReducer,
    note: noteReducer,
    cellar: sellarReducer,
    info: infoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
