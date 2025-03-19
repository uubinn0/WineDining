import api from "./axios";

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

// 이미지로 와인 등록
export const registerWineByImage = async (imageFile: File) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await api.post(`/v1/collection/cellar/custom`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("이미지 와인 등록 실패:", error);
    throw error;
  }
};
