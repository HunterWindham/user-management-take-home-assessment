import { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import type { User } from '../types';
import { fetchUsers } from '../services/userService';

export type UsersTableProps = {
  onEditUser: (user: User) => void;
};

export type UsersTableRef = {
  refresh: () => Promise<void>;
};

export const UsersTable = forwardRef<UsersTableRef, UsersTableProps>(
  ({ onEditUser }, ref) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
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
  };

  useImperativeHandle(ref, () => ({
    refresh: loadUsers,
  }));

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Zip Code</TableCell>
            <TableCell align="right">Latitude</TableCell>
            <TableCell align="right">Longitude</TableCell>
            <TableCell>Timezone</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography>No users found</Typography>
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.zipCode ?? '—'}</TableCell>
                <TableCell align="right">{user.latitude?.toFixed(4) ?? '—'}</TableCell>
                <TableCell align="right">{user.longitude?.toFixed(4) ?? '—'}</TableCell>
                <TableCell>{user.timezone ?? '—'}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => onEditUser(user)}
                    aria-label="edit user"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
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

