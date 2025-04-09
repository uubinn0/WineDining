import axios from "axios";
import {
  WineCellarResponse,
  WineRegistrationResponse,
  WineCellarBestResponse,
  CustomWineRegistrationResponse,
  CustomWineRegistrationRequest,
} from "../types/seller";

// baseURL 제거 → proxy 설정 적용됨
const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// 와인 셀러 조회
export const fetchWineCellar = async (page: number) => {
  const response = await api.get(`/api/v1/collection/cellar?page=${page}`);
  return response.data.data;
};

// 와인 셀러 등록
export const registerWineCellar = async (wineId: number) => {
  const response = await api.post(`/api/v1/collection/cellar/${wineId}`);
  return response.data.data;
};

// 와인 셀러 삭제
export const deleteWineCellar = async (bottleId: number) => {
  const response = await api.delete(`/api/v1/collection/cellar/${bottleId}`);
  return response.data;
};

// best 와인 셀러 조회
export const fetchBestWineCellar = async (): Promise<WineCellarBestResponse> => {
  const response = await api.get("/api/v1/collection/cellar/best");
  return response.data.data;
};

// best 와인 셀러 등록
export const registerBestWineCellar = async (bottleId: number): Promise<string> => {
  const response = await api.patch(`/api/v1/collection/cellar/${bottleId}/best`, {
    best: true,
  });
  return response.data.message;
};

// best 와인 셀러 해제
export const cancelBestWineCellar = async (bottleId: number): Promise<string> => {
  const response = await api.patch(`/api/v1/collection/cellar/${bottleId}/best`, {
    best: false,
  });
  return response.data.message;
};

// custom 와인 등록
export const registerCustomWineCellar = async (
  wine: CustomWineRegistrationRequest
): Promise<CustomWineRegistrationResponse["data"]> => {
  const response = await api.post(`/api/v1/collection/cellar/custom`, wine);
  // console.log("✅ [API] 커스텀 와인 등록 응답:", response.data);
  return response.data.data;
};
