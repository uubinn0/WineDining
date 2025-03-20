import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Wine, WineFilter } from "../../types/wine";
import { registerWineBySearch } from "../../api/wineApi";

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

// 와인 리스트 가져오기
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

// 와인 등록 (검색)
export const postWineBySearch = createAsyncThunk<Wine, number, { rejectValue: string }>(
  "wine/postWineBySearch",
  async (wineId, { rejectWithValue }) => {
    try {
      const response = await registerWineBySearch(wineId);
      return response; // 백엔드에서 반환된 Wine 객체
    } catch (error) {
      return rejectWithValue("와인 등록 실패");
    }
  }
);

const wineSlice = createSlice({
  name: "wine",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 와인 목록 가져오기
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
      })

      // 와인 등록 (검색)
      .addCase(postWineBySearch.pending, (state) => {
        state.status = "loading";
      })
      .addCase(postWineBySearch.fulfilled, (state, action: PayloadAction<Wine>) => {
        state.status = "succeeded";
        state.wines.push(action.payload); // 등록된 와인을 리스트에 추가
      })
      .addCase(postWineBySearch.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "와인 등록 실패";
      });
  },
});

export default wineSlice.reducer;
