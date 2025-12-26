import { TextField, Box } from '@mui/material';

type UserFormFieldsProps = {
  name: string;
  zipCode: string;
  onNameChange: (value: string) => void;
  onZipCodeChange: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
};

export const UserFormFields = ({
  name,
  zipCode,
  onNameChange,
  onZipCodeChange,
  disabled = false,
  autoFocus = false,
}: UserFormFieldsProps) => {
  return (
    <Box display="flex" flexDirection="column" gap={3} pt={2}>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        required
        fullWidth
        disabled={disabled}
        helperText="Required. 1-255 characters."
        autoFocus={autoFocus}
        variant="outlined"
        className="rounded-lg"
      />
      <TextField
        label="Zip Code"
        value={zipCode}
        onChange={(e) => onZipCodeChange(e.target.value)}
        fullWidth
        disabled={disabled}
        helperText="Optional. 3-20 characters."
        variant="outlined"
      />
    </Box>
  );
};

