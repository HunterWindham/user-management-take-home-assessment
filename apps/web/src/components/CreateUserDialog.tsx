import { useState, type FormEvent } from 'react';
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
import { createUser, type CreateUserInput } from '../services/userService';

type CreateUserDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export const CreateUserDialog = ({
  open,
  onClose,
  onSuccess,
}: CreateUserDialogProps) => {
  const [name, setName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

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
      const input: CreateUserInput = {
        name: name.trim(),
        ...(zipCode.trim() && { zipCode: zipCode.trim() }),
      };

      await createUser(input);
      handleClose();
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setName('');
      setZipCode('');
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Create New User</DialogTitle>
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
              helperText="Optional. 3-20 characters. Location data will be fetched automatically."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Creating...' : 'Create User'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

