import { useEffect, useState, useImperativeHandle, forwardRef, useCallback } from 'react';
import { Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { User } from '../types';
import { fetchUsers } from '../services/userService';
import { LoadingState } from '../../../components/LoadingState';
import { ErrorState } from '../../../components/ErrorState';
import { DataTable, type Column } from '../../../components/DataTable';

export type UsersTableProps = {
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
};

export type UsersTableRef = {
  refresh: () => Promise<void>;
};

export const UsersTable = forwardRef<UsersTableRef, UsersTableProps>(
  ({ onEditUser, onDeleteUser }, ref) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Failed to load users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    refresh: loadUsers,
  }), [loadUsers]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  if (loading) {
    return <LoadingState message="Loading users..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  const columns: Column<User>[] = [
    {
      header: 'Name',
      render: (user) => <span className="font-medium">{user.name}</span>,
    },
    {
      header: 'Zip Code',
      render: (user) => user.zipCode ?? <span className="text-gray-400">—</span>,
    },
    {
      header: 'Latitude',
      render: (user) =>
        user.latitude !== null ? (
          <span className="font-mono text-sm">{user.latitude.toFixed(4)}</span>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    {
      header: 'Longitude',
      render: (user) =>
        user.longitude !== null ? (
          <span className="font-mono text-sm">{user.longitude.toFixed(4)}</span>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    {
      header: 'Timezone',
      render: (user) => user.timezone ?? <span className="text-gray-400">—</span>,
    },
    {
      header: 'Actions',
      align: 'center',
      render: (user) => (
        <Box display="flex" gap={0.5} justifyContent="center">
          <IconButton
            size="small"
            onClick={() => onEditUser(user)}
            aria-label="edit user"
            className="hover:bg-blue-50"
          >
            <EditIcon fontSize="small" className="text-blue-600" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDeleteUser(user)}
            aria-label="delete user"
            className="hover:bg-red-50"
          >
            <DeleteIcon fontSize="small" className="text-red-600" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={users}
      getRowKey={(user) => user.id}
      emptyMessage="No users found. Create your first user to get started."
    />
  );
  }
);

UsersTable.displayName = 'UsersTable';

