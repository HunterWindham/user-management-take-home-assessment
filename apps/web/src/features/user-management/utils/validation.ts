/**
 * Validation utilities for user forms
 */

export type UserFormData = {
  name: string;
  zipCode: string;
};

/**
 * Validates user form data
 * @returns null if valid, or a validation error message
 */
export const validateUserForm = (data: UserFormData): string | null => {
  const trimmedName = data.name.trim();
  const trimmedZipCode = data.zipCode.trim();

  if (!trimmedName) {
    return 'Name is required';
  }

  if (trimmedName.length > 255) {
    return 'Name must be 255 characters or less';
  }

  if (trimmedZipCode) {
    if (trimmedZipCode.length < 3) {
      return 'Zip code must be at least 3 characters if provided';
    }
    if (trimmedZipCode.length > 20) {
      return 'Zip code must be 20 characters or less';
    }
  }

  return null;
};

