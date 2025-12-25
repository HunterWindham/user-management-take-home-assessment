import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import type { User, ApiResponse } from '../types';

export type CreateUserInput = {
  name: string;
  zipCode?: string;
};

export type UpdateUserInput = {
  name?: string;
  zipCode?: string | null;
};

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

/**
 * Creates a new user
 */
export const createUser = async (input: CreateUserInput): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.users}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to create user: ${response.statusText}`
    );
  }

  const apiResponse: ApiResponse<User> = await response.json();

  if (!apiResponse.success || !apiResponse.data) {
    throw new Error(apiResponse.message || 'Failed to create user');
  }

  return apiResponse.data;
};

/**
 * Updates an existing user
 */
export const updateUser = async (
  id: string,
  input: UpdateUserInput
): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.users}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to update user: ${response.statusText}`
    );
  }

  const apiResponse: ApiResponse<User> = await response.json();

  if (!apiResponse.success || !apiResponse.data) {
    throw new Error(apiResponse.message || 'Failed to update user');
  }

  return apiResponse.data;
};

