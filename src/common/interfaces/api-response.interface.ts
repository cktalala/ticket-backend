export interface ApiResponse<T = any> {
  status: number;
  data: T;
  message: string;
}

export interface ApiErrorResponse {
  status: number;
  error: string;
  message: string;
  timestamp: string;
  path: string;
}
