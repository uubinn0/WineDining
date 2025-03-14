import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthState {
  username: string | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  username: null,
  accessToken: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
};

// 카카오 로그인 (사용자 인증 후 카카오 로그인 페이지로 이동)
export const kakaoLogin = createAsyncThunk(
  "auth/kakaoLogin",
  async ({ clientId, redirectUri }: { clientId: string; redirectUri: string }, { rejectWithValue }) => {
    try {
      const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
      window.location.href = kakaoAuthUrl;
    } catch (error) {
      return rejectWithValue("카카오 로그인 실패");
    }
  }
);

// 구글 로그인
export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (
    { clientId, redirectUri, state }: { clientId: string; redirectUri: string; state: string },
    { rejectWithValue }
  ) => {
    try {
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email profile&state=${state}`;
      window.location.href = googleAuthUrl;
    } catch (error) {
      return rejectWithValue("구글 로그인 실패");
    }
  }
);

// 소셜 로그인 후 서버에서 토큰 받아오기
export const socialLogin = createAsyncThunk(
  "auth/socialLogin",
  async ({ provider, code }: { provider: string; code: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/auth/${provider}`, { code });
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("username", response.data.username);
      return response.data;
    } catch (error) {
      return rejectWithValue("소셜 로그인 실패");
    }
  }
);

// 닉네임 변경 API
export const updateNickname = createAsyncThunk("auth/updateNickname", async (nickname: string, { rejectWithValue }) => {
  try {
    const response = await axios.put("/api/user/nickname", { nickname });
    return response.data; // 서버 응답 전체 반환 ({ success, data, error })
  } catch (error) {
    return rejectWithValue("닉네임 변경 실패");
  }
});

// 회원 탈퇴 API
export const deleteAccount = createAsyncThunk("auth/deleteAccount", async (_, { rejectWithValue }) => {
  try {
    await axios.delete("/api/user/me");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
  } catch (error) {
    return rejectWithValue("회원 탈퇴 실패");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.accessToken = null;
      state.isAuthenticated = false;
      state.username = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("username");
    },
  },
  extraReducers: (builder) => {
    builder
      // 소셜 로그인
      .addCase(socialLogin.fulfilled, (state, action: PayloadAction<{ accessToken: string; username: string }>) => {
        state.accessToken = action.payload.accessToken;
        state.username = action.payload.username;
        state.isAuthenticated = true;
      })
      // 닉네임 변경
      .addCase(updateNickname.fulfilled, (state, action: PayloadAction<{ username: string }>) => {
        state.username = action.payload.username;
        localStorage.setItem("username", action.payload.username);
      })
      // 회원 탈퇴
      .addCase(deleteAccount.fulfilled, (state) => {
        state.accessToken = null;
        state.isAuthenticated = false;
        state.username = null;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("username");
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
