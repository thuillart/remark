export interface ErrorResponse {
  name: string;
  message: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ErrorResponse | null;
}

export interface PostOptions extends RequestInit {
  body?: string;
}

export interface PatchOptions extends RequestInit {
  body?: string;
}
