import { TableRow, TableCell, Typography } from '@mui/material';

type EmptyStateProps = {
  message: string;
  colSpan?: number;
};

export const EmptyState = ({ 
  message, 
  colSpan = 1 
}: EmptyStateProps) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} align="center" className="py-12">
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

