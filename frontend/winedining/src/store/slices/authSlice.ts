import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { withdrawUser } from "../../api/axios";

const hasAuthCookie = document.cookie.includes("Authorization=");

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
  user: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
};

// 사용자 정보 가져오기
export const fetchUserProfile = createAsyncThunk<UserProfile, void, { rejectValue: string }>(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/v1/user/profile", {
        withCredentials: true,
      });
      console.log("[fetchUserProfile] 성공 응답:", response.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue("유저 정보 불러오기 실패");
    }
  }
);

// 닉네임 수정하기
export const updateNickname = createAsyncThunk<
  string, // 새 닉네임 반환
  string, // 새 닉네임 전달
  { rejectValue: string }
>("auth/updateNickname", async (nickname, { rejectWithValue }) => {
  try {
    const response = await axios.patch("/api/v1/user/profile", { nickname }, { withCredentials: true });
    console.log("[updateNickname] 닉네임 수정 성공:", response.data);
    return response.data.data.nickname;
  } catch (error) {
    return rejectWithValue("닉네임 변경 실패");
  }
});

// 로그아웃
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await axios.post("/api/v1/auth/logout", {}, { withCredentials: true });
  console.log("[logoutUser] 로그아웃 완료");
  localStorage.removeItem("user");
});

// 회원탈퇴
export const deleteUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/deleteUser",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(
        "/api/v1/user/withdrawal",
        {
          confirmMessage: "회원 탈퇴에 동의합니다",
        },
        { withCredentials: true }
      );
      localStorage.removeItem("user");
    } catch (error) {
      console.error("[deleteUser] 실패:", error);
      return rejectWithValue("회원 탈퇴에 실패했습니다.");
    }
  }
);

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
        state.isAuthenticated = true; // 실제 로그인 성공일 때만 true
        state.status = "succeeded";
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "유저 정보 불러오기 실패";
        state.isAuthenticated = false; // 인증 실패로 false로 명시
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
      })
      /* 회원탈퇴 */
      .addCase(deleteUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = "idle";
        localStorage.removeItem("user");
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "회원 탈퇴 실패";
      });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
