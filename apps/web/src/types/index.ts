/**
 * User type matching the server's UserData interface
 * Fields can be null if location data hasn't been fetched yet
 */
export type User = {
  id: string;
  name: string;
  zipCode: string | null;
  latitude: number | null;
  longitude: number | null;
  timezone: string | null;
};

/**
 * API response wrapper matching the server's ApiResponse format
 */
export type ApiResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
};
