import { useState, useRef } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { UsersTable, type UsersTableRef } from './UsersTable';
import { CreateUserDialog } from './CreateUserDialog';
import { EditUserDialog } from './EditUserDialog';
import { DeleteUserDialog } from './DeleteUserDialog';
import type { User } from '../types';

/**
 * Main UserManagement component that encapsulates all user management logic
 * Handles state management for dialogs and user operations
 */
export const UserManagement = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const tableRef = useRef<UsersTableRef>(null);

  const handleSuccess = () => {
    // Refresh the table after successful create/update/delete
    tableRef.current?.refresh();
  };

  const handleCreateClick = () => {
    setCreateDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedUser(null);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Container maxWidth="lg" className="py-8">
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          mb={4}
          pt={4}
          className="flex-col sm:flex-row gap-4"
        >
          <Typography 
            variant="h4" 
            component="h1" 
            className="font-bold text-gray-900"
          >
            User Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateClick}
            className="shadow-md hover:shadow-lg transition-shadow"
            size="large"
          >
            Create User
          </Button>
        </Box>
        <UsersTable
          ref={tableRef}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
        />
        <CreateUserDialog
          open={createDialogOpen}
          onClose={handleCloseCreateDialog}
          onSuccess={handleSuccess}
        />
        <EditUserDialog
          open={editDialogOpen}
          user={selectedUser}
          onClose={handleCloseEditDialog}
          onSuccess={handleSuccess}
        />
        <DeleteUserDialog
          open={deleteDialogOpen}
          user={userToDelete}
          onClose={handleCloseDeleteDialog}
          onSuccess={handleSuccess}
        />
      </Container>
    </div>
  );
};

