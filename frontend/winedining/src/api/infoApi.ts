import axios from "axios";
import { InfoItem, InfoResponse, InfoResponseData, InfoDetailResponse, InfoDetail } from "../types/info";

// baseURL 제거 → proxy 설정 적용됨
const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// 알쓸신잡 정보 조회
export const fetchInfo = async () => {
  const response = await api.get("/api/v1/info/wine");
  return response.data.data;
};

// 알쓸신잡 상세 정보
export const fetchInfoDetail = async (infoId: number): Promise<InfoDetail> => {
  try {
    const response = await api.get<InfoDetailResponse>(`/api/v1/info/wine/${infoId}`);
    return response.data.data;
  } catch (error) {
    console.log("알쓸신잡 상세보기 실패", error);
    throw error;
  }
};
