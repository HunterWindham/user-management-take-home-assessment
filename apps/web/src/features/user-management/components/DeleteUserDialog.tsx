import { useState, type FormEvent } from 'react';
import { Typography } from '@mui/material';
import { deleteUser } from '../services/userService';
import type { User } from '../types';
import { DialogForm } from '../../../components/DialogForm';

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

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();
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
    <DialogForm
      open={open}
      onClose={handleClose}
      title="Delete User"
      error={error}
      loading={loading}
      submitLabel={loading ? 'Deleting...' : 'Delete'}
      onSubmit={handleDelete}
      submitButtonColor="error"
      titleClassName="text-xl font-semibold pb-2 text-red-600"
    >
      <Typography variant="body1" className="text-gray-700">
        Are you sure you want to delete user{' '}
        <strong className="text-gray-900">{user?.name}</strong>? This action
        cannot be undone.
      </Typography>
    </DialogForm>
  );
};

