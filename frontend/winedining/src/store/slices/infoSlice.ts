import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { InfoItem, InfoResponse, InfoResponseData, InfoDetail, InfoDetailResponse } from "../../types/info";
import { fetchInfo as fetchInfoApi, fetchInfoDetail as fetchInfoDetailApi } from "../../api/infoApi";

interface InfoState {
  infos: InfoItem[];
  selectedInfo: InfoDetail | null;
  loading: boolean;
  error: string | null;
}

const initialState: InfoState = {
  infos: [],
  selectedInfo: null,
  loading: false,
  error: null,
};

// 알쓸신잡 조회
export const fetchInfos = createAsyncThunk<InfoResponseData, void, { rejectValue: string }>(
  "info/fetchInfos",
  async (_, thunkAPI) => {
    try {
      const data = await fetchInfoApi();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue("알쓸신잡 실패");
    }
  }
);

// 알쓸신잡 상세 정보
export const fetchInfoDetailThunk = createAsyncThunk<InfoDetail, number, { rejectValue: string }>(
  "info/fetchInfoDetail",
  async (infoId, thunkAPI) => {
    try {
      const data = await fetchInfoDetailApi(infoId);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue("알쓸신잡 실패");
    }
  }
);

const infoSlice = createSlice({
  name: "info",
  initialState,
  reducers: {
    clearSelectedInfo(state) {
      state.selectedInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 전체 목록
      .addCase(fetchInfos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInfos.fulfilled, (state, action: PayloadAction<InfoResponseData>) => {
        state.loading = false;
        state.infos = action.payload.infos;
      })
      .addCase(fetchInfos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "에러 발생";
      })

      // 상세 정보
      .addCase(fetchInfoDetailThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInfoDetailThunk.fulfilled, (state, action: PayloadAction<InfoDetail>) => {
        state.loading = false;
        state.selectedInfo = action.payload;
      })
      .addCase(fetchInfoDetailThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "에러 발생";
      });
  },
});

export const { clearSelectedInfo } = infoSlice.actions;
export default infoSlice.reducer;
