export interface InfoItem {
  id: number;
  title: string;
}

export interface InfoResponseData {
  infos: InfoItem[];
  totalCount: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface InfoResponse {
  status: number;
  success: boolean;
  message: string;
  data: InfoResponseData;
}

export interface InfoDetail {
  id: number;
  title: string;
  content: string;
}

export interface InfoDetailResponse {
  status: number;
  success: boolean;
  message: string;
  data: InfoDetail;
}
