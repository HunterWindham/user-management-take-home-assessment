import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import { deleteUser } from '../services/userService';
import type { User } from '../types';

type DeleteUserDialogProps = {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
};

export const DeleteUserDialog = ({
  open,
  user,
  onClose,
  onSuccess,
}: DeleteUserDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      await deleteUser(user.id);
      handleClose();
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
    >
      <DialogTitle className="text-xl font-semibold pb-2 text-red-600">
        Delete User
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" className="rounded-lg mb-3">
            {error}
          </Alert>
        )}
        <Typography variant="body1" className="text-gray-700">
          Are you sure you want to delete user{' '}
          <strong className="text-gray-900">{user?.name}</strong>? This action
          cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions className="px-6 pb-4 gap-2">
        <Button 
          onClick={handleClose} 
          disabled={loading}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          disabled={loading}
          className="min-w-[100px]"
        >
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

