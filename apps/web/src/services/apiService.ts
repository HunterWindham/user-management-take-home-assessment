import { API_BASE_URL } from '../config/api';
import type { ApiResponse } from '../types';

/**
 * Base API service that provides common HTTP methods
 * with consistent error handling and response parsing
 */
class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Performs a fetch request with error handling
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    // Try to parse error response if request failed
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `Request failed: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    // Parse successful response
    const apiResponse: ApiResponse<T> = await response.json();

    // Validate API response structure
    if (!apiResponse.success) {
      throw new Error(
        apiResponse.message || 'Request failed: Unknown error'
      );
    }

    // For DELETE requests, data might be undefined
    if (apiResponse.data === undefined && options.method !== 'DELETE') {
      throw new Error(apiResponse.message || 'Request failed: No data returned');
    }

    return apiResponse.data as T;
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T = void>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

// Export a singleton instance
export const apiService = new ApiService();

// Also export the class for testing or custom instances
export { ApiService };

