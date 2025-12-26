import { Box, Alert } from '@mui/material';

type ErrorStateProps = {
  message: string;
  minHeight?: string;
};

export const ErrorState = ({ 
  message, 
  minHeight = '400px' 
}: ErrorStateProps) => {
  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight={minHeight}
      className="rounded-lg border border-red-200 bg-red-50"
    >
      <Alert severity="error" className="w-full max-w-md">
        {message}
      </Alert>
    </Box>
  );
};

