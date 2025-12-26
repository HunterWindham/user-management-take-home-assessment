import { type ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { EmptyState } from './EmptyState';

export type Column<T> = {
  header: string;
  render: (item: T) => ReactNode;
  align?: 'left' | 'center' | 'right';
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  getRowKey: (item: T) => string | number;
  emptyMessage: string;
  minWidth?: number;
};

export const DataTable = <T,>({
  columns,
  data,
  getRowKey,
  emptyMessage,
  minWidth = 650,
}: DataTableProps<T>) => {
  return (
    <TableContainer 
      component={Paper} 
      className="rounded-lg shadow-sm border border-gray-200 overflow-x-auto"
    >
      <Table sx={{ minWidth }}>
        <TableHead>
          <TableRow className="bg-gray-50">
            {columns.map((column, index) => (
              <TableCell
                key={index}
                className="font-semibold"
                align={column.align}
              >
                {column.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <EmptyState message={emptyMessage} colSpan={columns.length} />
          ) : (
            data.map((item) => (
              <TableRow
                key={getRowKey(item)}
                hover
                className="transition-colors"
              >
                {columns.map((column, index) => (
                  <TableCell key={index} align={column.align}>
                    {column.render(item)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

