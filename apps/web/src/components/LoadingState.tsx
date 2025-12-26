import { Box, CircularProgress, Typography } from '@mui/material';

type LoadingStateProps = {
  message?: string;
  minHeight?: string;
};

export const LoadingState = ({ 
  message = 'Loading...', 
  minHeight = '400px' 
}: LoadingStateProps) => {
  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight={minHeight}
      className="rounded-lg border border-gray-200 bg-white"
    >
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </Box>
    </Box>
  );
};

