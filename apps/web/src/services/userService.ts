import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import type { User, ApiResponse } from '../types';

/**
 * Fetches all users from the API
 */
export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.users}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.statusText}`);
  }

  const apiResponse: ApiResponse<User[]> = await response.json();

  if (!apiResponse.success || !apiResponse.data) {
    throw new Error(apiResponse.message || 'Failed to fetch users');
  }

  return apiResponse.data;
};

