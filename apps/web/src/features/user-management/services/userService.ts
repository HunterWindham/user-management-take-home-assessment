import { API_ENDPOINTS } from '../../../config/api';
import { apiService } from '../../../services/apiService';
import type { User } from '../types';

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
  return apiService.get<User[]>(API_ENDPOINTS.users);
};

/**
 * Creates a new user
 */
export const createUser = async (input: CreateUserInput): Promise<User> => {
  return apiService.post<User>(API_ENDPOINTS.users, input);
};

/**
 * Updates an existing user
 */
export const updateUser = async (
  id: string,
  input: UpdateUserInput
): Promise<User> => {
  return apiService.put<User>(`${API_ENDPOINTS.users}/${id}`, input);
};

/**
 * Deletes a user
 */
export const deleteUser = async (id: string): Promise<void> => {
  return apiService.delete<void>(`${API_ENDPOINTS.users}/${id}`);
};

