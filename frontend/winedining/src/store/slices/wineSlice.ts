import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Wine, WineFilter } from "../../types/wine";

import { fetchFilteredWines } from "../../mocks/mockApi"; // 가짜 API 불러오기

interface WineState {
  wines: Wine[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: WineState = {
  wines: [],
  status: "idle",
  error: null,
};

export const fetchWines = createAsyncThunk<Wine[], WineFilter | undefined, { rejectValue: string }>(
  "wine/fetchWines",
  async (filter, { rejectWithValue }) => {
    try {
      const response = await fetchFilteredWines(filter);
      return response as Wine[];
    } catch (error) {
      return rejectWithValue((error as Error).message || "와인 목록 불러오기 실패");
    }
  }
);

const wineSlice = createSlice({
  name: "wine",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWines.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWines.fulfilled, (state, action: PayloadAction<Wine[]>) => {
        state.status = "succeeded";
        state.wines = action.payload;
      })
      .addCase(fetchWines.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "ubdefined 확인 불가!";
      });
  },
});

export default wineSlice.reducer;
