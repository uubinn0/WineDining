import axios from "axios";
import { WineCellarResponse, WineRegistrationResponse, WineCellarBestResponse } from "../types/seller";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 와인 셀러 조회
export const fetchWineCellar = async () => {
  const response = await api.get("/v1/collection/cellar");
  return response.data.data;
};

// 와인 셀러 등록
export const registerWineCellar = async (wineId: number) => {
  const response = await api.post(`/v1/collection/cellar/${wineId}`);
  return response.data.data;
};

// 와인 셀러 삭제
export const deleteWineCellar = async (bottleId: number) => {
  const response = await api.delete(`/v1/collection/cellar/${bottleId}`);
  return response.data;
};

// best 와인 셀러 조회
export const fetchBestWineCellar = async (): Promise<WineCellarBestResponse> => {
  const response = await api.get("/v1/collection/cellar/best");
  return response.data.data;
};

// best 와인 셀러 등록
export const registerBestWineCellar = async (bottleId: number): Promise<string> => {
  const response = await api.patch(`v1/collection/cellar/${bottleId}/best`);
  return response.data.message;
};

// best 와인 셀러 해제
export const cancelBestWineCellar = async (bottleId: number): Promise<string> => {
  const response = await api.patch(`/v1/collection/cellar/${bottleId}/best`);
  return response.data.message;
};
