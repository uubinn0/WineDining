// store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthState {
  userId: number | null;
  nickname: string | null;
  email: string | null;
  rank: string | null;
  preference: boolean;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  userId: null,
  nickname: null,
  email: null,
  rank: null,
  preference: true,
  isAuthenticated: false,
  status: "idle",
  error: null,
};

// 사용자 프로필 조회
export const fetchUserProfile = createAsyncThunk("auth/fetchUserProfile", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/api/v1/user/profile", {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return response.data.data;
  } catch (err) {
    return rejectWithValue("사용자 정보 불러오기 실패");
  }
});

// 로그아웃
export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, { rejectWithValue }) => {
  try {
    await axios.post("/api/v1/auth/logout", {}, { withCredentials: true });
    return;
  } catch (err) {
    return rejectWithValue("로그아웃 실패");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<any>) => {
        const user = action.payload;
        state.userId = user.userId;
        state.nickname = user.nickname;
        state.email = user.email;
        state.rank = user.rank;
        state.preference = user.preference;
        state.isAuthenticated = true;
        state.status = "succeeded";
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.userId = null;
        state.nickname = null;
        state.email = null;
        state.rank = null;
        state.preference = true;
        state.isAuthenticated = false;
        state.status = "idle";
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(updateNickname.fulfilled, (state, action) => {
        state.nickname = action.payload;
      });
  },
});

// 닉네임 수정 Thunk
export const updateNickname = createAsyncThunk("auth/updateNickname", async (nickname: string, { rejectWithValue }) => {
  try {
    const response = await axios.patch("/api/v1/user/profile", { nickname }, { withCredentials: true });
    return response.data.data.nickname;
  } catch (error) {
    return rejectWithValue("닉네임 수정 실패");
  }
});

export default authSlice.reducer;
