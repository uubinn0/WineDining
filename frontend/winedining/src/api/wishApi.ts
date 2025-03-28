import axios from "axios";
import { WishItem, WishListResponse } from "../types/wish";

const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// 전체 위시리스트 조회
export const fetchWishlist = async (): Promise<WishListResponse> => {
  const response = await api.get("/api/v1/collection/wish");
  return response.data.data;
};

// 위시리스트 추가
export const addWishlist = async (wineId: number): Promise<WishItem> => {
  try {
    console.log("📦 담기 요청 보내는 중: wineId =", wineId);
    const response = await api.post(
      `/api/v1/collection/wish/${wineId}`,
      {},
      {
        withCredentials: true, // 반드시 추가!
      }
    );
    console.log("담기 성공:", response.data);
    return response.data.data;
  } catch (error: any) {
    console.error("담기 실패", error.response?.data || error.message);
    throw error;
  }
};

// 위시리스트 제거
export const removeWishlist = async (wineId: number): Promise<number> => {
  await api.delete(`/api/v1/collection/wish/${wineId}`);
  return wineId;
};
