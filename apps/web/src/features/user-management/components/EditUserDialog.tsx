import { useState, useEffect, type FormEvent } from 'react';
import { updateUser, type UpdateUserInput } from '../services/userService';
import type { User } from '../types';
import { validateUserForm } from '../utils/validation';
import { DialogForm } from '../../../components/DialogForm';
import { UserFormFields } from './UserFormFields';

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
    <DialogForm
      open={open}
      onClose={handleClose}
      title="Edit User"
      error={error}
      loading={loading}
      submitLabel={loading ? 'Updating...' : 'Update User'}
      onSubmit={handleSubmit}
    >
      <UserFormFields
        name={name}
        zipCode={zipCode}
        onNameChange={setName}
        onZipCodeChange={setZipCode}
        disabled={loading}
        autoFocus
      />
    </DialogForm>
  );
};

