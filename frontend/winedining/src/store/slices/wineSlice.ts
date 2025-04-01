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

// 와인 등록 (검색용) 추가해주세요!!
// export const postWineBySearch = createAsyncThunk;

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

/* 아래는 api 연결하기 전 코드이니 필요한 부분이 있으면 참고해서 사용하세요!!! */

// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import { Wine, WineFilter } from "../../types/wine";
// import { registerWineBySearch } from "../../api/wineApi";

// import { fetchFilteredWines } from "../../mocks/mockApi"; // 가짜 API 불러오기

// interface WineState {
//   wines: Wine[];
//   status: "idle" | "loading" | "succeeded" | "failed";
//   error: string | null;
// }

// const initialState: WineState = {
//   wines: [],
//   status: "idle",
//   error: null,
// };

// // 와인 리스트 가져오기
// export const fetchWines = createAsyncThunk<Wine[], WineFilter | undefined, { rejectValue: string }>(
//   "wine/fetchWines",
//   async (filter, { rejectWithValue }) => {
//     try {
//       const response = await fetchFilteredWines(filter);
//       return response as Wine[];
//     } catch (error) {
//       return rejectWithValue((error as Error).message || "와인 목록 불러오기 실패");
//     }
//   }
// );

// // 와인 등록 (검색)
// export const postWineBySearch = createAsyncThunk<Wine, number, { rejectValue: string }>(
//   "wine/postWineBySearch",
//   async (wineId, { rejectWithValue }) => {
//     try {
//       const response = await registerWineBySearch(wineId);
//       return response; // 백엔드에서 반환된 Wine 객체
//     } catch (error) {
//       return rejectWithValue("와인 등록 실패");
//     }
//   }
// );

// const wineSlice = createSlice({
//   name: "wine",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // 와인 목록 가져오기
//       .addCase(fetchWines.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchWines.fulfilled, (state, action: PayloadAction<Wine[]>) => {
//         state.status = "succeeded";
//         state.wines = action.payload;
//       })
//       .addCase(fetchWines.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload ?? "ubdefined 확인 불가!";
//       })

//       // 와인 등록 (검색)
//       .addCase(postWineBySearch.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(postWineBySearch.fulfilled, (state, action: PayloadAction<Wine>) => {
//         state.status = "succeeded";
//         state.wines.push(action.payload); // 등록된 와인을 리스트에 추가
//       })
//       .addCase(postWineBySearch.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload ?? "와인 등록 실패";
//       });
//   },
// });

// export default wineSlice.reducer;
