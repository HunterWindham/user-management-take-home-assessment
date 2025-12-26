/**
 * API response wrapper matching the server's ApiResponse format
 */
export type ApiResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
};
