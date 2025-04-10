import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchWineCellar,
  registerWineCellar,
  deleteWineCellar,
  fetchBestWineCellar,
  cancelBestWineCellar,
  registerBestWineCellar,
  registerCustomWineCellar,
} from "../../api/sellerApi";
import { Bottle, CustomWine } from "../../types/seller";
import { CustomWineRegistrationRequest } from "../../types/seller";
import { Wine } from "../../types/wine";

// 셀러 상태관리
interface CellarState {
  bottles: Bottle[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  totalCount: number;

  // best 관리
  bestBottles: Bottle[];
  beststatus: "idle" | "loading" | "succeeded" | "failed";
  besterror: string | null;
}

const initialState: CellarState = {
  bottles: [],
  status: "idle",
  error: null,
  totalCount: 0,

  // best 관리
  bestBottles: [],
  beststatus: "idle",
  besterror: null,
};

// 셀러 전체 조회
export const fetchCellar = createAsyncThunk<Bottle[], { page?: number } | void, { rejectValue: string }>(
  "cellar/fetchCellar",
  async (args, { rejectWithValue }) => {
    // args가 없으면 기본 페이지 1로 설정
    const page = typeof args === "object" && args?.page ? args.page : 1;
    try {
      // API 함수가 페이지 정보를 받도록 수정했다면 전달합니다.
      const data = await fetchWineCellar(page);
      return data.bottles;
    } catch (error) {
      return rejectWithValue("셀러 불러오기 실패");
    }
  }
);

// 셀러 와인 등록
export const registerCellar = createAsyncThunk<Bottle, number, { rejectValue: string }>(
  "cellar/registerCellar",
  async (wineId, { rejectWithValue }) => {
    try {
      const data = await registerWineCellar(wineId);
      return data;
    } catch (error) {
      return rejectWithValue("와인 셀러 등록 실패");
    }
  }
);

// 셀러 와인 삭제
export const deleteCellar = createAsyncThunk<number, number, { rejectValue: string }>(
  "cellar/deleteCellar",
  async (bottleId, { rejectWithValue }) => {
    try {
      await deleteWineCellar(bottleId);
      return bottleId;
    } catch (error) {
      return rejectWithValue("와인 삭제 실패");
    }
  }
);

// 베스트 셀러 조회
export const fetchBest = createAsyncThunk<Bottle[], void, { rejectValue: string }>(
  "cellar/fetchBest",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchBestWineCellar();
      return data.bottles;
    } catch (error) {
      return rejectWithValue("베스트 와인 조회 실패");
    }
  }
);

// 베스트 셀러 등록
export const registerBest = createAsyncThunk<string, number, { rejectValue: string }>(
  "cellar/registerBest",
  async (bottleId, { rejectWithValue }) => {
    try {
      const message = await registerBestWineCellar(bottleId);
      return message;
    } catch (error) {
      return rejectWithValue("베스트 셀러 등록 실패");
    }
  }
);

// 베스트 셀러 삭제
export const deleteBest = createAsyncThunk<string, number, { rejectValue: string }>(
  "cellar/deleteBest",
  async (bottleId, { rejectWithValue }) => {
    try {
      const message = await cancelBestWineCellar(bottleId);
      return message;
    } catch (error) {
      return rejectWithValue("베스트 셀러 해제 실패");
    }
  }
);

// 커스텀 와인 등록
export const registerCustomWine = createAsyncThunk<Bottle, CustomWineRegistrationRequest, { rejectValue: string }>(
  "cellar/registerCustomWine",
  async (customWine, { rejectWithValue }) => {
    try {
      const data = await registerCustomWineCellar(customWine);
      const bottle: Bottle = {
        bottleId: data.bottleId,
        createdAt: data.createdAt,
        wine: data.wine,
        isCustom: true,
        isBest: false,
        totalNote: 0,
      };
      return bottle;
    } catch (error) {
      return rejectWithValue("커스텀 와인 등록 실패");
    }
  }
);

const cellarSlice = createSlice({
  name: "cellar",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 셀러 조회
      .addCase(fetchCellar.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCellar.fulfilled, (state, action: PayloadAction<Bottle[]>) => {
        state.status = "succeeded";
        state.bottles = action.payload;
        state.totalCount = action.payload.length;
      })
      .addCase(fetchCellar.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "셀러 조회 실패";
      })

      // 셀러 추가
      .addCase(registerCellar.fulfilled, (state, action: PayloadAction<Bottle>) => {
        // 이미 있는 와인에 대해서 중복처리
        const alreadyExists = state.bottles.some((bottle) => bottle.wine.wineId === action.payload.wine.wineId);
        if (!alreadyExists) {
          state.bottles.push(action.payload);
          state.totalCount++;
        }
      })

      // 셀러 삭제
      .addCase(deleteCellar.fulfilled, (state, action: PayloadAction<number>) => {
        if (state.bottles.some((bottle) => bottle.bottleId === action.payload)) {
          state.bottles = state.bottles.filter((bottle) => bottle.bottleId !== action.payload);
          state.totalCount--;
        }
      })

      // 베스트 셀러 조회
      .addCase(fetchBest.pending, (state) => {
        state.beststatus = "loading";
      })
      .addCase(fetchBest.fulfilled, (state, action: PayloadAction<Bottle[]>) => {
        state.beststatus = "succeeded";
        state.bestBottles = action.payload;
      })
      .addCase(fetchBest.rejected, (state, action) => {
        state.beststatus = "failed";
        state.besterror = action.payload ?? "베스트 셀러 조회 실패";
      })

      // 베스트 셀러 등록
      .addCase(registerBest.fulfilled, (state, action) => {})

      // 베스트 셀러 해제
      .addCase(deleteBest.fulfilled, (state, action) => {})

      // 커스텀 와인 등록
      .addCase(registerCustomWine.fulfilled, (state, action: PayloadAction<Bottle>) => {
        if (!action.payload || !action.payload.wine) {
          // console.warn("⚠️ [cellarSlice] 응답 payload에 문제가 있습니다:", action.payload);
          return;
        }
        const alreadyExists = state.bottles.some((bottle) => {
          if (!bottle.wine) return false;
          return bottle.wine.name === action.payload.wine.name;
        });
        if (!alreadyExists) {
          // console.log("✅ [cellarSlice] 커스텀 와인 등록 완료:", action.payload);
          state.bottles.push(action.payload);
          state.totalCount++;
        }
      })
      .addCase(registerCustomWine.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerCustomWine.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "커스텀 와인 등록 실패";
      });
  },
});

export default cellarSlice.reducer;
