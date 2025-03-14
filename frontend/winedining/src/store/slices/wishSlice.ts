import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/axios";
/* 실제 개발할때는 주석 해제! */
// import { Wish, WishAddResponse, WishlistResponse } from "../../types/wish";

/* 아래 코드는 mockapi 가져오는 코드임.(테스트용) */
import { Wish } from "../../types/wish";
import { fetchMockWishList, addMockWish, removeMockWish } from "../../mocks/mockApi";

interface WishState {
  wishes: Wish[];
  totalCount: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: WishState = {
  wishes: [],
  totalCount: 0,
  status: "idle",
  error: null,
};

// // 위시리스트 조회
// export const fetchWishList = createAsyncThunk("wish/fetchWishList", async (_, { rejectWithValue }) => {
//   try {
//     const response = await api.get<WishlistResponse>("/v1/collection/wish");
//     return response.data.data;
//   } catch (error: any) {
//     return rejectWithValue(error.response?.data?.message || "위시리스트를 불러오는 데 실패했습니다.");
//   }
// });

// // 위시리스트 추가
// export const addToWishList = createAsyncThunk("wish/addToWishList", async (wineId: number, { rejectWithValue }) => {
//   try {
//     const response = await api.post<WishAddResponse>(`/v1/collection/wish/${wineId}`);
//     return response.data.data;
//   } catch (error: any) {
//     return rejectWithValue(error.response?.data?.message || "위시리스트 추가 실패");
//   }
// });

// // 위시리스트 삭제
// export const removeFromWishList = createAsyncThunk(
//   "wish/removeFromWishList",
//   async (wineId: number, { rejectWithValue }) => {
//     try {
//       await api.delete(`/v1/collection/wish/${wineId}`);
//       return wineId;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || "위시리스트 삭제 실패");
//     }
//   }
// );

// const wishSlice = createSlice({
//   name: "wish",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // 위시리스트 조회
//       .addCase(fetchWishList.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchWishList.fulfilled, (state, action: PayloadAction<{ wishes: Wish[]; total_count: number }>) => {
//         state.status = "succeeded";
//         state.wishes = action.payload.wishes;
//         state.totalCount = action.payload.total_count;
//       })
//       .addCase(fetchWishList.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload as string;
//       })

//       // 위시리스트 추가
//       .addCase(addToWishList.fulfilled, (state, action: PayloadAction<Wish>) => {
//         state.wishes.push(action.payload);
//         state.totalCount += 1;
//       })
//       .addCase(addToWishList.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload as string;
//       })

//       // 위시리스트 삭제
//       .addCase(removeFromWishList.fulfilled, (state, action: PayloadAction<number>) => {
//         state.wishes = state.wishes.filter((wish) => wish.id !== action.payload);
//         state.totalCount -= 1;
//       })
//       .addCase(removeFromWishList.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload as string;
//       });
//   },
// });

// export default wishSlice.reducer;

// 위시리스트 조회
export const fetchWishList = createAsyncThunk("wish/fetchWishList", async (_, { rejectWithValue }) => {
  try {
    const response: any = await fetchMockWishList();
    return response;
  } catch (error: any) {
    return rejectWithValue("위시리스트를 불러오는 데 실패했습니다.");
  }
});

// 위시리스트 추가
export const addToWishList = createAsyncThunk("wish/addToWishList", async (wineId: number, { rejectWithValue }) => {
  try {
    const response: any = await addMockWish(wineId);
    console.log("위시리스트 담기 성공");
    return response;
  } catch (error: any) {
    return rejectWithValue("위시리스트 추가 실패");
  }
});

// 위시리스트 삭제
export const removeFromWishList = createAsyncThunk(
  "wish/removeFromWishList",
  async (wineId: number, { rejectWithValue }) => {
    try {
      await removeMockWish(wineId);
      console.log("위시리스트 삭제 성공");
      return wineId;
    } catch (error: any) {
      return rejectWithValue("위시리스트 삭제 실패");
    }
  }
);

const wishSlice = createSlice({
  name: "wish",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 위시리스트 조회
      .addCase(fetchWishList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWishList.fulfilled, (state, action: PayloadAction<{ wishes: Wish[]; total_count: number }>) => {
        state.status = "succeeded";
        state.wishes = action.payload.wishes;
        state.totalCount = action.payload.total_count;
      })
      .addCase(fetchWishList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // 위시리스트 추가
      .addCase(addToWishList.fulfilled, (state, action: PayloadAction<Wish>) => {
        state.wishes.push(action.payload);
        state.totalCount += 1;
      })
      .addCase(addToWishList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // 위시리스트 삭제
      .addCase(removeFromWishList.fulfilled, (state, action: PayloadAction<number>) => {
        state.wishes = state.wishes.filter((wish) => wish.wine.id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(removeFromWishList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default wishSlice.reducer;
