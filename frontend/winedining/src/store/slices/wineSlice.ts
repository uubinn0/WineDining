import { createSlice, createAsyncThunk, PayloadAction, isRejectedWithValue } from "@reduxjs/toolkit";
import { Wine, WineFilter, WineListResponse, WineDetail } from "../../types/wine";
import { fetchFilteredWines, fetchWineDetail } from "../../api/wineApi";

interface WineState {
  wines: Wine[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  page: number;
  totalPages: number;
  hasMore: boolean;
  wineDetail: WineDetail | null;
  totalCount: number;
}

const initialState: WineState = {
  wines: [],
  status: "idle",
  error: null,
  page: 1,
  totalPages: 1,
  hasMore: true,
  wineDetail: null,
  totalCount: 0,
};

// 와인 리스트 가져오기
export const fetchWines = createAsyncThunk<WineListResponse, WineFilter, { rejectValue: string }>(
  "wine/fetchWines",
  async (filter, { rejectWithValue }) => {
    try {
      const response = await fetchFilteredWines(filter);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message || "와인 리스트 불러오기 실패");
    }
  }
);

// 와인 상세보기
export const fetchWineDetailThunk = createAsyncThunk<WineDetail, number, { rejectValue: string }>(
  "wine/fetchDetail",
  async (wineId, { rejectWithValue }) => {
    try {
      const detail = await fetchWineDetail(wineId);
      return detail;
    } catch (err) {
      return rejectWithValue("상세 정보 불러오기 실패");
    }
  }
);

const wineSlice = createSlice({
  name: "wine",
  initialState,
  reducers: {
    resetWines(state) {
      state.wines = [];
      state.page = 1;
      state.totalPages = 1;
      state.hasMore = true;
      state.status = "idle";
      state.error = null;
    },
    clearWineDetail(state) {
      state.wineDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 와인 리스트 가져오기
      .addCase(fetchWines.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWines.fulfilled, (state, action: PayloadAction<WineListResponse>) => {
        state.status = "succeeded";

        const { wines, page, totalPages, totalCount } = action.payload;

        console.log("응답 확인:", {
          page,
          totalPages,
          totalCount,
          currentWinesCount: wines.length,
        });

        state.wines = [...state.wines, ...wines];
        state.page = page;
        state.totalPages = totalPages;
        state.hasMore = page < totalPages;
        state.totalCount = totalCount;
      })
      .addCase(fetchWines.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "와인 리스트 불러오기 실패";
      })

      // 와인 상세 보기
      .addCase(fetchWineDetailThunk.fulfilled, (state, action: PayloadAction<WineDetail>) => {
        state.wineDetail = action.payload;
      });
  },
});

export const { resetWines } = wineSlice.actions;
export default wineSlice.reducer;
