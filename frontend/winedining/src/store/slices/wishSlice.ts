import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchWishlist, addWishlist, removeWishlist } from "../../api/wishApi";
import { WishItem } from "../../types/wish";

interface WishState {
  items: WishItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  totalCount: number;
}

const initialState: WishState = {
  items: [],
  status: "idle",
  error: null,
  totalCount: 0,
};

// 위시 리스트 조회
export const fetchWishes = createAsyncThunk<WishItem[], void, { rejectValue: string }>(
  "wish/fetchWishes",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchWishlist();
      return data.wishes;
    } catch (error) {
      return rejectWithValue("위시리스트 조회 실패");
    }
  }
);

// 위시리스트 추가
export const addWish = createAsyncThunk<WishItem, number, { rejectValue: string }>(
  "wish/addWish",
  async (wineId, { rejectWithValue }) => {
    try {
      const data = await addWishlist(wineId);
      return data;
    } catch (error) {
      return rejectWithValue("위시리스트 추가 실패");
    }
  }
);

// 위시리스트 삭제
export const removeWish = createAsyncThunk<number, number, { rejectValue: string }>(
  "wish/removeWish",
  async (wineId, { rejectWithValue }) => {
    try {
      const deletedId = await removeWishlist(wineId);
      return deletedId;
    } catch (error) {
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
      .addCase(fetchWishes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWishes.fulfilled, (state, action: PayloadAction<WishItem[]>) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.totalCount = action.payload.length;
      })
      .addCase(fetchWishes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "위시리스트 조회 실패";
      })
      // 위시리스트 추가
      .addCase(addWish.fulfilled, (state, action: PayloadAction<WishItem>) => {
        const alreadyExists = state.items.some((item) => item.wine.wineId === action.payload.wine.wineId);
        if (!alreadyExists) {
          state.items.push(action.payload);
          state.totalCount++;
        }
      })
      // 위시리스트 삭제
      .addCase(removeWish.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter((item) => item.wine.wineId !== action.payload);
        state.totalCount--;
      });
  },
});

export default wishSlice.reducer;
