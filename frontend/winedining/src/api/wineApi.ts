import api from "./axios";
import { Wine } from "../types/wine";

// 검색으로 와인 등록
export const registerWineBySearch = async (wineId: number) => {
  try {
    const response = await api.post(`/v1/collection/cellar/${wineId}`);
    return response.data;
  } catch (error) {
    console.error("검색 와인 등록 실패:", error);
    throw error;
  }
};

// ✅ 와인 검색 API
export const fetchFilteredWines = async (query: string) => {
  try {
    const response = await api.get(`/wines?search=${query}`);
    return response.data as Wine[];
  } catch (error) {
    console.error("와인 검색 오류:", error);
    return [];
  }
};
