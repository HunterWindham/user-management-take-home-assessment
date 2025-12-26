/**
 * Public API for the user-management feature
 * Export all components, types, and services that should be accessible from outside the feature
 */

// Main feature component - encapsulates all user management logic
export { UserManagement } from './components/UserManagement';

// Individual components (exported for advanced use cases)
export { UsersTable, type UsersTableProps, type UsersTableRef } from './components/UsersTable';
export { CreateUserDialog } from './components/CreateUserDialog';
export { EditUserDialog } from './components/EditUserDialog';
export { DeleteUserDialog } from './components/DeleteUserDialog';

// Types
export type { User } from './types';

// Services (if needed externally)
export { fetchUsers, createUser, updateUser, deleteUser } from './services/userService';
export type { CreateUserInput, UpdateUserInput } from './services/userService';

