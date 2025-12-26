import { type ReactNode, type FormEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
} from '@mui/material';

type DialogFormProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  error?: string | null;
  loading?: boolean;
  submitLabel: string;
  cancelLabel?: string;
  onSubmit: (e: FormEvent) => void | Promise<void>;
  children: ReactNode;
  submitButtonVariant?: 'contained' | 'text' | 'outlined';
  submitButtonColor?: 'primary' | 'error' | 'inherit' | 'secondary' | 'success' | 'info' | 'warning';
  titleClassName?: string;
};

export const DialogForm = ({
  open,
  onClose,
  title,
  error,
  loading = false,
  submitLabel,
  cancelLabel = 'Cancel',
  onSubmit,
  children,
  submitButtonVariant = 'contained',
  submitButtonColor = 'primary',
  titleClassName,
}: DialogFormProps) => {
  const handleClose = () => {
    if (!loading) {
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
      <form onSubmit={onSubmit}>
        <DialogTitle className={titleClassName || 'text-xl font-semibold pb-2'}>
          {title}
        </DialogTitle>
        <DialogContent>
          <div className="pt-1">
            {error && (
              <Alert severity="error" className="rounded-lg mb-3">
                {error}
              </Alert>
            )}
            {children}
          </div>
        </DialogContent>
        <DialogActions className="px-6 pb-4 gap-2">
          <Button 
            onClick={handleClose} 
            disabled={loading}
            variant="outlined"
          >
            {cancelLabel}
          </Button>
          <Button 
            type="submit" 
            variant={submitButtonVariant}
            color={submitButtonColor}
            disabled={loading}
            className="min-w-[120px]"
          >
            {submitLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

