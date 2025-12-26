import { useState, type FormEvent } from 'react';
import { createUser, type CreateUserInput } from '../services/userService';
import { validateUserForm } from '../utils/validation';
import { DialogForm } from './DialogForm';
import { UserFormFields } from './UserFormFields';

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
    <DialogForm
      open={open}
      onClose={handleClose}
      title="Create New User"
      error={error}
      loading={loading}
      submitLabel={loading ? 'Creating...' : 'Create User'}
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

