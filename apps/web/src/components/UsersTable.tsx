import { useEffect, useState, useImperativeHandle, forwardRef, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
  IconButton,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { User } from '../types';
import { fetchUsers } from '../services/userService';

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
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
        className="rounded-lg border border-gray-200 bg-white"
      >
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Loading users...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
        className="rounded-lg border border-red-200 bg-red-50"
      >
        <Alert severity="error" className="w-full max-w-md">
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <TableContainer 
      component={Paper} 
      className="rounded-lg shadow-sm border border-gray-200 overflow-x-auto"
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow className="bg-gray-50">
            <TableCell className="font-semibold">Name</TableCell>
            <TableCell className="font-semibold">Zip Code</TableCell>
            <TableCell className="font-semibold">Latitude</TableCell>
            <TableCell className="font-semibold">Longitude</TableCell>
            <TableCell className="font-semibold">Timezone</TableCell>
            <TableCell className="font-semibold" align="center">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" className="py-12">
                <Typography variant="body1" color="text.secondary">
                  No users found. Create your first user to get started.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow 
                key={user.id} 
                hover 
                className="transition-colors"
              >
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.zipCode ?? <span className="text-gray-400">—</span>}</TableCell>
                <TableCell>
                  {user.latitude !== null ? (
                    <span className="font-mono text-sm">{user.latitude.toFixed(4)}</span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {user.longitude !== null ? (
                    <span className="font-mono text-sm">{user.longitude.toFixed(4)}</span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {user.timezone ?? <span className="text-gray-400">—</span>}
                </TableCell>
                <TableCell align="center">
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
  }
);

UsersTable.displayName = 'UsersTable';

