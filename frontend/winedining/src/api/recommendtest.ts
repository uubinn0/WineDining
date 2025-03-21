import axios from "axios";

export interface PreferenceRequest {
  alcohol_degree: number;
  sweetness: number;
  aftertaste: number;
  acidity: number;
  body: number;
  preferred_types: string[];
  remember_preference: boolean;
}

interface ApiResponse {
  status: number;
  success: boolean;
  message: string;
}

export const sendPreferenceTest = async (
  data: PreferenceRequest
): Promise<ApiResponse> => {
  try {
    const response = await axios.post<ApiResponse>(
      "/api/v1/recommend/test",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        status: error.response.status,
        success: false,
        message: error.response.data.message || "서버 오류가 발생했습니다.",
      };
    }
    return {
      status: 500,
      success: false,
      message: "알 수 없는 오류가 발생했습니다.",
    };
  }
};
