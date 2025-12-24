export interface UserData {
  id: string;
  name: string;
  zipCode: string | null;
  latitude: number | null;
  longitude: number | null;
  timezone: string | null;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}
