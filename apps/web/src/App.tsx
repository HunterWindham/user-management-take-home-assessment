import { useState, useRef } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { UsersTable, type UsersTableRef } from './components/UsersTable';
import { UserDialog } from './components/UserDialog';
import { DeleteUserDialog } from './components/DeleteUserDialog';
import type { User } from './types';

function App() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const tableRef = useRef<UsersTableRef>(null);

  const handleSuccess = () => {
    // Refresh the table after successful create/update/delete
    tableRef.current?.refresh();
  };

  const handleCreateClick = () => {
    setDialogMode('create');
    setSelectedUser(null);
    setDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setDialogMode('edit');
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateClick}
        >
          Create User
        </Button>
      </Box>
      <UsersTable
        ref={tableRef}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
      />
      <UserDialog
        open={dialogOpen}
        mode={dialogMode}
        user={selectedUser}
        onClose={handleCloseDialog}
        onSuccess={handleSuccess}
      />
      <DeleteUserDialog
        open={deleteDialogOpen}
        user={userToDelete}
        onClose={handleCloseDeleteDialog}
        onSuccess={handleSuccess}
      />
    </Container>
  );
}

export default App;
