// store/slices/authSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface UserProfile {
  userId: number;
  nickname: string;
  email: string | null;
  rank: string | null;
  preference: boolean;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null,
  isAuthenticated: !!localStorage.getItem("user"),
  status: "idle",
  error: null,
};

//  사용자 정보 가져오기
export const fetchUserProfile = createAsyncThunk<UserProfile, void, { rejectValue: string }>(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/v1/user/profile", {
        withCredentials: true,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue("유저 정보 불러오기 실패");
    }
  }
);

//  닉네임 수정하기
export const updateNickname = createAsyncThunk<
  string, // 새 닉네임 반환
  string, // 새 닉네임 전달
  { rejectValue: string }
>("auth/updateNickname", async (nickname, { rejectWithValue }) => {
  try {
    const response = await axios.patch("/api/v1/user/profile", { nickname }, { withCredentials: true });
    return response.data.data.nickname;
  } catch (error) {
    return rejectWithValue("닉네임 변경 실패");
  }
});

//  로그아웃
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await axios.post("/api/v1/auth/logout", {}, { withCredentials: true });
  localStorage.removeItem("user");
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.status = "succeeded";
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "유저 정보 불러오기 실패";
      })

      .addCase(updateNickname.fulfilled, (state, action: PayloadAction<string>) => {
        if (state.user) {
          state.user.nickname = action.payload;
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = "idle";
        localStorage.removeItem("user");
      });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
