import { useState, useEffect, type FormEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
} from '@mui/material';
import {
  createUser,
  updateUser,
  type CreateUserInput,
  type UpdateUserInput,
} from '../services/userService';
import type { User } from '../types';

type UserDialogProps = {
  open: boolean;
  mode: 'create' | 'edit';
  user?: User | null;
  onClose: () => void;
  onSuccess: () => void;
};

export const UserDialog = ({
  open,
  mode,
  user,
  onClose,
  onSuccess,
}: UserDialogProps) => {
  const [name, setName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = mode === 'edit';

  // Populate form when user changes (edit mode only)
  useEffect(() => {
    if (isEditMode && user) {
      setName(user.name);
      setZipCode(user.zipCode ?? '');
    } else if (!isEditMode) {
      // Reset form for create mode
      setName('');
      setZipCode('');
    }
  }, [user, isEditMode]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation - name is required in both modes
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    // Check if anything changed (edit mode only)
    if (isEditMode) {
      if (!user) return;

      const nameChanged = name.trim() !== user.name;
      const zipCodeChanged = zipCode.trim() !== (user.zipCode ?? '');

      if (!nameChanged && !zipCodeChanged) {
        setError('No changes detected');
        return;
      }
    }

    // Common validation
    if (name.trim().length > 255) {
      setError('Name must be 255 characters or less');
      return;
    }

    if (zipCode.trim() && zipCode.trim().length < 3) {
      setError('Zip code must be at least 3 characters if provided');
      return;
    }

    if (zipCode.trim().length > 20) {
      setError('Zip code must be 20 characters or less');
      return;
    }

    try {
      setLoading(true);

      if (isEditMode && user) {
        // Edit mode: always send name (required), send zipCode if changed or to clear it
        const input: UpdateUserInput = {
          name: name.trim(),
        };
        const zipCodeChanged = zipCode.trim() !== (user.zipCode ?? '');

        if (zipCodeChanged) {
          // Allow clearing zipCode by sending null (undefined would be omitted from JSON)
          input.zipCode = zipCode.trim() ? zipCode.trim() : null;
        }

        await updateUser(user.id, input);
      } else {
        // Create mode
        const input: CreateUserInput = {
          name: name.trim(),
          ...(zipCode.trim() && { zipCode: zipCode.trim() }),
        };

        await createUser(input);
      }

      handleClose();
      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Failed to ${isEditMode ? 'update' : 'create'} user`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      if (!isEditMode) {
        // Reset form only in create mode (edit mode resets via useEffect)
        setName('');
        setZipCode('');
      }
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEditMode ? 'Edit User' : 'Create New User'}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              disabled={loading}
              helperText="Required. 1-255 characters."
              autoFocus
            />
            <TextField
              label="Zip Code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              fullWidth
              disabled={loading}
              helperText={
                isEditMode
                  ? 'Optional. 3-20 characters. Leave empty to clear. Location data will be re-fetched if changed.'
                  : 'Optional. 3-20 characters. Location data will be fetched automatically.'
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading
              ? isEditMode
                ? 'Updating...'
                : 'Creating...'
              : isEditMode
                ? 'Update User'
                : 'Create User'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

