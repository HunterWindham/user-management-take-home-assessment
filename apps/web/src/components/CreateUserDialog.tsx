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
import { validateUserForm } from '../utils/validation';

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
    const validationError = validateUserForm({ name, zipCode });
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      const input: CreateUserInput = {
        name: name.trim(),
        zipCode: zipCode.trim(),
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
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle className="text-xl font-semibold pb-2">
          Create New User
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} pt={1}>
            {error && (
              <Alert severity="error" className="rounded-lg">
                {error}
              </Alert>
            )}
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              disabled={loading}
              helperText="Required. 1-255 characters."
              autoFocus
              variant="outlined"
              className="rounded-lg"
            />
            <TextField
              label="Zip Code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              fullWidth
              disabled={loading}
              helperText="Optional. 3-20 characters. Location data will be fetched automatically."
              variant="outlined"
            />
          </Box>
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
            type="submit" 
            variant="contained" 
            disabled={loading}
            className="min-w-[120px]"
          >
            {loading ? 'Creating...' : 'Create User'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

