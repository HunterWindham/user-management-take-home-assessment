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
import { updateUser, type UpdateUserInput } from '../services/userService';
import type { User } from '../types';
import { validateUserForm } from '../utils/validation';

type EditUserDialogProps = {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
};

export const EditUserDialog = ({
  open,
  user,
  onClose,
  onSuccess,
}: EditUserDialogProps) => {
  const [name, setName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate form when user changes
  useEffect(() => {
    if (user) {
      setName(user.name);
      setZipCode(user.zipCode ?? '');
    }
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) return;

    // Validation
    const validationError = validateUserForm({ name, zipCode });
    if (validationError) {
      setError(validationError);
      return;
    }

    // Check if anything changed
    const nameChanged = name.trim() !== user.name;
    const zipCodeChanged = zipCode.trim() !== (user.zipCode ?? '');

    if (!nameChanged && !zipCodeChanged) {
      setError('No changes detected');
      return;
    }

    try {
      setLoading(true);
      // Always send name (required), send zipCode if changed or to clear it
      const input: UpdateUserInput = {
        name: name.trim(),
      };
      
      if (zipCodeChanged) {
        // Allow clearing zipCode by sending null (undefined would be omitted from JSON)
        input.zipCode = zipCode.trim() ? zipCode.trim() : null;
      }

      await updateUser(user.id, input);
      handleClose();
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
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
      PaperProps={{
        className: "rounded-lg",
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle className="text-xl font-semibold pb-2">
          Edit User
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
            />
            <TextField
              label="Zip Code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              fullWidth
              disabled={loading}
              helperText="Optional. 3-20 characters. Leave empty to clear. Location data will be re-fetched if changed."
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
            {loading ? 'Updating...' : 'Update User'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

