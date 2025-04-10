import axios from "axios";
import { WineRecommendation } from "../types/wine";
// 요청할 데이터 형식
export interface RecommendRequest {
  pairing: string | null;
}



// interface WineRecommendation {
//   wineId: number;
//   krName: string;
//   enName: string;
//   image: string | null;
//   type: string;
//   country: string;
//   grape: string;
//   price: number | null;
//   sweetness: number;
//   acidity: number;
//   tannin: number;
//   body: number;
//   alcoholContent: number;
//   pairing: string[];
//   description: string;
// }

interface ApiResponse {
  status: number;
  success: boolean;
  message: string;
  data: WineRecommendation[];
}
// 추천 와인 API 요청 (POST 방식)
export const getWineRecommendations = async (
  data: RecommendRequest
): Promise<ApiResponse> => {
  try {
    const response = await axios.post<ApiResponse>(
      "/api/v1/recommend", 
      { pairing: data.pairing },  // 요청 body에 pairing 데이터 포함
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // 쿠키와 자격 증명 포함
      }
    );

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        status: error.response.status,
        success: false,
        message: error.response.data.message || "서버 오류가 발생했습니다.",
        data: [],
      };
    }
    return {
      status: 500,
      success: false,
      message: "알 수 없는 오류가 발생했습니다.",
      data: [],
    };
  }
};
